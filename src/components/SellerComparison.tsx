import { useMemo } from "react";
import type { CardData } from "@/data/marketData";
import { ExternalLink } from "lucide-react";

interface SellerListing {
  platform: string;
  variant: string;
  price: number;
  shipping: number;
  condition: string;
  inStock: number;
  url?: string;
  isLive: boolean;
}

function generateSimulatedPrice(base: number, seed: number, offset: number): number {
  const hash = ((seed * 2654435761) >>> 0) / 4294967296;
  const variance = (hash - 0.45) * base * 0.12;
  return Math.max(base * 0.85, base + variance + offset);
}

interface Props {
  card: CardData & { _apiId?: string; _variant?: string };
}

const SellerComparison = ({ card }: Props) => {
  const listings = useMemo(() => {
    const seed = (card.name + card.set + card.number).split("").reduce((a, c) => a + c.charCodeAt(0), 0);
    const results: SellerListing[] = [];

    // TCGPlayer — real data
    results.push({
      platform: "TCGPlayer",
      variant: card._variant || "Market",
      price: card.market,
      shipping: 0,
      condition: card.grade || "Near Mint",
      inStock: Math.max(1, (seed % 12) + 1),
      url: card._apiId ? `https://www.tcgplayer.com/search/pokemon/product?q=${encodeURIComponent(card.name)}` : undefined,
      isLive: true,
    });

    // TCGPlayer Low
    if (card.low && card.low < card.market) {
      results.push({
        platform: "TCGPlayer",
        variant: "Low",
        price: card.low,
        shipping: 0,
        condition: "Lightly Played",
        inStock: Math.max(1, (seed % 5) + 1),
        url: card._apiId ? `https://www.tcgplayer.com/search/pokemon/product?q=${encodeURIComponent(card.name)}` : undefined,
        isLive: true,
      });
    }

    // eBay — simulated
    results.push({
      platform: "eBay",
      variant: "Buy It Now",
      price: Math.round(generateSimulatedPrice(card.market, seed + 1, card.market * 0.05) * 100) / 100,
      shipping: seed % 3 === 0 ? 0 : Math.round((2.5 + (seed % 4)) * 100) / 100,
      condition: card.grade || "Near Mint",
      inStock: Math.max(1, (seed % 8) + 1),
      url: `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(card.name + " " + card.set + " pokemon")}`,
      isLive: false,
    });

    results.push({
      platform: "eBay",
      variant: "Auction Avg",
      price: Math.round(generateSimulatedPrice(card.market, seed + 2, -card.market * 0.08) * 100) / 100,
      shipping: Math.round((3 + (seed % 3)) * 100) / 100,
      condition: "Various",
      inStock: Math.max(1, (seed % 15) + 3),
      url: `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(card.name + " " + card.set + " pokemon")}&LH_Auction=1`,
      isLive: false,
    });

    // CardMarket — simulated
    results.push({
      platform: "CardMarket",
      variant: "Trend",
      price: Math.round(generateSimulatedPrice(card.market, seed + 3, -card.market * 0.03) * 100) / 100,
      shipping: Math.round((1.5 + (seed % 5) * 0.5) * 100) / 100,
      condition: card.grade || "Near Mint",
      inStock: Math.max(1, (seed % 20) + 5),
      url: `https://www.cardmarket.com/en/Pokemon/Products/Search?searchString=${encodeURIComponent(card.name)}`,
      isLive: false,
    });

    results.push({
      platform: "CardMarket",
      variant: "Low",
      price: Math.round(generateSimulatedPrice(card.market, seed + 4, -card.market * 0.15) * 100) / 100,
      shipping: Math.round((1 + (seed % 4) * 0.5) * 100) / 100,
      condition: "Excellent",
      inStock: Math.max(1, (seed % 10) + 1),
      url: `https://www.cardmarket.com/en/Pokemon/Products/Search?searchString=${encodeURIComponent(card.name)}`,
      isLive: false,
    });

    return results.sort((a, b) => (a.price + a.shipping) - (b.price + b.shipping));
  }, [card]);

  const bestTotal = listings[0].price + listings[0].shipping;

  return (
    <div className="terminal-card overflow-hidden">
      <div className="border-b border-border px-4 py-3 flex items-center justify-between">
        <h2 className="font-mono text-xs tracking-widest text-secondary uppercase font-semibold">
          Price Comparison — Multi-Platform
        </h2>
        <span className="font-mono text-[10px] text-muted-foreground">{listings.length} listings</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="px-4 py-2 text-left font-mono text-[10px] tracking-widest text-muted-foreground uppercase">Platform</th>
              <th className="px-4 py-2 text-left font-mono text-[10px] tracking-widest text-muted-foreground uppercase">Type</th>
              <th className="px-4 py-2 text-left font-mono text-[10px] tracking-widest text-muted-foreground uppercase">Condition</th>
              <th className="px-4 py-2 text-right font-mono text-[10px] tracking-widest text-muted-foreground uppercase">Price</th>
              <th className="px-4 py-2 text-right font-mono text-[10px] tracking-widest text-muted-foreground uppercase">Ship</th>
              <th className="px-4 py-2 text-right font-mono text-[10px] tracking-widest text-muted-foreground uppercase">Total</th>
              <th className="px-4 py-2 text-center font-mono text-[10px] tracking-widest text-muted-foreground uppercase">Link</th>
            </tr>
          </thead>
          <tbody>
            {listings.map((s, i) => {
              const total = Math.round((s.price + s.shipping) * 100) / 100;
              const isBest = Math.abs(total - bestTotal) < 0.01;
              return (
                <tr key={i} className="data-row">
                  <td className="px-4 py-2 font-mono text-xs text-foreground font-medium">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${getPlatformColor(s.platform)}`} />
                      {s.platform}
                      {s.isLive && (
                        <span className="px-1 py-0.5 text-[8px] font-bold bg-terminal-green/20 text-terminal-green rounded">LIVE</span>
                      )}
                      {!s.isLive && (
                        <span className="px-1 py-0.5 text-[8px] font-bold bg-muted text-muted-foreground rounded">EST</span>
                      )}
                      {isBest && (
                        <span className="px-1 py-0.5 text-[8px] font-bold bg-primary/20 text-primary rounded">BEST</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-2 font-mono text-[10px] text-muted-foreground">{s.variant}</td>
                  <td className="px-4 py-2 font-mono text-[10px] text-muted-foreground">{s.condition}</td>
                  <td className="px-4 py-2 font-mono text-xs text-foreground text-right">
                    ${s.price.toFixed(2)}
                  </td>
                  <td className="px-4 py-2 font-mono text-[10px] text-right text-muted-foreground">
                    {s.shipping === 0 ? <span className="text-terminal-green">FREE</span> : `$${s.shipping.toFixed(2)}`}
                  </td>
                  <td className={`px-4 py-2 font-mono text-xs text-right font-semibold ${isBest ? "text-terminal-green" : "text-foreground"}`}>
                    ${total.toFixed(2)}
                  </td>
                  <td className="px-4 py-2 text-center">
                    {s.url ? (
                      <a href={s.url} target="_blank" rel="noopener noreferrer" className="inline-flex text-primary hover:text-primary/80">
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    ) : (
                      <span className="text-muted-foreground text-[10px]">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="border-t border-border px-4 py-2">
        <p className="font-mono text-[9px] text-muted-foreground">
          TCGPlayer prices are live from market data. eBay & CardMarket prices are estimated based on market averages. Click links to view actual listings.
        </p>
      </div>
    </div>
  );
};

function getPlatformColor(platform: string): string {
  switch (platform) {
    case "TCGPlayer": return "bg-terminal-blue";
    case "eBay": return "bg-terminal-amber";
    case "CardMarket": return "bg-terminal-green";
    default: return "bg-muted-foreground";
  }
}

export default SellerComparison;
