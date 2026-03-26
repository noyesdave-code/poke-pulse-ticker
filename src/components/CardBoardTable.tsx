import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { CardData } from "@/data/marketData";

const cardRoute = (card: CardData) =>
  card._apiId ? `/card/${card._apiId}` : `/card/${encodeURIComponent(`${card.name}-${card.set}-${card.number}`.replace(/\s+/g, "-").toLowerCase())}`;

interface CardBoardTableProps {
  cards: CardData[];
  title: string;
  showGrade?: boolean;
}

const GRADING_COMPANIES = ["ALL", "PSA", "CGC", "BGS", "TAG"] as const;

const CardBoardTable = ({ cards, title, showGrade = false }: CardBoardTableProps) => {
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState<"market" | "change">("market");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [gradeFilter, setGradeFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const toggleSort = (col: "market" | "change") => {
    if (sortBy === col) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortBy(col); setSortDir("desc"); }
  };

  const filtered = gradeFilter === "ALL" || !showGrade
    ? cards
    : cards.filter(c => c.grade?.startsWith(gradeFilter));

  const sorted = [...filtered].sort((a, b) => {
    const mul = sortDir === "desc" ? -1 : 1;
    return (a[sortBy] - b[sortBy]) * mul;
  });

  const SortIcon = ({ col }: { col: "market" | "change" }) => (
    <span className="ml-1 text-muted-foreground">{sortBy === col ? (sortDir === "desc" ? "↓" : "↑") : ""}</span>
  );

  return (
    <div className="terminal-card overflow-hidden">
      <div className="border-b border-border px-4 py-3 flex items-center justify-between flex-wrap gap-2">
        <h2 className="font-mono text-xs tracking-widest text-secondary uppercase font-semibold">{title}</h2>
        <div className="flex items-center gap-2">
          {showGrade && (
            <div className="flex gap-1">
              {GRADING_COMPANIES.map(company => (
                <button
                  key={company}
                  onClick={() => setGradeFilter(company)}
                  className={`px-2 py-0.5 font-mono text-[10px] tracking-wider rounded transition-colors ${
                    gradeFilter === company
                      ? "bg-secondary text-secondary-foreground"
                      : "text-muted-foreground hover:text-foreground border border-border"
                  }`}
                >
                  {company}
                </button>
              ))}
            </div>
          )}
          <span className="font-mono text-[10px] text-muted-foreground">{filtered.length} items</span>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="px-4 py-2 text-left font-mono text-[10px] tracking-widest text-muted-foreground uppercase">Card</th>
              <th className="px-4 py-2 text-left font-mono text-[10px] tracking-widest text-muted-foreground uppercase">Set</th>
              {showGrade && (
                <th className="px-4 py-2 text-left font-mono text-[10px] tracking-widest text-muted-foreground uppercase">Grade</th>
              )}
              <th className="px-4 py-2 text-left font-mono text-[10px] tracking-widest text-muted-foreground uppercase">#</th>
              <th
                className="px-4 py-2 text-right font-mono text-[10px] tracking-widest text-muted-foreground uppercase cursor-pointer hover:text-foreground"
                onClick={() => toggleSort("market")}
              >
                Market<SortIcon col="market" />
              </th>
              <th className="px-4 py-2 text-right font-mono text-[10px] tracking-widest text-muted-foreground uppercase">Low</th>
              <th className="px-4 py-2 text-right font-mono text-[10px] tracking-widest text-muted-foreground uppercase">Mid</th>
              <th
                className="px-4 py-2 text-right font-mono text-[10px] tracking-widest text-muted-foreground uppercase cursor-pointer hover:text-foreground"
                onClick={() => toggleSort("change")}
              >
                Chg%<SortIcon col="change" />
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((card, i) => (
              <tr key={i} className="data-row cursor-pointer" onClick={() => navigate(cardRoute(card))}>
                <td className="px-4 py-2 font-mono text-sm text-foreground font-medium flex items-center gap-2">
                  {card._image && <img src={card._image} alt="" className="w-6 h-8 rounded object-cover" />}
                  {card.name}
                </td>
                <td className="px-4 py-2 font-mono text-xs text-muted-foreground">{card.set}</td>
                {showGrade && (
                  <td className="px-4 py-2 font-mono text-xs text-terminal-amber font-semibold">{card.grade}</td>
                )}
                <td className="px-4 py-2 font-mono text-xs text-muted-foreground">{card.number}</td>
                <td className="px-4 py-2 font-mono text-sm text-foreground text-right">
                  ${card.market.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </td>
                <td className="px-4 py-2 font-mono text-xs text-muted-foreground text-right">
                  ${card.low.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </td>
                <td className="px-4 py-2 font-mono text-xs text-muted-foreground text-right">
                  ${card.mid.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </td>
                <td className={`px-4 py-2 font-mono text-sm text-right font-semibold ${card.change >= 0 ? "text-terminal-green" : "text-terminal-red"}`}>
                  {card.change >= 0 ? "+" : ""}{card.change.toFixed(2)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CardBoardTable;
