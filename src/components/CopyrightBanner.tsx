import { Shield, AlertTriangle } from "lucide-react";

const CopyrightBanner = () => {
  return (
    <div data-demo-hide className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-sm border-t border-border">
      <div className="max-w-7xl mx-auto px-4 py-1 flex flex-col items-center gap-0.5">
        <div className="flex items-center justify-center gap-2">
          <Shield className="w-3 h-3 text-primary flex-shrink-0" />
          <p className="font-mono text-[9px] text-muted-foreground tracking-wide text-center">
            © {new Date().getFullYear()} PGVA Ventures, LLC. All rights reserved. Unauthorized reproduction or distribution is strictly prohibited.
          </p>
        </div>
        <div className="flex items-center justify-center gap-1.5">
          <AlertTriangle className="w-2.5 h-2.5 text-terminal-amber flex-shrink-0" />
          <p className="font-mono text-[8px] text-muted-foreground/70 tracking-wide text-center">
            Not financial advice. Data sourced from public APIs. Pokémon is a trademark of Nintendo/Creatures Inc./GAME FREAK inc.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CopyrightBanner;
