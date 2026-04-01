import { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { createVariants } from "../motion/variants";

type SectionProps = {
  id?: string;
  className?: string;
  children: ReactNode;
};

function Section({ id, className, children }: SectionProps) {
  const reducedMotion = !!useReducedMotion();
  const { fadeUp } = createVariants(reducedMotion);

  return (
    <motion.section
      id={id}
      className={className}
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.25 }}
    >
      <div className="container">{children}</div>
    </motion.section>
  );
}

export default Section;
