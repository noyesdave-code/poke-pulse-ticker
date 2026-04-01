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
    partner: "tcgplayer",
    base: "https://www.tcgplayer.com/search/pokemon/product?q=",
    color: "text-terminal-blue hover:bg-terminal-blue/10 border-terminal-blue/20",
  },
  {
    name: "eBay",
    partner: "ebay",
    base: "https://www.ebay.com/sch/i.html?_nkw=pokemon+",
    color: "text-terminal-amber hover:bg-terminal-amber/10 border-terminal-amber/20",
  },
];

const trackClick = (partner: string, cardName: string, setName?: string) => {
  try {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
    if (!supabaseUrl || !supabaseKey) return;

    // Use sendBeacon so the request survives navigation to external site
    const payload = JSON.stringify({
      partner,
      card_name: cardName,
      card_set: setName || null,
    });

    const blob = new Blob([payload], { type: 'application/json' });
    
    // sendBeacon doesn't support custom headers, so use fetch with keepalive instead
    fetch(`${supabaseUrl}/rest/v1/affiliate_clicks`, {
      method: 'POST',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal',
      },
      body: payload,
      keepalive: true,
    }).catch(() => {});
  } catch {
    // fire-and-forget
  }
};

const AffiliateLinks = ({ cardName, setName, compact = false }: AffiliateLinksProps) => {
  const query = setName ? `${cardName} ${setName}` : cardName;

  const handleClick = (partner: string) => {
    trackClick(partner, cardName, setName);
  };

  if (compact) {
    return (
      <div className="flex items-center gap-1.5">
        {links.map((l) => (
          <a
            key={l.name}
            href={buildSearchUrl(l.base, query)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => handleClick(l.partner)}
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
          onClick={() => handleClick(l.partner)}
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
