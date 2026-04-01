import { Variants } from "framer-motion";

const easeOut: [number, number, number, number] = [0.22, 1, 0.36, 1];

type VariantSet = {
  fadeUp: Variants;
  staggerContainer: Variants;
  hoverLift: Variants;
  underlineSlide: Variants;
};

export function createVariants(reducedMotion: boolean): VariantSet {
  return {
    fadeUp: {
      hidden: {
        opacity: 0,
        y: reducedMotion ? 0 : 12,
        filter: reducedMotion ? "none" : "blur(2px)"
      },
      show: {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: {
          duration: reducedMotion ? 0.22 : 0.45,
          ease: easeOut
        }
      }
    },
    staggerContainer: {
      hidden: { opacity: 0 },
      show: {
        opacity: 1,
        transition: {
          delayChildren: reducedMotion ? 0 : 0.06,
          staggerChildren: reducedMotion ? 0.03 : 0.1
        }
      }
    },
    hoverLift: {
      rest: {
        scale: 1,
        y: 0,
        transition: { duration: 0.26, ease: easeOut }
      },
      hover: {
        scale: reducedMotion ? 1 : 1.02,
        y: reducedMotion ? 0 : -4,
        transition: { duration: 0.26, ease: easeOut }
      }
    },
    underlineSlide: {
      rest: {
        scaleX: 0,
        opacity: reducedMotion ? 0.75 : 1,
        transformOrigin: "left"
      },
      hover: {
        scaleX: 1,
        opacity: 1,
        transformOrigin: "left",
        transition: { duration: reducedMotion ? 0.2 : 0.34, ease: easeOut }
      }
    }
  };
}
