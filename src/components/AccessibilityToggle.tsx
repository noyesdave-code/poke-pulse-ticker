import { Eye, EyeOff } from "lucide-react";
import { useAccessibility } from "@/contexts/AccessibilityContext";

const AccessibilityToggle = () => {
  const { highContrast, toggleHighContrast } = useAccessibility();

  return (
    <button
      onClick={toggleHighContrast}
      className="flex items-center gap-1.5 rounded-md border border-border px-2 py-1 transition-colors hover:bg-muted/50"
      aria-label={highContrast ? "Switch to standard contrast" : "Switch to high contrast mode"}
      title={highContrast ? "Standard Mode" : "High Contrast Mode"}
    >
      {highContrast ? (
        <EyeOff className="w-3.5 h-3.5 text-foreground" />
      ) : (
        <Eye className="w-3.5 h-3.5 text-muted-foreground" />
      )}
      <span className="text-[10px] font-bold tracking-wide uppercase text-foreground">
        {highContrast ? "STD" : "A11Y"}
      </span>
    </button>
  );
};

export default AccessibilityToggle;
