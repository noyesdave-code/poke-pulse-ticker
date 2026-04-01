import { Shield, AlertTriangle, Scale } from "lucide-react";

const CopyrightBanner = () => {
  return (
    <div data-demo-hide className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-sm <div data-demo-hide className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-sm border-t-2 border-border">">
      <div className="max-w-7xl mx-auto px-3 py-1 flex flex-col items-center gap-0">
        <div className="flex items-center justify-center gap-1.5">
          <Shield className="w-2 h-2 text-primary flex-shrink-0" />
          <p className="font-mono text-[7px] text-muted-foreground tracking-wide text-center leading-tight">
            © {new Date().getFullYear()} PGVA Ventures, LLC. All rights reserved. Patent pending.
          </p>
          <AlertTriangle className="w-2 h-2 text-terminal-amber flex-shrink-0" />
          <p className="font-mono text-[6px] text-muted-foreground/70 tracking-wide text-center leading-tight">
            Not financial advice. Pokémon™ Nintendo/Creatures/GAME FREAK.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CopyrightBanner;
