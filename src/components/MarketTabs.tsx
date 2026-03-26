import { useState } from "react";
import { rawCards, gradedCards, sealedProducts } from "@/data/marketData";
import CardBoardTable from "./CardBoardTable";
import SealedTable from "./SealedTable";

const tabs = [
  { id: "raw", label: "RAW CARDS" },
  { id: "graded", label: "GRADED CARDS" },
  { id: "sealed", label: "SEALED PRODUCTS" },
] as const;

type TabId = typeof tabs[number]["id"];

const MarketTabs = () => {
  const [active, setActive] = useState<TabId>("raw");

  return (
    <div>
      <div className="flex border-b border-border mb-0">
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
      <div className="mt-4">
        {active === "raw" && <CardBoardTable cards={rawCards} title="Live Card Board — Raw Market Feed" />}
        {active === "graded" && <CardBoardTable cards={gradedCards} title="Live Card Board — Graded Market Feed" showGrade />}
        {active === "sealed" && <SealedTable products={sealedProducts} />}
      </div>
    </div>
  );
};

export default MarketTabs;
