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

const videoLibrary: VideoEntry[] = [
  {
    id: "feature-showcase",
    title: "Feature Showcase — Full Platform Tour",
    description: "59-second deep dive into Market Data, Portfolio Tracking, AI Signals, Price Predictions, SimTrader World™, and Pro Tools.",
    file: "/videos/feature-showcase-2026.mp4",
    aspect: "16:9",
    duration: "0:59",
    category: "Feature Tour",
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
    id: "investor-pitch",
    title: "Investor Pitch — Why Poke Pulse Ticker",
    description: "45-second investor-focused pitch covering audit scores, subscription tiers, competitive advantages, and market metrics.",
    file: "/videos/investor-pitch-horizontal.mp4",
    aspect: "16:9",
    duration: "0:45",
    category: "Investor",
    date: "2026-03-30",
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
      {/* Header */}
      <div className="border-b border-border/40 bg-card/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8">
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="h-6 w-6 text-primary" />
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Video Library</h1>
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
            <span>All content © {new Date().getFullYear()} PGVA Ventures, LLC — David Noyes / Noyes Family Trust. DMCA protected.</span>
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
