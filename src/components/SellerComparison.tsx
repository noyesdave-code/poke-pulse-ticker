import type { CardData } from "@/data/marketData";

const mockSellers = [
  { name: "TCGPlayer Direct", rating: 99.8, sales: 125000 },
  { name: "CardMarket Pro", rating: 99.5, sales: 84000 },
  { name: "PokeCollector Elite", rating: 98.9, sales: 12500 },
  { name: "GarageVA Marketplace", rating: 99.2, sales: 7800 },
  { name: "VintageCards Co.", rating: 97.8, sales: 3200 },
  { name: "SlabKings", rating: 98.5, sales: 5400 },
];

const generateSellerPrices = (card: CardData) =>
  mockSellers.map((seller, i) => {
    const variance = (Math.random() - 0.4) * card.market * 0.15;
    const price = Math.max(card.low * 0.95, card.market + variance + i * card.market * 0.02);
    return {
      ...seller,
      price: Math.round(price * 100) / 100,
      shipping: i < 2 ? 0 : +(Math.random() * 5 + 2).toFixed(2),
      condition: card.grade || (Math.random() > 0.3 ? "Near Mint" : "Lightly Played"),
      inStock: Math.floor(Math.random() * 8) + 1,
    };
  }).sort((a, b) => (a.price + a.shipping) - (b.price + b.shipping));

interface Props {
  card: CardData;
}

const SellerComparison = ({ card }: Props) => {
  const sellers = generateSellerPrices(card);
  const bestTotal = sellers[0].price + sellers[0].shipping;

  return (
    <div className="terminal-card overflow-hidden">
      <div className="border-b border-border px-4 py-3 flex items-center justify-between">
        <h2 className="font-mono text-xs tracking-widest text-secondary uppercase font-semibold">
          Price Comparison — Sellers
        </h2>
        <span className="font-mono text-[10px] text-muted-foreground">{sellers.length} listings</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="px-4 py-2 text-left font-mono text-[10px] tracking-widest text-muted-foreground uppercase">Seller</th>
              <th className="px-4 py-2 text-left font-mono text-[10px] tracking-widest text-muted-foreground uppercase">Rating</th>
              <th className="px-4 py-2 text-left font-mono text-[10px] tracking-widest text-muted-foreground uppercase">Condition</th>
              <th className="px-4 py-2 text-right font-mono text-[10px] tracking-widest text-muted-foreground uppercase">Price</th>
              <th className="px-4 py-2 text-right font-mono text-[10px] tracking-widest text-muted-foreground uppercase">Shipping</th>
              <th className="px-4 py-2 text-right font-mono text-[10px] tracking-widest text-muted-foreground uppercase">Total</th>
              <th className="px-4 py-2 text-right font-mono text-[10px] tracking-widest text-muted-foreground uppercase">Stock</th>
            </tr>
          </thead>
          <tbody>
            {sellers.map((s, i) => {
              const total = s.price + s.shipping;
              const isBest = total === bestTotal;
              return (
                <tr key={i} className="data-row">
                  <td className="px-4 py-2 font-mono text-sm text-foreground font-medium">
                    {s.name}
                    {isBest && (
                      <span className="ml-2 inline-block px-1.5 py-0.5 text-[9px] font-bold bg-primary/20 text-primary rounded">
                        BEST
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-2 font-mono text-xs text-muted-foreground">
                    {s.rating}% <span className="text-[10px]">({s.sales.toLocaleString()})</span>
                  </td>
                  <td className="px-4 py-2 font-mono text-xs text-muted-foreground">{s.condition}</td>
                  <td className="px-4 py-2 font-mono text-sm text-foreground text-right">
                    ${s.price.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-4 py-2 font-mono text-xs text-right text-muted-foreground">
                    {s.shipping === 0 ? (
                      <span className="text-terminal-green">FREE</span>
                    ) : (
                      `$${s.shipping.toFixed(2)}`
                    )}
                  </td>
                  <td className={`px-4 py-2 font-mono text-sm text-right font-semibold ${isBest ? "text-terminal-green" : "text-foreground"}`}>
                    ${total.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-4 py-2 font-mono text-xs text-right text-muted-foreground">{s.inStock}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SellerComparison;
