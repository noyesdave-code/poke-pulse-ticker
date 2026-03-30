import { useState } from "react";
import FinancialDisclaimer from "@/components/FinancialDisclaimer";
import { useNavigate } from "react-router-dom";
import TerminalHeader from "@/components/TerminalHeader";
import GradingGuide from "@/components/GradingGuide";
import InvestmentTips from "@/components/InvestmentTips";
import TcgGlossary from "@/components/TcgGlossary";
import { ArrowLeft } from "lucide-react";

const tabs = [
  { id: "grading", label: "Grading Guide" },
  { id: "investing", label: "Investment Tips" },
  { id: "glossary", label: "Glossary" },
] as const;

type TabId = typeof tabs[number]["id"];

const Guides = () => {
  const [active, setActive] = useState<TabId>("grading");
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <TerminalHeader />

      <main className="max-w-4xl mx-auto px-4 lg:px-6 py-6 space-y-6">
        {/* Page header */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/")}
            className="w-8 h-8 rounded border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="font-mono text-lg font-bold text-foreground tracking-wide">
              Collector's Guides
            </h1>
            <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
              Learn to grade, store, and invest smarter
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActive(tab.id)}
              className={`px-4 py-2.5 font-mono text-xs tracking-widest transition-colors ${
                active === tab.id
                  ? "text-secondary border-b-2 border-b-secondary -mb-px"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {active === "grading" && <GradingGuide />}
        {active === "investing" && <InvestmentTips />}
        {active === "glossary" && <TcgGlossary />}

        {/* Footer */}
        <footer className="border-t border-border pt-6 pb-4">
          <p className="font-mono text-[10px] text-muted-foreground text-center">
            © {new Date().getFullYear()} Poke-Pulse-Ticker. Educational content only — not financial advice.
          </p>
        </footer>
      </main>
    </div>
  );
};

export default Guides;
