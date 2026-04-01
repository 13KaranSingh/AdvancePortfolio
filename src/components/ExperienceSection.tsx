import { motion, useReducedMotion } from "framer-motion";
import { createVariants } from "../motion/variants";

function ExperienceSection() {
  const reducedMotion = !!useReducedMotion();
  const { fadeUp, staggerContainer } = createVariants(reducedMotion);

  return (
    <motion.section
      id="experience"
      className="experience-section"
      variants={staggerContainer}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.28 }}
    >
      <div className="container">
        <motion.h2 className="experience-title" variants={fadeUp}>
          Experience
        </motion.h2>

        <motion.article className="experience-card" variants={fadeUp}>
          <div className="experience-marker" aria-hidden="true" />
          <div className="experience-content">
            <p className="experience-company">Amazon Web Services (AWS)</p>
            <p className="experience-role">Software Engineering Intern</p>
            <ul>
              <li>Designed and shipped production web tooling within AWS workflows.</li>
              <li>Improved reliability and performance by hardening edge cases and adding safeguards.</li>
              <li>
                Implemented accessibility-conscious UI patterns (keyboard/focus, semantics) and validated
                behavior.
              </li>
              <li>
                Collaborated with engineers in review cycles: design iteration, testing strategy, and
                rollout readiness.
              </li>
            </ul>
            <p className="experience-stack">
              Stack: React/TypeScript, Node.js, testing workflows, CI pipelines, AWS tooling.
            </p>
          </div>
        </motion.article>
      </div>
    </motion.section>
  );
}

export default ExperienceSection;
