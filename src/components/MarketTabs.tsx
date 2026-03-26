import { useState } from "react";
import { rawCards, gradedCards, sealedProducts } from "@/data/marketData";
import type { CardData } from "@/data/marketData";
import CardBoardTable from "./CardBoardTable";
import SealedTable from "./SealedTable";

const tabs = [
  { id: "raw", label: "RAW CARDS" },
  { id: "graded", label: "GRADED CARDS" },
  { id: "sealed", label: "SEALED PRODUCTS" },
] as const;

type TabId = typeof tabs[number]["id"];

interface MarketTabsProps {
  liveCards?: CardData[];
  liveGradedCards?: CardData[];
  liveSealedProducts?: SealedProduct[];
}

const MarketTabs = ({ liveCards, liveGradedCards, liveSealedProducts }: MarketTabsProps) => {
  const [active, setActive] = useState<TabId>("raw");
  const displayRaw = liveCards && liveCards.length > 0 ? liveCards : rawCards;
  const displayGraded = liveGradedCards && liveGradedCards.length > 0 ? liveGradedCards : gradedCards;
  const displaySealed = liveSealedProducts && liveSealedProducts.length > 0 ? liveSealedProducts : sealedProducts;

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
        {active === "raw" && <CardBoardTable cards={displayRaw} title="Live Card Board — Raw Market Feed" />}
        {active === "graded" && <CardBoardTable cards={displayGraded} title="Live Card Board — Graded Market Feed (PSA/CGC/BGS/TAG)" showGrade />}
        {active === "sealed" && <SealedTable products={sealedProducts} />}
      </div>
    </div>
  );
};

export default MarketTabs;
