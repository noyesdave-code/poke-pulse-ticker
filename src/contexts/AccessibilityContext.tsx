import { useState, useEffect, createContext, useContext } from "react";

interface A11yContextType {
  highContrast: boolean;
  toggleHighContrast: () => void;
}

const A11yContext = createContext<A11yContextType>({
  highContrast: false,
  toggleHighContrast: () => {},
});

export function useAccessibility() {
  return useContext(A11yContext);
}

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [highContrast, setHighContrast] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("ppmt-high-contrast") === "true";
    }
    return false;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (highContrast) {
      root.classList.add("high-contrast");
    } else {
      root.classList.remove("high-contrast");
    }
    localStorage.setItem("ppmt-high-contrast", String(highContrast));
  }, [highContrast]);

  const toggleHighContrast = () => setHighContrast((prev) => !prev);

  return (
    <A11yContext.Provider value={{ highContrast, toggleHighContrast }}>
      {children}
    </A11yContext.Provider>
  );
}
