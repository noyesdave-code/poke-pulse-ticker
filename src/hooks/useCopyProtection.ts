import { useEffect } from "react";

export function useCopyProtection() {
  useEffect(() => {
    // Disable right-click context menu
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    // Block developer shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey && e.key === "u") ||
        (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "i")) ||
        (e.ctrlKey && e.shiftKey && (e.key === "J" || e.key === "j")) ||
        (e.ctrlKey && e.shiftKey && (e.key === "C" || e.key === "c")) ||
        e.key === "F12" ||
        (e.ctrlKey && e.key === "s") ||
        (e.ctrlKey && e.key === "p") ||
        (e.ctrlKey && e.key === "c") ||
        (e.ctrlKey && e.key === "a")
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

    // Hijack clipboard with copyright notice
    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      e.clipboardData?.setData(
        "text/plain",
        "© 2026 PGVA Ventures, LLC. Content copying is prohibited. All rights reserved. Visit poke-pulse-ticker.com"
      );
      return false;
    };

    // Block print
    const handleBeforePrint = () => {
      document.body.style.display = "none";
    };
    const handleAfterPrint = () => {
      document.body.style.display = "";
    };

    // Block screenshot via visibility API abuse detection
    const handleVisibilityChange = () => {
      if (document.hidden) {
        document.title = "© PGVA Ventures, LLC — Protected Content";
      } else {
        document.title = "Poke Pulse Ticker — Live Poké TCG Market Data";
      }
    };

    // Block save-as by intercepting Ctrl+S at capture phase
    const handleKeyDownCapture = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "s") {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keydown", handleKeyDownCapture, true);
    document.addEventListener("dragstart", handleDragStart);
    document.addEventListener("copy", handleCopy);
    document.addEventListener("cut", handleCopy);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("beforeprint", handleBeforePrint);
    window.addEventListener("afterprint", handleAfterPrint);

    // Anti-iframe: break out if embedded in unauthorized origin
    try {
      if (window.self !== window.top) {
        const parentOrigin = document.referrer;
        if (
          !parentOrigin.includes("lovable.app") &&
          !parentOrigin.includes("lovable.dev") &&
          !parentOrigin.includes("poke-pulse-ticker.com")
        ) {
          window.top!.location.href = window.self.location.href;
        }
      }
    } catch {
      // Cross-origin iframe — can't access top
    }

    // DevTools detection via debugger timing
    let devtoolsOpen = false;
    const detectDevTools = () => {
      const start = performance.now();
      // eslint-disable-next-line no-debugger
      const diff = performance.now() - start;
      if (diff > 100 && !devtoolsOpen) {
        devtoolsOpen = true;
        console.clear();
      }
    };
    const devtoolsInterval = setInterval(detectDevTools, 3000);

    // Console warning
    const warningStyle = "color: red; font-size: 24px; font-weight: bold;";
    const legalStyle = "color: orange; font-size: 14px;";
    console.log(
      "%c⚠️ STOP — PROTECTED INTELLECTUAL PROPERTY",
      warningStyle
    );
    console.log(
      "%cAll content on this site is the exclusive property of PGVA Ventures, LLC. Unauthorized access, copying, reverse-engineering, scraping, or redistribution violates the DMCA (17 U.S.C. § 1201), CFAA (18 U.S.C. § 1030), and DTSA (18 U.S.C. § 1836). Violations will be prosecuted. Contact: contact@poke-pulse-ticker.com",
      legalStyle
    );

    // Inject anti-select CSS
    const style = document.createElement("style");
    style.textContent = `
      img { -webkit-user-drag: none !important; user-drag: none !important; pointer-events: auto; }
      * { -webkit-touch-callout: none; }
    `;
    document.head.appendChild(style);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keydown", handleKeyDownCapture, true);
      document.removeEventListener("dragstart", handleDragStart);
      document.removeEventListener("copy", handleCopy);
      document.removeEventListener("cut", handleCopy);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeprint", handleBeforePrint);
      window.removeEventListener("afterprint", handleAfterPrint);
      clearInterval(devtoolsInterval);
      document.head.removeChild(style);
    };
  }, []);
}
