import { Shield, AlertTriangle, Scale } from "lucide-react";

const CopyrightBanner = () => {
  return (
    <div data-demo-hide className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-sm border-t border-border">
      <div className="max-w-7xl mx-auto px-4 py-1.5 flex flex-col items-center gap-0.5">
        <div className="flex items-center justify-center gap-2">
          <Shield className="w-3 h-3 text-primary flex-shrink-0" />
          <p className="font-mono text-[9px] text-muted-foreground tracking-wide text-center">
            © {new Date().getFullYear()} PGVA Ventures, LLC. All rights reserved. Patent pending. Unauthorized reproduction strictly prohibited.
          </p>
        </div>
        <div className="flex items-center justify-center gap-1.5 flex-wrap">
          <AlertTriangle className="w-2.5 h-2.5 text-terminal-amber flex-shrink-0" />
          <p className="font-mono text-[8px] text-muted-foreground/70 tracking-wide text-center">
            Not financial advice. Data for informational purposes only. Pokémon is a trademark of Nintendo/Creatures Inc./GAME FREAK inc.
          </p>
          <Scale className="w-2.5 h-2.5 text-muted-foreground/50 flex-shrink-0" />
          <p className="font-mono text-[7px] text-muted-foreground/50 tracking-wide text-center">
            Protected under 17 U.S.C. § 1201 (DMCA) · 18 U.S.C. § 1836 (DTSA) · 15 U.S.C. § 1114 (Lanham Act)
          </p>
        </div>
      </div>
    </div>
  );
};

export default CopyrightBanner;
