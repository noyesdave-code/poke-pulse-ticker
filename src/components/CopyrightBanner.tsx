import { Shield } from "lucide-react";

const CopyrightBanner = () => {
  return (
    <div data-demo-hide className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-sm border-t border-border/20">
      <div className="max-w-7xl mx-auto px-3 py-0.5 flex items-center justify-center gap-1.5">
        <Shield className="w-2.5 h-2.5 text-primary flex-shrink-0" />
        <p className="font-mono text-[7px] sm:text-[8px] text-muted-foreground tracking-wide leading-tight">
          © {new Date().getFullYear()} PGVA Ventures, LLC • Patent Pending • Not Financial Advice • Pokémon™ Nintendo/Creatures/GAME FREAK
        </p>
      </div>
    </div>
  );
};

export default CopyrightBanner;
