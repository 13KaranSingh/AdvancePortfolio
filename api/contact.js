const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 5;

const rateLimitMap = new Map();

function getClientIp(req) {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.length > 0) {
    return forwarded.split(",")[0].trim();
  }
  return req.socket?.remoteAddress || "unknown";
}

function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function parseBody(req) {
  if (!req.body) {
    return {};
  }

  if (typeof req.body === "string") {
    try {
      return JSON.parse(req.body);
    } catch {
      return {};
    }
  }

  return req.body;
}

function validateInput(body) {
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";
  const company = typeof body.company === "string" ? body.company.trim() : "";

  if (company) {
    return { ok: true, honeypot: true, name, email, message };
  }

  if (!name || !email || !message) {
    return { ok: false, error: "Name, email, and message are required." };
  }

  if (name.length > 120) {
    return { ok: false, error: "Name is too long." };
  }

  if (message.length < 10 || message.length > 5000) {
    return { ok: false, error: "Message must be between 10 and 5000 characters." };
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email) || email.length > 320) {
    return { ok: false, error: "Please provide a valid email address." };
  }

  return { ok: true, honeypot: false, name, email, message };
}

function isRateLimited(ip) {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  if (entry.count >= RATE_LIMIT_MAX_REQUESTS) {
    return true;
  }

  entry.count += 1;
  return false;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed." });
  }

  const ip = getClientIp(req);
  if (isRateLimited(ip)) {
    return res.status(429).json({ error: "Too many requests. Please try again in a minute." });
  }

  const parsed = validateInput(parseBody(req));
  if (!parsed.ok) {
    return res.status(400).json({ error: parsed.error });
  }

  if (parsed.honeypot) {
    return res.status(200).json({ ok: true });
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.CONTACT_TO_EMAIL || "karanvir_gurn@yahoo.com";
  const fromEmail = process.env.CONTACT_FROM_EMAIL || "Portfolio Contact <onboarding@resend.dev>";

  if (!resendApiKey) {
    return res.status(500).json({ error: "Contact service is not configured." });
  }

  const subject = `Portfolio contact from ${parsed.name}`;
  const text = `Name: ${parsed.name}\nEmail: ${parsed.email}\n\n${parsed.message}`;
  const html = `
    <div style="font-family: Inter, Arial, sans-serif; line-height:1.5; color:#0f172a;">
      <h2 style="margin:0 0 12px;">New Portfolio Contact</h2>
      <p><strong>Name:</strong> ${escapeHtml(parsed.name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(parsed.email)}</p>
      <p><strong>Message:</strong></p>
      <p style="white-space: pre-wrap;">${escapeHtml(parsed.message)}</p>
    </div>
  `;

  const resendResponse = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${resendApiKey}`
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [toEmail],
      reply_to: parsed.email,
      subject,
      text,
      html
    })
  });

  if (!resendResponse.ok) {
    const errorPayload = await resendResponse.text().catch(() => "");
    console.error("Resend error:", errorPayload);
    return res.status(502).json({ error: "Email delivery failed. Please try again shortly." });
  }

  return res.status(200).json({ ok: true });
}
