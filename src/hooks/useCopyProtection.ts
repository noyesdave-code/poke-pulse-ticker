import { useEffect } from "react";

export function useCopyProtection() {
  useEffect(() => {
    // Disable right-click context menu
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    // Disable text selection via keyboard (Ctrl+A)
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+U (view source), Ctrl+Shift+I (dev tools), Ctrl+Shift+J (console), F12
      if (
        (e.ctrlKey && e.key === "u") ||
        (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "i")) ||
        (e.ctrlKey && e.shiftKey && (e.key === "J" || e.key === "j")) ||
        e.key === "F12" ||
        (e.ctrlKey && e.key === "s") || // Save page
        (e.ctrlKey && e.key === "p") || // Print
        (e.ctrlKey && e.key === "c") || // Copy
        (e.ctrlKey && e.key === "a")    // Select all
      ) {
        e.preventDefault();
        return false;
      }
    };

    // Disable drag on all images
    const handleDragStart = (e: DragEvent) => {
      if (e.target instanceof HTMLImageElement) {
        e.preventDefault();
        return false;
      }
    };

    // Disable copy event
    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      e.clipboardData?.setData(
        "text/plain",
        "© PGVA Ventures, LLC. Content copying is prohibited. Visit poke-pulse-ticker.com"
      );
      return false;
    };

    // Disable print via beforeprint
    const handleBeforePrint = () => {
      document.body.style.display = "none";
    };
    const handleAfterPrint = () => {
      document.body.style.display = "";
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("dragstart", handleDragStart);
    document.addEventListener("copy", handleCopy);
    window.addEventListener("beforeprint", handleBeforePrint);
    window.addEventListener("afterprint", handleAfterPrint);

    // Anti-iframe: break out if embedded
    try {
      if (window.self !== window.top) {
        const parentOrigin = document.referrer;
        if (!parentOrigin.includes("lovable.app") && !parentOrigin.includes("lovable.dev")) {
          window.top!.location.href = window.self.location.href;
        }
      }
    } catch {
      // Cross-origin iframe — can't access top, which is fine
    }

    // Console warning
    const warningStyle = "color: red; font-size: 24px; font-weight: bold;";
    console.log(
      "%c⚠️ WARNING: This site's content is protected intellectual property of PGVA Ventures, LLC. Unauthorized copying, reproduction, or distribution is strictly prohibited and may result in legal action.",
      warningStyle
    );

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("dragstart", handleDragStart);
      document.removeEventListener("copy", handleCopy);
      window.removeEventListener("beforeprint", handleBeforePrint);
      window.removeEventListener("afterprint", handleAfterPrint);
    };
  }, []);
}
