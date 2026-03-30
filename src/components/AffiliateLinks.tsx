import { ExternalLink } from "lucide-react";

interface AffiliateLinksProps {
  cardName: string;
  setName?: string;
  compact?: boolean;
}

const buildSearchUrl = (base: string, query: string) =>
  `${base}${encodeURIComponent(query)}`;

const links = [
  {
    name: "TCGPlayer",
    base: "https://www.tcgplayer.com/search/pokemon/product?q=",
    color: "text-terminal-blue hover:bg-terminal-blue/10 border-terminal-blue/20",
  },
  {
    name: "eBay",
    base: "https://www.ebay.com/sch/i.html?_nkw=pokemon+",
    color: "text-terminal-amber hover:bg-terminal-amber/10 border-terminal-amber/20",
  },
];

const AffiliateLinks = ({ cardName, setName, compact = false }: AffiliateLinksProps) => {
  const query = setName ? `${cardName} ${setName}` : cardName;

  if (compact) {
    return (
      <div className="flex items-center gap-1.5">
        {links.map((l) => (
          <a
            key={l.name}
            href={buildSearchUrl(l.base, query)}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-1 font-mono text-[9px] font-semibold px-1.5 py-0.5 rounded border transition-colors ${l.color}`}
          >
            {l.name}
            <ExternalLink className="w-2.5 h-2.5" />
          </a>
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="font-mono text-[9px] text-muted-foreground uppercase tracking-wider">Buy on:</span>
      {links.map((l) => (
        <a
          key={l.name}
          href={buildSearchUrl(l.base, query)}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center gap-1.5 font-mono text-[10px] font-semibold px-2.5 py-1 rounded border transition-colors ${l.color}`}
        >
          {l.name}
          <ExternalLink className="w-3 h-3" />
        </a>
      ))}
    </div>
  );
};

export default AffiliateLinks;
