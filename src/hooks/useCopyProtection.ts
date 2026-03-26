import { useEffect } from "react";

export function useCopyProtection() {
  useEffect(() => {
    // Disable right-click context menu
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    // Disable common keyboard shortcuts for viewing source / dev tools
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+U (view source), Ctrl+Shift+I (dev tools), Ctrl+Shift+J (console), F12
      if (
        (e.ctrlKey && e.key === "u") ||
        (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "i")) ||
        (e.ctrlKey && e.shiftKey && (e.key === "J" || e.key === "j")) ||
        e.key === "F12"
      ) {
        e.preventDefault();
      }
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);

    // Anti-iframe: break out if embedded
    try {
      if (window.self !== window.top) {
        // Allow Lovable preview iframes
        const parentOrigin = document.referrer;
        if (!parentOrigin.includes("lovable.app") && !parentOrigin.includes("lovable.dev")) {
          window.top!.location = window.self.location;
        }
      }
    } catch {
      // Cross-origin iframe — can't access top, which is fine
    }

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
}
