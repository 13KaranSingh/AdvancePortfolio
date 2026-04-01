import { motion, useReducedMotion } from "framer-motion";
import { createVariants } from "../motion/variants";

type ToolboxCard = {
  title: string;
  chips: string[];
};

const toolboxCards: ToolboxCard[] = [
  {
    title: "Frontend",
    chips: ["React", "TypeScript", "Next.js", "Tailwind CSS", "Framer Motion"]
  },
  {
    title: "Backend / APIs",
    chips: ["Node.js", "Express", "REST APIs", "Auth", "Webhooks"]
  },
  {
    title: "Data / ML",
    chips: ["Python", "PyTorch", "SQL", "Data Pipelines"]
  },
  {
    title: "Engineering",
    chips: ["Git", "Testing (Jest/RTL)", "CI/CD", "Accessibility (WCAG)", "Performance"]
  }
];

function EngineeringFocus() {
  const reducedMotion = !!useReducedMotion();
  const { fadeUp, staggerContainer } = createVariants(reducedMotion);

  return (
    <motion.section
      className="toolbox-section"
      variants={staggerContainer}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.25 }}
    >
      <div className="container">
        <motion.h2 className="toolbox-title" variants={fadeUp}>
          Toolbox
        </motion.h2>
        <motion.div className="toolbox-grid" variants={staggerContainer}>
          {toolboxCards.map((card) => (
            <motion.article key={card.title} className="toolbox-card" variants={fadeUp}>
              <h3>{card.title}</h3>
              <ul className="toolbox-chips" aria-label={card.title}>
                {card.chips.map((chip) => (
                  <li key={chip}>
                    <span tabIndex={0} className="toolbox-chip">
                      {chip}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}

export default EngineeringFocus;
