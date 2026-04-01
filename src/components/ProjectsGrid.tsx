import { motion, useReducedMotion } from "framer-motion";
import { createVariants } from "../motion/variants";
import { Project } from "../types";
import ProjectCard from "./ProjectCard";

type ProjectsGridProps = {
  projects: Project[];
};

function ProjectsGrid({ projects }: ProjectsGridProps) {
  const reducedMotion = !!useReducedMotion();
  const { staggerContainer } = createVariants(reducedMotion);

  return (
    <motion.div
      className="projects-grid"
      variants={staggerContainer}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.25 }}
    >
      {projects.map((project) => (
        <ProjectCard key={project.title} project={project} />
      ))}
    </motion.div>
  );
}

export default ProjectsGrid;
