import { Shield } from "lucide-react";

const CopyrightBanner = () => {
  return (
    <div data-demo-hide className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-sm border-t border-border">
      <div className="max-w-7xl mx-auto px-4 py-1.5 flex items-center justify-center gap-2">
        <Shield className="w-3 h-3 text-primary flex-shrink-0" />
        <p className="font-mono text-[9px] text-muted-foreground tracking-wide text-center">
          © {new Date().getFullYear()} PGVA Ventures, LLC. All rights reserved. Unauthorized reproduction or distribution is strictly prohibited.
        </p>
      </div>
    </div>
  );
};

export default CopyrightBanner;
