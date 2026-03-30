import { Download, Play, ExternalLink, Youtube, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

const videos = [
  {
    id: "youtube",
    title: "SimTrader™ Promo — YouTube (16:9)",
    description: "30-second horizontal promo with voiceover and techno background music. Optimized for YouTube, Facebook, and desktop.",
    file: "/videos/simtrader-promo-youtube-16x9.mp4",
    aspect: "16:9",
    resolution: "1920×1080",
    platforms: ["YouTube", "Facebook", "LinkedIn"],
  },
  {
    id: "vertical",
    title: "SimTrader™ Promo — Vertical (9:16)",
    description: "30-second vertical promo for mobile-first platforms. Same voiceover and music mix.",
    file: "/videos/simtrader-promo-vertical-9x16.mp4",
    aspect: "9:16",
    resolution: "1080×1920",
    platforms: ["TikTok", "Instagram Reels", "YouTube Shorts"],
  },
];

const PromoAssets = () => {
  const [playing, setPlaying] = useState<string | null>(null);

  const handleDownload = (file: string, title: string) => {
    const a = document.createElement("a");
    a.href = file;
    a.download = file.split("/").pop() || "video.mp4";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/40 bg-card/50">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            SimTrader™ Promo Assets
          </h1>
          <p className="text-muted-foreground max-w-2xl">
            Download ready-to-post promotional videos for social media. Each version includes a female voiceover explaining game features, rules, and prizes with techno background music.
          </p>
        </div>
      </div>

      {/* Video Grid */}
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {videos.map((video) => (
          <Card key={video.id} className="overflow-hidden border-border/40 bg-card">
            <div className={`grid ${video.aspect === "16:9" ? "md:grid-cols-[1fr_320px]" : "md:grid-cols-[280px_1fr]"} gap-0`}>
              {/* Video Player */}
              <div className={`relative bg-black flex items-center justify-center ${video.aspect === "9:16" ? "md:order-first max-h-[480px]" : ""}`}>
                <video
                  src={video.file}
                  controls
                  playsInline
                  preload="metadata"
                  className={`w-full h-full object-contain ${video.aspect === "16:9" ? "aspect-video" : "aspect-[9/16] max-h-[480px]"}`}
                  onPlay={() => setPlaying(video.id)}
                  onPause={() => setPlaying(null)}
                />
              </div>

              {/* Info Panel */}
              <div className="p-6 flex flex-col justify-between">
                <div>
                  <CardTitle className="text-xl mb-2 text-foreground">{video.title}</CardTitle>
                  <p className="text-sm text-muted-foreground mb-4">{video.description}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="outline" className="text-xs">{video.resolution}</Badge>
                    <Badge variant="outline" className="text-xs">{video.aspect}</Badge>
                    <Badge variant="outline" className="text-xs">30 sec</Badge>
                    <Badge variant="outline" className="text-xs">H.264 / AAC</Badge>
                  </div>

                  <div className="mb-4">
                    <p className="text-xs font-medium text-muted-foreground mb-1.5">BEST FOR</p>
                    <div className="flex flex-wrap gap-1.5">
                      {video.platforms.map((p) => (
                        <Badge key={p} className="text-xs bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
                          {p}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Direct Link */}
                  <div className="mb-4">
                    <p className="text-xs font-medium text-muted-foreground mb-1.5">DIRECT LINK</p>
                    <a
                      href={video.file}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary underline underline-offset-2 hover:text-primary/80 break-all flex items-center gap-1"
                    >
                      <ExternalLink className="h-3 w-3 flex-shrink-0" />
                      {window.location.origin}{video.file}
                    </a>
                  </div>
                </div>

                <Button
                  onClick={() => handleDownload(video.file, video.title)}
                  className="w-full gap-2"
                  size="lg"
                >
                  <Download className="h-4 w-4" />
                  Download MP4
                </Button>
              </div>
            </div>
          </Card>
        ))}

        {/* Share Links */}
        <Card className="border-border/40 bg-card">
          <CardHeader>
            <CardTitle className="text-lg">Quick Upload Links</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <a href="https://studio.youtube.com" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="gap-2">
                <Youtube className="h-4 w-4 text-red-500" />
                Upload to YouTube
              </Button>
            </a>
            <a href="https://www.tiktok.com/upload" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="gap-2">
                <Play className="h-4 w-4" />
                Upload to TikTok
              </Button>
            </a>
            <a href="https://business.facebook.com" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="gap-2">
                <Instagram className="h-4 w-4 text-pink-500" />
                Upload to Instagram/Facebook
              </Button>
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PromoAssets;
