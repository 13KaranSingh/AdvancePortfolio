import { motion, useReducedMotion } from "framer-motion";
import { createVariants } from "../motion/variants";
import { Theme } from "../types";

type NavbarProps = {
  theme: Theme;
  activeSection: "landing-page" | "projects";
  scrolled: boolean;
  onOpenModal: () => void;
  onToggleTheme: () => void;
};

function Navbar({ theme, activeSection, scrolled, onOpenModal, onToggleTheme }: NavbarProps) {
  const reducedMotion = !!useReducedMotion();
  const { fadeUp, underlineSlide } = createVariants(reducedMotion);

  return (
    <motion.nav
      className={`nav nav--premium ${scrolled ? "nav--scrolled" : ""}`}
      variants={fadeUp}
      initial="hidden"
      animate="show"
    >
      <a className="brand" href="#landing-page" aria-label="Go to top">
        <span className="brand__mark">KS</span>
      </a>

      <ul className="nav-links nav-links--premium">
        <li className="nav-item">
          <motion.a className="text-link" href="#landing-page" initial="rest" whileHover="hover" whileFocus="hover">
            Home
            <motion.span className="link-underline" variants={underlineSlide} />
            {activeSection === "landing-page" && (
              <motion.span className="nav-active-indicator" layoutId="nav-active" />
            )}
          </motion.a>
        </li>
        <li className="nav-item">
          <motion.a className="text-link" href="#projects" initial="rest" whileHover="hover" whileFocus="hover">
            Projects
            <motion.span className="link-underline" variants={underlineSlide} />
            {activeSection === "projects" && (
              <motion.span className="nav-active-indicator" layoutId="nav-active" />
            )}
          </motion.a>
        </li>
        <li className="nav-item">
          <motion.button className="text-link" onClick={onOpenModal} initial="rest" whileHover="hover" whileFocus="hover">
            About
            <motion.span className="link-underline" variants={underlineSlide} />
          </motion.button>
        </li>
        <li className="nav-item">
          <motion.button className="text-link" onClick={onOpenModal} initial="rest" whileHover="hover" whileFocus="hover">
            Contact
            <motion.span className="link-underline" variants={underlineSlide} />
          </motion.button>
        </li>
        <li>
          <motion.button
            className="contrast-toggle contrast-toggle--premium"
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            onClick={onToggleTheme}
            whileTap={reducedMotion ? undefined : { y: 1 }}
          >
            <span aria-hidden="true">◐</span>
          </motion.button>
        </li>
      </ul>
    </motion.nav>
  );
}

export default Navbar;
