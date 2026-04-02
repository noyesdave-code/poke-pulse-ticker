import { AnimatePresence, motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

const PageTransition = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const isMobile = useIsMobile();

  // Skip page transition animation on mobile to improve INP
  if (isMobile) {
    return <>{children}</>;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default PageTransition;
