import { useState, useRef, useEffect } from "react";
import { Play, Lock, ShieldCheck, Eye, Calendar, Clock, Filter, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";

interface VideoEntry {
  id: string;
  title: string;
  description: string;
  file: string;
  thumbnail?: string;
  aspect: "16:9" | "9:16";
  duration: string;
  category: string;
  date: string;
  views: number;
}

const SOCIAL_HIGHLIGHT_DESC = `The wait is finally over. PGVA Ventures, LLC officially presents the Poke-Pulse-Ticker Market Terminal—the most sophisticated data engine ever built for the Poké TCG ecosystem. Stop guessing and start dominating with the professional-grade tools used by the world's top high-velocity collectors.

This isn't just a tracker; it's a command center. Gain a competitive edge with real-time live pricing for 500+ high-liquidity cards, updated every second. Our proprietary AI-powered market signals alert you to breakouts before they hit social media, while our advanced grading arbitrage tools identify the exact spreads between raw and slabbed assets to maximize your ROI.

Ready to test your instincts without the risk? Enter SimTrader World™, our immersive virtual trading game, or step into the Poké-Pulse Arena™, the ultimate destination for competitive market betting. Whether you are managing a six-figure warehouse or starting your first binder, our 7-tier subscription model offers tailored features for every level of investor—from casual enthusiasts to institutional-grade whales.

Track your entire collection with our precision Portfolio Tracking suite and watch your net worth move in real-time. The market never sleeps, and now, you'll never miss a beat.

🚀 JOIN THE REVOLUTION: Sign up today and claim your 14-day FREE TRIAL to experience the full power of the Terminal. The era of the "uninformed collector" is over. Welcome to the future of Poké-Economics.`;

const videoLibrary: VideoEntry[] = [
  {
    id: "combined-gl-sh",
    title: "Grand Launch × Social Highlight — Full 3-Minute Experience",
    description: "The definitive 3-minute cinematic presentation combining the Grand Launch and Social Highlight promos. Features VO-synced transitions, sidechain-ducked audio, and transition SFX. The complete story of Poke-Pulse-Ticker in one video.",
    file: "/videos/combined-gl-sh-3min.mp4",
    aspect: "16:9",
    duration: "3:28",
    category: "Launch",
    date: "2026-04-01",
    views: 0,
  },
  {
    id: "grand-launch-yt-synced",
    title: "Grand Launch — VO-Synced YouTube Edition",
    description: "90-second grand launch promo with VO-aligned scene transitions, sidechain-ducked audio mix, and cinematic transition SFX. Optimized for YouTube and desktop.",
    file: "/videos/grand-launch-yt-synced.mp4",
    aspect: "16:9",
    duration: "1:30",
    category: "Launch",
    date: "2026-04-01",
    views: 0,
  },
  {
    id: "social-highlight-yt-synced",
    title: "Social Highlight — VO-Synced YouTube Edition",
    description: SOCIAL_HIGHLIGHT_DESC,
    file: "/videos/social-highlight-yt-synced.mp4",
    aspect: "16:9",
    duration: "2:00",
    category: "Launch",
    date: "2026-04-01",
    views: 0,
  },
  {
    id: "social-highlight-yt",
    title: "Social Highlight — Official Platform Overview (YouTube)",
    description: SOCIAL_HIGHLIGHT_DESC,
    file: "/videos/social-highlight-youtube-90s.mp4",
    aspect: "16:9",
    duration: "1:30",
    category: "Launch",
    date: "2026-04-01",
    views: 0,
  },
  {
    id: "social-highlight-vertical",
    title: "Social Highlight — Official Platform Overview (Vertical)",
    description: SOCIAL_HIGHLIGHT_DESC,
    file: "/videos/social-highlight-90s.mp4",
    aspect: "9:16",
    duration: "1:30",
    category: "Launch",
    date: "2026-04-01",
    views: 0,
  },
  {
    id: "grand-launch-social",
    title: "Grand Launch — Official Mega Final Launch Sale (Vertical)",
    description: "90-second grand launch promo with 20 cinematic scenes, Laura AI voiceover & electronic music. Covers all 7 tiers, Alpha Signals, SimTrader World™, Arena, and more.",
    file: "/videos/grand-launch-social-final.mp4",
    aspect: "9:16",
    duration: "1:30",
    category: "Launch",
    date: "2026-04-01",
    views: 0,
  },
  {
    id: "grand-launch-youtube",
    title: "Grand Launch — Official Mega Final Launch Sale (YouTube)",
    description: "90-second horizontal grand launch promo with 20 scenes, Laura voiceover & background music. Optimized for YouTube, Facebook, and desktop viewing.",
    file: "/videos/grand-launch-youtube-final.mp4",
    aspect: "16:9",
    duration: "1:30",
    category: "Launch",
    date: "2026-04-01",
    views: 0,
  },
  {
    id: "feature-showcase-v5",
    title: "Feature Showcase v5 — Full Platform Tour",
    description: "84-second cinematic deep dive with Laura voiceover & electronic music. 15 scenes covering Market Pulse, SimTrader World™, Arena, AI Signals, and Pro Tools.",
    file: "/videos/feature-showcase-2026.mp4",
    aspect: "16:9",
    duration: "1:24",
    category: "Feature Tour",
    date: "2026-03-31",
    views: 0,
  },
  {
    id: "investor-pitch",
    title: "Investor Pitch — Why Poke Pulse Ticker",
    description: "45-second investor-focused pitch covering audit scores, subscription tiers, competitive advantages, and market metrics.",
    file: "/videos/investor-pitch-horizontal.mp4",
    aspect: "16:9",
    duration: "0:45",
    category: "Investor",
    date: "2026-03-31",
    views: 0,
  },
  {
    id: "social-pitch-vertical",
    title: "Social Pitch — Vertical",
    description: "45-second vertical investor/social pitch optimized for TikTok, Instagram Reels, and YouTube Shorts.",
    file: "/videos/social-pitch-vertical.mp4",
    aspect: "9:16",
    duration: "0:45",
    category: "Investor",
    date: "2026-03-31",
    views: 0,
  },
  {
    id: "simtrader-promo-yt",
    title: "SimTrader™ Promo — YouTube",
    description: "30-second horizontal promo with voiceover and techno background music. Optimized for YouTube, Facebook, and desktop.",
    file: "/videos/simtrader-promo-youtube-16x9.mp4",
    aspect: "16:9",
    duration: "0:30",
    category: "Promo",
    date: "2026-03-30",
    views: 0,
  },
  {
    id: "simtrader-promo-vertical",
    title: "SimTrader™ Promo — Vertical",
    description: "30-second vertical promo for mobile-first platforms. Same voiceover and cinematic music mix.",
    file: "/videos/simtrader-promo-vertical-9x16.mp4",
    aspect: "9:16",
    duration: "0:30",
    category: "Promo",
    date: "2026-03-30",
    views: 0,
  },
  {
    id: "franchise-umbrella",
    title: "Pulse Market Terminal™ — 12-Vertical Franchise Pitch",
    description: "27-second investor pitch showcasing the Pulse Market Terminal expansion across 12 collectible and sports card verticals — Poké, MLB, NFL, NBA, NHL, FIFA, MTG, Yu-Gi-Oh!, Dragon Ball Z, Lorcana, and Star Wars. $103B+ combined TAM under PGVA Ventures, LLC.",
    file: "/videos/franchise-pitch-2026.mp4",
    aspect: "16:9",
    duration: "0:27",
    category: "Franchise",
    date: "2026-04-02",
    views: 0,
  },
  {
    id: "investor-pitch-59s",
    title: "Investor Pitch — 59s Extended Franchise Overview",
    description: "59-second cinematic investor pitch covering audit scores, 7 subscription tiers, market performance, SimTrader World™, competitive advantages, franchise verticals ($103B+ TAM), 5-year revenue projections ($157.8M ARR), top 10 strategic investors, and final call to action. © PGVA Ventures, LLC.",
    file: "/videos/investor-pitch-59s-2026.mp4",
    aspect: "16:9",
    duration: "0:59",
    category: "Investor",
    date: "2026-04-02",
    views: 0,
  },
  {
    id: "investor-12-engines",
    title: "12 Revenue Engines — Investor Social Pitch",
    description: "59-second polished investor pitch highlighting all 12 revenue-generating market engines: Live Indexes, Growth Charts, SimTrader World™, Poké-Pulse Arena™, Poké Adventure Land, Alpha Signals, Grading Arbitrage, Portfolio Tracking, Whale Reports, Data API, Franchise Blueprint, and Subscription Tiers. Female voiceover, upbeat background music, large-frame imagery. Optimized for social media. Contact: contact@poke-pulse-ticker.com. © PGVA Ventures, LLC. All rights reserved. Protected under U.S. Patent, Trademark & Copyright law.",
    file: "/videos/PGVA_Investor_Pitch_59s_2026.mp4",
    aspect: "16:9",
    duration: "0:59",
    category: "Investor",
    date: "2026-04-02",
    views: 0,
  },
  {
    id: "tier1-poke-pulse-av",
    title: "Tier 1 — Poké Pulse Market Terminal (VO + Music)",
    description: "30-second aggressive social promo with Laura AI voiceover and upbeat electronic music. Highlights live pricing for 500+ cards, SimTrader World™, Poké-Pulse Arena™, Alpha Signals, grading arbitrage, and 7-tier subscriptions. © PGVA Ventures, LLC.",
    file: "/videos/PGVA_Tier1_PokePulse_Promo_2026_AV.mp4",
    aspect: "16:9",
    duration: "0:30",
    category: "Campaign",
    date: "2026-04-03",
    views: 0,
  },
  {
    id: "tier2-pulse-market-av",
    title: "Tier 2 — Pulse Market Terminal Franchise (VO + Music)",
    description: "30-second investor-focused promo with Laura AI voiceover and cinematic orchestral music. Covers $103B+ TAM, $157.8M ARR projections, 12 revenue engines, and $1.89B valuation. © PGVA Ventures, LLC.",
    file: "/videos/PGVA_Tier2_PulseMarket_Promo_2026_AV.mp4",
    aspect: "16:9",
    duration: "0:30",
    category: "Campaign",
    date: "2026-04-03",
    views: 0,
  },
  {
    id: "tier3-pgtv-av",
    title: "Tier 3 — PGTV Media Hub (VO + Music)",
    description: "30-second promo with Laura AI voiceover and upbeat music. Highlights live streaming, creator tools, ad revenue sharing, exclusive content, and community features for collectors, investors, and streamers. © PGVA Ventures, LLC.",
    file: "/videos/PGVA_Tier3_PGTV_Promo_2026_AV.mp4",
    aspect: "16:9",
    duration: "0:30",
    category: "Campaign",
    date: "2026-04-03",
    views: 0,
  },
  {
    id: "poke-race-promo",
    title: "Poké Race™ — Game Promo (Music)",
    description: "30-second promo for Poké Race™, the live card racing game. Features 5-minute sprint races, 1000 free coins, and competitive betting across Raw, Graded, and Sealed products. © PGVA Ventures, LLC.",
    file: "/videos/PGVA_PokeRace_Promo_2026_AV.mp4",
    aspect: "16:9",
    duration: "0:30",
    category: "Campaign",
    date: "2026-04-03",
    views: 0,
  },
  {
    id: "combined-3tier-demo-av",
    title: "3-Tier Vertical Integration — Full Demo (VO + Music)",
    description: "Nearly 2-minute cinematic demo with Laura AI voiceover and epic orchestral-electronic soundtrack. Complete walkthrough of all three vertical tiers: Poké Pulse (Data), Pulse Market Terminal (Franchise), and PGTV Media Hub (Media). © PGVA Ventures, LLC.",
    file: "/videos/PGVA_3Tier_Combined_Demo_2026_AV.mp4",
    aspect: "16:9",
    duration: "1:53",
    category: "Campaign",
    date: "2026-04-03",
    views: 0,
  },
  {
    id: "tier1-poke-pulse",
    title: "Tier 1 — Poké Pulse Market Terminal Promo (Silent)",
    description: "30-second aggressive social promo for the Poké Pulse Market Terminal — the consumer-facing data engine. Silent version. © PGVA Ventures, LLC.",
    file: "/videos/PGVA_Tier1_PokePulse_Promo_2026.mp4",
    aspect: "16:9",
    duration: "0:30",
    category: "Campaign",
    date: "2026-04-03",
    views: 0,
  },
  {
    id: "tier2-pulse-market",
    title: "Tier 2 — Pulse Market Terminal Franchise Promo (Silent)",
    description: "30-second investor-focused promo. Silent version. © PGVA Ventures, LLC.",
    file: "/videos/PGVA_Tier2_PulseMarket_Promo_2026.mp4",
    aspect: "16:9",
    duration: "0:30",
    category: "Campaign",
    date: "2026-04-03",
    views: 0,
  },
  {
    id: "tier3-pgtv",
    title: "Tier 3 — PGTV Media Hub Promo (Silent)",
    description: "30-second promo for PGTV Media Hub. Silent version. © PGVA Ventures, LLC.",
    file: "/videos/PGVA_Tier3_PGTV_Promo_2026.mp4",
    aspect: "16:9",
    duration: "0:30",
    category: "Campaign",
    date: "2026-04-03",
    views: 0,
  },
  {
    id: "combined-3tier-demo",
    title: "3-Tier Vertical Integration — Full Demo (Silent)",
    description: "Nearly 2-minute cinematic demo. Silent version. © PGVA Ventures, LLC.",
    file: "/videos/PGVA_3Tier_Combined_Demo_2026.mp4",
    aspect: "16:9",
    duration: "1:53",
    category: "Campaign",
    date: "2026-04-03",
    views: 0,
  },
];

const categories = ["All", ...Array.from(new Set(videoLibrary.map(v => v.category)))];

const VideoLibrary = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [playingId, setPlayingId] = useState<string | null>(null);
  const videoRefs = useRef<Map<string, HTMLVideoElement>>(new Map());
  const navigate = useNavigate();

  const filtered = videoLibrary.filter(v => {
    const matchCat = activeCategory === "All" || v.category === activeCategory;
    const matchSearch = v.title.toLowerCase().includes(search.toLowerCase()) ||
      v.description.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  // Block right-click and keyboard shortcuts on this page
  useEffect(() => {
    const block = (e: MouseEvent) => e.preventDefault();
    const blockKeys = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey && ['s','u','p'].includes(e.key.toLowerCase())) ||
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && ['i','j'].includes(e.key.toLowerCase()))
      ) {
        e.preventDefault();
      }
    };
    const blockDrag = (e: DragEvent) => {
      if ((e.target as HTMLElement)?.tagName === 'VIDEO') e.preventDefault();
    };
    document.addEventListener('contextmenu', block);
    document.addEventListener('keydown', blockKeys);
    document.addEventListener('dragstart', blockDrag);
    return () => {
      document.removeEventListener('contextmenu', block);
      document.removeEventListener('keydown', blockKeys);
      document.removeEventListener('dragstart', blockDrag);
    };
  }, []);

  const handlePlay = (id: string) => {
    // Pause other videos
    videoRefs.current.forEach((el, key) => {
      if (key !== id) el.pause();
    });
    setPlayingId(id);
    const el = videoRefs.current.get(id);
    if (el) el.play();
  };

  return (
    <div
      className="min-h-screen bg-background select-none"
      style={{ userSelect: "none", WebkitUserSelect: "none" }}
      onContextMenu={e => e.preventDefault()}
    >
      {/* PGTV Hero — Auto-playing newest video */}
      <div className="bg-black relative overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <video
            src={videoLibrary[0]?.file}
            autoPlay
            muted
            loop
            playsInline
            controlsList="nodownload noremoteplayback"
            disablePictureInPicture
            className="w-full aspect-video object-contain"
            onContextMenu={e => e.preventDefault()}
          />
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-4 sm:p-6">
            <Badge className="bg-primary/90 text-primary-foreground text-[10px] mb-2">
              🔴 NOW PLAYING
            </Badge>
            <h2 className="text-white text-lg sm:text-xl font-bold">{videoLibrary[0]?.title}</h2>
            <p className="text-white/60 text-xs mt-1 line-clamp-2 max-w-2xl">{videoLibrary[0]?.description}</p>
          </div>
          <div className="absolute top-2 right-2 text-[8px] font-mono text-white/15 pointer-events-none select-none">
            © PGVA Ventures LLC
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="border-b border-border/40 bg-card/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8">
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="h-6 w-6 text-primary" />
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">PGTV Media Hub — Video Library</h1>
            <Badge variant="outline" className="ml-2 text-[10px] border-primary/30 text-primary">
              <Lock className="h-3 w-3 mr-1" /> Protected
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground max-w-xl">
            Watch the platform evolve. All content is © PGVA Ventures, LLC — streaming only, downloads prohibited.
          </p>

          {/* Search + Filters */}
          <div className="mt-4 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search videos…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9 bg-background/50"
              />
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <Filter className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              {categories.map(cat => (
                <Button
                  key={cat}
                  variant={activeCategory === cat ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveCategory(cat)}
                  className="text-xs whitespace-nowrap"
                >
                  {cat}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Video Grid */}
      <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8">
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <p>No videos match your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filtered.map(video => (
              <Card
                key={video.id}
                className="overflow-hidden border-border/40 bg-card group hover:border-primary/30 transition-colors"
              >
                {/* Video Player */}
                <div
                  className="relative bg-black cursor-pointer"
                  onClick={() => handlePlay(video.id)}
                  onContextMenu={e => e.preventDefault()}
                >
                  <video
                    ref={el => { if (el) videoRefs.current.set(video.id, el); }}
                    src={video.file}
                    controls={playingId === video.id}
                    controlsList="nodownload noremoteplayback"
                    disablePictureInPicture
                    playsInline
                    preload="metadata"
                    className={`w-full ${video.aspect === "16:9" ? "aspect-video" : "aspect-[9/16] max-h-[320px] mx-auto"} object-contain`}
                    onContextMenu={e => e.preventDefault()}
                    onEnded={() => setPlayingId(null)}
                  />
                  {/* Play overlay */}
                  {playingId !== video.id && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/20 transition-colors">
                      <div className="w-12 h-12 rounded-full bg-primary/90 flex items-center justify-center">
                        <Play className="h-5 w-5 text-primary-foreground ml-0.5" fill="currentColor" />
                      </div>
                    </div>
                  )}
                  {/* Duration badge */}
                  <Badge className="absolute bottom-2 right-2 text-[10px] bg-black/70 text-white border-0">
                    <Clock className="h-3 w-3 mr-1" />
                    {video.duration}
                  </Badge>
                  {/* Watermark */}
                  <div className="absolute bottom-1 left-2 text-[8px] font-mono text-white/15 pointer-events-none select-none">
                    © PGVA Ventures LLC
                  </div>
                </div>

                {/* Info */}
                <CardContent className="p-3 sm:p-4 space-y-2">
                  <h3 className="font-semibold text-sm text-foreground line-clamp-1">{video.title}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-2">{video.description}</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="outline" className="text-[10px]">{video.category}</Badge>
                    <Badge variant="outline" className="text-[10px]">{video.aspect}</Badge>
                    <span className="text-[10px] text-muted-foreground flex items-center gap-1 ml-auto">
                      <Calendar className="h-3 w-3" />
                      {new Date(video.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* IP Footer */}
        <div className="mt-8 border-t border-border/40 pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[10px] text-muted-foreground">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-3.5 w-3.5 text-primary flex-shrink-0" />
            <span>All content © {new Date().getFullYear()} PGVA Ventures, LLC. DMCA protected.</span>
          </div>
          <Button variant="ghost" size="sm" className="text-xs h-7" onClick={() => navigate("/promo")}>
            Authorized Downloads →
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VideoLibrary;
