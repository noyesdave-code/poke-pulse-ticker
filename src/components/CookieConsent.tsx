import { useState, useEffect } from "react";
import { Cookie, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const CookieConsent = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("ppt_cookie_consent");
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = () => {
    localStorage.setItem("ppt_cookie_consent", "accepted");
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem("ppt_cookie_consent", "declined");
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-10 left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-[60] bg-card border border-border rounded-lg shadow-xl p-4"
        >
          <button onClick={decline} className="absolute top-2 right-2 text-muted-foreground hover:text-foreground">
            <X className="w-3.5 h-3.5" />
          </button>
          <div className="flex items-start gap-3">
            <Cookie className="w-5 h-5 text-terminal-amber flex-shrink-0 mt-0.5" />
            <div className="space-y-2">
              <p className="font-mono text-[11px] text-foreground font-semibold">Cookie & Data Notice</p>
              <p className="font-mono text-[10px] text-muted-foreground leading-relaxed">
                We use cookies and local storage for authentication, preferences, and analytics. By continuing, you agree to our{" "}
                <a href="/privacy" className="text-primary underline">Privacy Policy</a>.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={accept}
                  className="px-3 py-1.5 bg-primary text-primary-foreground font-mono text-[10px] font-semibold rounded hover:opacity-90 transition-opacity"
                >
                  Accept All
                </button>
                <button
                  onClick={decline}
                  className="px-3 py-1.5 border border-border font-mono text-[10px] font-semibold rounded text-foreground hover:bg-muted transition-colors"
                >
                  Essential Only
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent;
