import { useState, useCallback, useEffect, useRef } from "react";
import { Video, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const AutoScrollDemo = () => {
  const [active, setActive] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  const SCROLL_SPEED = 0.6; // pixels per frame (~36px/s at 60fps)
  const COUNTDOWN_SECONDS = 3;

  const startScroll = useCallback(() => {
    setCountdown(COUNTDOWN_SECONDS);
  }, []);

  // Countdown before scrolling
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => {
      if (countdown === 1) {
        window.scrollTo({ top: 0 });
        document.body.classList.add("demo-mode");
        setActive(true);
        setCountdown(0);
      } else {
        setCountdown(countdown - 1);
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  // Auto-scroll loop
  useEffect(() => {
    if (!active) return;

    startTimeRef.current = performance.now();

    const step = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;

      if (currentScroll >= maxScroll - 5) {
        setActive(false);
        document.body.classList.remove("demo-mode");
        return;
      }

      window.scrollBy(0, SCROLL_SPEED);
      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [active]);

  const stop = () => {
    setActive(false);
    setCountdown(0);
    document.body.classList.remove("demo-mode");
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  };

  return (
    <>
      {/* Trigger button — bottom left, above copyright banner */}
      <AnimatePresence>
        {!active && countdown === 0 && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={startScroll}
            className="fixed bottom-12 left-4 z-[60] flex items-center gap-2 px-3 py-2 rounded-lg bg-primary text-primary-foreground font-mono text-xs font-bold shadow-lg hover:shadow-[0_0_20px_hsl(160_84%_50%/0.3)] transition-shadow"
            title="Start auto-scroll demo for screen recording"
          >
            <Video className="w-4 h-4" />
            <span className="hidden sm:inline">Demo Mode</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Countdown overlay */}
      <AnimatePresence>
        {countdown > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm"
          >
            <motion.div
              key={countdown}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.5, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="text-center"
            >
              <p className="font-mono text-7xl font-extrabold text-primary">{countdown}</p>
              <p className="font-mono text-sm text-muted-foreground mt-2">Start recording now...</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stop button while scrolling */}
      <AnimatePresence>
        {active && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            onClick={stop}
            className="fixed bottom-12 left-4 z-[60] flex items-center gap-2 px-3 py-2 rounded-lg bg-destructive text-destructive-foreground font-mono text-xs font-bold shadow-lg"
          >
            <X className="w-4 h-4" />
            <span>Stop</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Recording indicator */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="fixed top-4 right-4 z-[60] flex items-center gap-2 px-3 py-1.5 rounded-full bg-destructive/90 backdrop-blur-sm"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
            <span className="font-mono text-[10px] text-white font-bold uppercase tracking-wider">
              Demo Mode
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AutoScrollDemo;
