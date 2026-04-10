import TerminalHeader from "@/components/TerminalHeader";
import CopyrightBanner from "@/components/CopyrightBanner";
import { Shield } from "lucide-react";

const LegalProtection = () => {
  return (
    <div className="min-h-screen bg-background">
      <TerminalHeader />
      <main className="max-w-5xl mx-auto px-4 py-6">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-primary" />
          <h1 className="font-mono text-lg font-bold text-foreground">
            PGVA Security, Legal & IP Protection
          </h1>
        </div>
        <div className="terminal-card overflow-hidden" style={{ height: "calc(100vh - 160px)" }}>
          <iframe
            src="/PGVA_Security_Legal_IP_Protection.pdf"
            title="PGVA Security Legal IP Protection"
            className="w-full h-full border-0"
          />
        </div>
      </main>
      <CopyrightBanner />
    </div>
  );
};

export default LegalProtection;
