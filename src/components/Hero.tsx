import { motion, useReducedMotion } from "framer-motion";
import { createVariants } from "../motion/variants";

type HeroProps = {
  resumePath: string;
  onOpenModal: () => void;
};

function Hero({ resumePath, onOpenModal }: HeroProps) {
  const reducedMotion = !!useReducedMotion();
  const { fadeUp, staggerContainer } = createVariants(reducedMotion);

  return (
    <motion.header
      className="hero hero--premium"
      variants={staggerContainer}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.45 }}
    >
      <motion.p className="eyebrow" variants={fadeUp}>
        Software Engineer
      </motion.p>

      <motion.h1 className="hero-title" variants={fadeUp}>
        Karanvir Singh
      </motion.h1>

      <motion.p className="hero-description" variants={fadeUp}>
        Software engineer with experience at Amazon Web Services (AWS) building production-scale web
        systems focused on performance, reliability, and intuitive user experiences. Graduating from
        the University of Delaware with a B.S. in Computer Science and a concentration in AI/ML.
      </motion.p>

      <motion.div className="hero-actions" variants={fadeUp}>
        <motion.a
          href={resumePath}
          target="_blank"
          rel="noreferrer"
          className="button button--primary"
          whileTap={reducedMotion ? undefined : { y: 1 }}
        >
          View Resume
        </motion.a>
        <motion.button
          className="button button--ghost"
          onClick={onOpenModal}
          whileTap={reducedMotion ? undefined : { y: 1 }}
        >
          Contact
        </motion.button>
      </motion.div>

      <motion.div className="social-list social-list--premium" variants={fadeUp}>
        <a href="https://www.linkedin.com/in/karanvir-singh-453616257" target="_blank" rel="noreferrer">
          LinkedIn
        </a>
        <a href="https://github.com/13KaranSingh" target="_blank" rel="noreferrer">
          GitHub
        </a>
      </motion.div>
    </motion.header>
  );
}

export default Hero;
