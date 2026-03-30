import { useState, useMemo } from "react";
import { rawCards, gradedCards, sealedProducts } from "@/data/marketData";
import AffiliateLinks from "@/components/AffiliateLinks";
import { sanitizeSearchInput } from "@/hooks/useInputSanitizer";

const CardSearch = () => {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    const raw = rawCards.filter(c => c.name.toLowerCase().includes(q) || c.set.toLowerCase().includes(q)).map(c => ({ ...c, category: "Raw" }));
    const graded = gradedCards.filter(c => c.name.toLowerCase().includes(q) || c.set.toLowerCase().includes(q)).map(c => ({ ...c, category: "Graded" }));
    const sealed = sealedProducts.filter(p => p.name.toLowerCase().includes(q)).map(p => ({ ...p, set: p.type, number: "—", mid: 0, category: "Sealed" }));
    return [...raw, ...graded, ...sealed].slice(0, 12);
  }, [query]);

  return (
    <div className="terminal-card overflow-hidden">
      <div className="border-b border-border px-4 py-3">
        <h2 className="text-sm font-bold tracking-wide text-secondary uppercase mb-3">Search Cards & Products</h2>
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(sanitizeSearchInput(e.target.value))}
            placeholder="Search by card name or set..."
            className="w-full rounded border border-border bg-muted px-3 py-2 pl-8 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <svg className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {results.length > 0 && (
        <div className="max-h-80 overflow-y-auto">
          {results.map((item, i) => (
            <div key={i} className="data-row flex items-center justify-between px-4 py-2.5">
              <div className="flex items-center gap-3">
                <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                  {item.category}
                </span>
                <div>
                  <span className="font-mono text-sm text-foreground font-medium">{item.name}</span>
                  <span className="font-mono text-xs text-muted-foreground ml-2">{item.set}</span>
                </div>
              </div>
              <div className="text-right space-y-1">
                <div>
                  <span className="font-mono text-sm text-foreground">
                    ${item.market.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                  <span className={`font-mono text-xs ml-2 font-semibold ${item.change >= 0 ? "text-terminal-green" : "text-terminal-red"}`}>
                    {item.change >= 0 ? "+" : ""}{item.change.toFixed(2)}%
                  </span>
                </div>
                <AffiliateLinks cardName={item.name} setName={item.set} compact />
              </div>
            </div>
          ))}
        </div>
      )}

      {query.trim() && results.length === 0 && (
        <div className="px-4 py-6 text-center">
          <p className="font-mono text-sm text-muted-foreground">No results found for "{query}"</p>
        </div>
      )}
    </div>
  );
};

export default CardSearch;
