import { motion, useReducedMotion } from "framer-motion";
import { createVariants } from "../motion/variants";
import { Project } from "../types";

type ProjectCardProps = {
  project: Project;
};

function ProjectCard({ project }: ProjectCardProps) {
  const reducedMotion = !!useReducedMotion();
  const { fadeUp, hoverLift, underlineSlide } = createVariants(reducedMotion);

  return (
    <motion.article className="project-card" variants={fadeUp}>
      <motion.div
        className="project-card__surface"
        variants={hoverLift}
        initial="rest"
        animate="rest"
        whileHover="hover"
        whileFocus="hover"
      >
        <div className="project-card__media">
          <img src={project.image} alt={project.title} />
        </div>
        <div className="project-card__body">
          <h3>{project.title}</h3>
          <h4>{project.stack}</h4>
          <p>{project.description}</p>
          <div className="project-links">
            <motion.a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="project-link"
              initial="rest"
              whileHover="hover"
              whileFocus="hover"
            >
              Live
              <motion.span className="link-underline" variants={underlineSlide} />
            </motion.a>
          </div>
        </div>
      </motion.div>
    </motion.article>
  );
}

export default ProjectCard;
