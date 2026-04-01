type FooterProps = {
  resumePath: string;
  onContactClick: () => void;
};

function Footer({ resumePath, onContactClick }: FooterProps) {
  return (
    <footer className="site-footer">
      <div className="footer-links">
        <a href="https://github.com/13KaranSingh" target="_blank" rel="noreferrer">
          GitHub
        </a>
        <a href="https://www.linkedin.com/in/karanvir-singh-453616257" target="_blank" rel="noreferrer">
          LinkedIn
        </a>
        <button type="button" className="footer-contact-btn" onClick={onContactClick}>
          Contact
        </button>
        <a href={resumePath} target="_blank" rel="noreferrer">
          Resume
        </a>
      </div>
      <p>Copyright © 2026 Karanvir Singh</p>
    </footer>
  );
}

export default Footer;
