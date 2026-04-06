import { Shield, AlertTriangle, Scale } from "lucide-react";

const CopyrightBanner = () => {
  return (
    <div data-demo-hide className="fixed bottom-0 left-0 right-0 z-50 bg-card/90 backdrop-blur-sm border-t border-border/30">
      <div className="max-w-7xl mx-auto px-2 py-px flex items-center justify-center gap-1">
        <Shield className="w-1.5 h-1.5 text-primary flex-shrink-0" />
        <p className="font-mono text-[5px] text-muted-foreground tracking-wide leading-none">
          © {new Date().getFullYear()} PGVA Ventures, LLC • Patent pending • Not financial advice • Poké™ Nintendo/Creatures/GAME FREAK
        </p>
      </div>
    </div>
  );
};

export default CopyrightBanner;
