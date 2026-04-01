import { FormEvent, useEffect, useState } from "react";
import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import EngineeringFocus from "./components/EngineeringFocus";
import ExperienceSection from "./components/ExperienceSection";
import Navbar from "./components/Navbar";
import ProjectsGrid from "./components/ProjectsGrid";
import Section from "./components/Section";
import { Project, Theme } from "./types";

type ContactState = "idle" | "submitting" | "success" | "error";
type ActiveSection = "landing-page" | "projects";

const RESUME_PATH = "/assets/Revised-Resume-Full-time.pdf";
const isGitHubPages =
  typeof window !== "undefined" && window.location.hostname.endsWith("github.io");

const techStack = [
  { name: "React", iconUrl: "https://cdn.simpleicons.org/react/61DAFB" },
  { name: "TypeScript", iconUrl: "https://cdn.simpleicons.org/typescript/3178C6" },
  { name: "JavaScript", iconUrl: "https://cdn.simpleicons.org/javascript/F7DF1E" },
  { name: "Python", iconUrl: "https://cdn.simpleicons.org/python/3776AB" },
  { name: "Java", iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg" },
  { name: "C++", iconUrl: "https://cdn.simpleicons.org/cplusplus/00599C" },
  { name: "HTML", iconUrl: "https://cdn.simpleicons.org/html5/E34F26" },
  { name: "CSS", iconUrl: "https://cdn.simpleicons.org/css/1572B6" }
];

const projects: Project[] = [
  {
    title: "Float To Success",
    stack: "React, TypeScript, OpenAI, Bootstrap",
    description:
      "An AI assisted career exploration app that guides users toward roles aligned with their responses and interests.",
    image: "/assets/float-to-success.png",
    liveUrl: "https://13karansingh.github.io/Start_AI_Help/"
  },
  {
    title: "E-Commerce Platform",
    stack: "HTML, CSS, JavaScript",
    description:
      "A responsive storefront focused on clean product browsing, polished interaction details, and a purchase flow optimized for clarity.",
    image: "/assets/Screenshot 2024-06-26 at 2.11.50 PM.png",
    liveUrl: "https://13karansingh.github.io/Advance-E-Commerce/index.html"
  },
  {
    title: "Volunteer Website",
    stack: "HTML, CSS, JavaScript",
    description:
      "A volunteer matching platform that helps users discover opportunities and helps organizations manage participation with less friction.",
    image: "/assets/Screenshot 2024-06-26 at 2.13.29 PM.png",
    liveUrl: "https://volunteerconnect.co/"
  }
];

function App() {
  const reducedMotion = useReducedMotion();
  const [theme, setTheme] = useState<Theme>("dark");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [contactState, setContactState] = useState<ContactState>("idle");
  const [contactFeedback, setContactFeedback] = useState("");
  const [activeSection, setActiveSection] = useState<ActiveSection>("landing-page");
  const [navScrolled, setNavScrolled] = useState(false);
  const [formData, setFormData] = useState({
    user_name: "",
    user_email: "",
    message: "",
    company: ""
  });
  const { scrollYProgress } = useScroll();
  const progressScaleX = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 30,
    mass: 0.24
  });

  useEffect(() => {
    if (!isModalOpen) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsModalOpen(false);
      }
    };

    window.addEventListener("keydown", onEscape);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onEscape);
    };
  }, [isModalOpen]);

  useEffect(() => {
    const sections = [
      document.getElementById("landing-page"),
      document.getElementById("projects")
    ].filter(Boolean) as HTMLElement[];

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (!visible) {
          return;
        }

        const next = visible.target.id === "projects" ? "projects" : "landing-page";
        setActiveSection(next);
      },
      {
        threshold: [0.25, 0.45, 0.7],
        rootMargin: "-10% 0px -40% 0px"
      }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleTheme = () => {
    setTheme((current) => (current === "light" ? "dark" : "light"));
  };

  const submitContact = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formData.user_name.trim() || !formData.user_email.trim() || !formData.message.trim()) {
      setContactState("error");
      setContactFeedback("Please fill out all fields before submitting.");
      return;
    }

    // Honeypot bot field: ignore silently if filled.
    if (formData.company.trim()) {
      setContactState("success");
      setContactFeedback("Thanks for reaching out. I will get back to you soon.");
      return;
    }

    if (isGitHubPages) {
      const subject = encodeURIComponent(`Portfolio contact from ${formData.user_name.trim()}`);
      const body = encodeURIComponent(
        `Name: ${formData.user_name.trim()}\nEmail: ${formData.user_email.trim()}\n\n${formData.message.trim()}`
      );

      window.location.href = `mailto:karanvir_gurn@yahoo.com?subject=${subject}&body=${body}`;
      setContactState("success");
      setContactFeedback("GitHub Pages cannot run the contact API, so your email app was opened instead.");
      return;
    }

    setContactState("submitting");
    setContactFeedback("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.user_name.trim(),
          email: formData.user_email.trim(),
          message: formData.message.trim(),
          company: formData.company.trim()
        })
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error ?? "Could not send your message right now.");
      }

      setContactState("success");
      setContactFeedback("Message sent successfully. I will get back to you soon.");
      setFormData({ user_name: "", user_email: "", message: "", company: "" });
    } catch (error) {
      setContactState("error");
      setContactFeedback(error instanceof Error ? error.message : "Could not send your message.");
    }
  };

  return (
    <motion.main
      className={`app app--${theme}`}
      initial={{ opacity: 0, y: reducedMotion ? 0 : 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reducedMotion ? 0.2 : 0.42, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        className="scroll-progress"
        style={{ scaleX: progressScaleX, transformOrigin: "0% 50%" }}
        aria-hidden="true"
      />
      <section id="landing-page" className="landing-shell">
        <Navbar
          theme={theme}
          activeSection={activeSection}
          scrolled={navScrolled}
          onOpenModal={() => setIsModalOpen(true)}
          onToggleTheme={toggleTheme}
        />
        <Hero resumePath={RESUME_PATH} onOpenModal={() => setIsModalOpen(true)} />
        <EngineeringFocus />
        <ExperienceSection />
        <button
          className="quick-contact"
          onClick={() => setIsModalOpen(true)}
          aria-label="Open contact modal"
        >
          Contact
        </button>
      </section>

      <Section id="projects" className="projects-section">
        <h2>
          Here are some of my <span>Projects</span>
        </h2>
        <ProjectsGrid projects={projects} />
      </Section>

      <Footer resumePath={RESUME_PATH} onContactClick={() => setIsModalOpen(true)} />

      <div
        className={`modal-backdrop ${isModalOpen ? "modal-backdrop--open" : ""}`}
        onClick={() => setIsModalOpen(false)}
      />
      <div className={`modal-shell ${isModalOpen ? "modal-shell--open" : ""}`}>
        <div className="modal-about">
          <h2>About Me</h2>
          <p>
            I build reliable, production ready software with an emphasis on clean architecture and strong
            engineering fundamentals. My experience at AWS has strengthened how I think about
            scalability, performance, and shipping polished products that solve real problems.
          </p>
          <div className="skills-grid">
            {techStack.map((tech) => (
              <figure key={tech.name} className="skill-card">
                <img src={tech.iconUrl} alt={tech.name} />
                <figcaption>{tech.name}</figcaption>
              </figure>
            ))}
          </div>
        </div>

        <div className="modal-contact">
          <button className="modal-close" onClick={() => setIsModalOpen(false)} aria-label="Close modal">
            ×
          </button>
          <h2>Let&apos;s connect</h2>
          <p>I&apos;m open to internship and full-time software engineering opportunities.</p>

          <form className="contact-form" onSubmit={submitContact}>
            <label>
              Name
              <input
                type="text"
                value={formData.user_name}
                onChange={(event) =>
                  setFormData((current) => ({ ...current, user_name: event.target.value }))
                }
              />
            </label>

            <label>
              Email
              <input
                type="email"
                value={formData.user_email}
                onChange={(event) =>
                  setFormData((current) => ({ ...current, user_email: event.target.value }))
                }
              />
            </label>

            <label>
              Message
              <textarea
                rows={4}
                value={formData.message}
                onChange={(event) =>
                  setFormData((current) => ({ ...current, message: event.target.value }))
                }
              />
            </label>

            <label className="contact-honeypot" aria-hidden="true">
              Company
              <input
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={formData.company}
                onChange={(event) =>
                  setFormData((current) => ({ ...current, company: event.target.value }))
                }
              />
            </label>

            <button type="submit" disabled={contactState === "submitting"}>
              {contactState === "submitting" ? "Preparing..." : "Send it my way"}
            </button>

            {contactState === "success" && (
              <div className="form-status form-status--success">{contactFeedback}</div>
            )}
            {contactState === "error" && (
              <div className="form-status form-status--error">{contactFeedback}</div>
            )}
          </form>
        </div>
      </div>
    </motion.main>
  );
}

export default App;
