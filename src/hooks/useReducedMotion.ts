import { useIsMobile } from "@/hooks/use-mobile";

/**
 * Returns simplified Framer Motion transition props on mobile
 * to avoid heavy animations that hurt INP / Lighthouse scores.
 */
export function useReducedMotion() {
  const isMobile = useIsMobile();

  const transition = isMobile
    ? { duration: 0.1, ease: "linear" }
    : { duration: 0.3, ease: "easeOut" };

  const fadeIn = isMobile
    ? { initial: { opacity: 1 }, animate: { opacity: 1 } }
    : { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 } };

  const scaleIn = isMobile
    ? { initial: { scale: 1, opacity: 1 }, animate: { scale: 1, opacity: 1 } }
    : { initial: { scale: 0.95, opacity: 0 }, animate: { scale: 1, opacity: 1 } };

  /** Pass to motion.div to disable scroll-linked transforms on mobile */
  const skipScrollTransform = isMobile;

  return { isMobile, transition, fadeIn, scaleIn, skipScrollTransform };
}
