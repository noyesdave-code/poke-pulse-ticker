import { useState, useEffect } from "react";
import { X, Download, Share } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Don't show in iframes (editor preview) or if already installed
    try {
      if (window.self !== window.top) return;
    } catch { return; }
    if (window.matchMedia("(display-mode: standalone)").matches) return;

    const dismissed = sessionStorage.getItem("install-dismissed");
    if (dismissed) return;

    // Detect iOS
    const ua = navigator.userAgent;
    const ios = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    setIsIOS(ios);

    if (ios) {
      // Show iOS instructions after a short delay
      const timer = setTimeout(() => setShowBanner(true), 2000);
      return () => clearTimeout(timer);
    }

    // Android/Chrome: listen for beforeinstallprompt
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowBanner(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setShowBanner(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowBanner(false);
    sessionStorage.setItem("install-dismissed", "1");
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-3 animate-in slide-in-from-bottom duration-300">
      <div className="max-w-lg mx-auto rounded-xl border border-primary/30 bg-card/95 backdrop-blur-lg shadow-2xl shadow-primary/10 p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
            <Download className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-mono text-sm font-semibold text-foreground">
              Install POKÉGARAGEVA
            </p>
            {isIOS ? (
              <p className="text-xs text-muted-foreground mt-1">
                Tap <Share className="inline w-3 h-3 -mt-0.5" /> <span className="text-foreground font-medium">Share</span> then <span className="text-foreground font-medium">"Add to Home Screen"</span> to install
              </p>
            ) : (
              <p className="text-xs text-muted-foreground mt-1">
                Get quick access from your home screen — works offline!
              </p>
            )}
          </div>
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        {!isIOS && deferredPrompt && (
          <button
            onClick={handleInstall}
            className="mt-3 w-full rounded-lg bg-primary py-2 font-mono text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
          >
            Install App
          </button>
        )}
      </div>
    </div>
  );
};

export default InstallPrompt;
