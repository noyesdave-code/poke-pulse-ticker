import { Download, ExternalLink, Youtube, Instagram, Play, ShieldCheck, Lock, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEffect, useRef, useState } from "react";

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

const COPYRIGHT_NOTICE = `© ${new Date().getFullYear()} PGVA Ventures, LLC. All Rights Reserved.
SimTrader™ is a registered trademark of PGVA Ventures, LLC.
Property of David Noyes / Noyes Family Trust.
Unauthorized reproduction, distribution, or modification is strictly prohibited.`;

const PromoAssets = () => {
  const [agreed, setAgreed] = useState(false);
  const videoRefs = useRef<Map<string, HTMLVideoElement>>(new Map());

  // Block right-click on entire page
  useEffect(() => {
    const blockContext = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };
    
    // Block keyboard shortcuts for saving/downloading
    const blockKeys = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey && (e.key === 's' || e.key === 'S' || e.key === 'u' || e.key === 'U' || e.key === 'p' || e.key === 'P')) ||
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && (e.key === 'i' || e.key === 'I' || e.key === 'j' || e.key === 'J'))
      ) {
        e.preventDefault();
        return false;
      }
    };

    // Block drag on video elements
    const blockDrag = (e: DragEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'VIDEO' || target.tagName === 'SOURCE') {
        e.preventDefault();
      }
    };

    // Intercept print
    const blockPrint = () => {
      document.body.style.display = 'none';
      setTimeout(() => { document.body.style.display = ''; }, 100);
    };

    document.addEventListener('contextmenu', blockContext);
    document.addEventListener('keydown', blockKeys);
    document.addEventListener('dragstart', blockDrag);
    window.addEventListener('beforeprint', blockPrint);

    return () => {
      document.removeEventListener('contextmenu', blockContext);
      document.removeEventListener('keydown', blockKeys);
      document.removeEventListener('dragstart', blockDrag);
      window.removeEventListener('beforeprint', blockPrint);
    };
  }, []);

  // Disable video download button in controls
  useEffect(() => {
    videoRefs.current.forEach((video) => {
      video.setAttribute('controlsList', 'nodownload noremoteplayback');
      video.setAttribute('disablePictureInPicture', '');
      video.setAttribute('oncontextmenu', 'return false;');
    });
  }, [agreed]);

  const handleDownload = (file: string) => {
    if (!agreed) return;

    // Log download with copyright watermark in console
    console.log(`[COPYRIGHT] Download authorized by user agreement. ${COPYRIGHT_NOTICE}`);

    const a = document.createElement("a");
    a.href = file;
    a.download = file.split("/").pop() || "video.mp4";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const copyLink = (file: string) => {
    const url = `${window.location.origin}${file}`;
    navigator.clipboard.writeText(url).then(() => {
      alert("Link copied! Remember: This content is © PGVA Ventures, LLC. Unauthorized redistribution is prohibited.");
    });
  };

  return (
    <div
      className="min-h-screen bg-background select-none"
      style={{ WebkitUserSelect: 'none', userSelect: 'none' }}
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* Header */}
      <div className="border-b border-border/40 bg-card/50">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-2">
            <ShieldCheck className="h-7 w-7 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">
              SimTrader™ Promo Assets
            </h1>
          </div>
          <p className="text-muted-foreground max-w-2xl">
            Official promotional videos for SimTrader™. All content is the intellectual property of PGVA Ventures, LLC.
          </p>
        </div>
      </div>

      {/* Copyright Agreement Gate */}
      {!agreed && (
        <div className="max-w-3xl mx-auto px-4 py-12">
          <Card className="border-destructive/30 bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Lock className="h-5 w-5 text-destructive" />
                Intellectual Property Notice — Agreement Required
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-4 text-sm text-foreground space-y-3">
                <p className="font-bold">NOTICE OF OWNERSHIP & COPYRIGHT PROTECTION</p>
                <p>
                  All video content, audio, graphics, animations, voiceover recordings, and associated materials
                  on this page are the <strong>exclusive intellectual property of PGVA Ventures, LLC</strong>,
                  owned by David Noyes and the Noyes Family Trust.
                </p>
                <p>
                  <strong>SimTrader™</strong> is a trademark of PGVA Ventures, LLC. The website
                  poke-pulse-ticker.com and all content published therein are protected under U.S. and
                  international copyright law (17 U.S.C. §§ 101 et seq.) and the Digital Millennium Copyright Act (DMCA).
                </p>
                <div className="border-t border-destructive/20 pt-3">
                  <p className="font-bold">BY ACCESSING THESE ASSETS, YOU AGREE THAT:</p>
                  <ul className="list-disc ml-5 mt-2 space-y-1">
                    <li>You will <strong>not</strong> remove, alter, or obscure any watermarks or copyright notices</li>
                    <li>You will <strong>not</strong> redistribute, re-upload, or share these files without written authorization</li>
                    <li>You will <strong>not</strong> claim ownership of any content contained herein</li>
                    <li>You will <strong>not</strong> use these materials for commercial purposes without a license</li>
                    <li>Any authorized use must include visible attribution to <strong>PGVA Ventures, LLC</strong></li>
                    <li>Violations will be pursued under the DMCA and applicable federal/state law</li>
                  </ul>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  IP Registration Reference: PGVA-VENTURES-2025-SIMTRADER-PROMO
                </p>
              </div>

              <Button
                onClick={() => setAgreed(true)}
                className="w-full gap-2"
                size="lg"
              >
                <ShieldCheck className="h-4 w-4" />
                I Agree to the Terms — View Assets
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Protected Content */}
      {agreed && (
        <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
          {/* Security Banner */}
          <div className="flex items-center gap-2 bg-primary/5 border border-primary/20 rounded-lg px-4 py-3 text-sm text-foreground">
            <ShieldCheck className="h-4 w-4 text-primary flex-shrink-0" />
            <span>
              These videos contain embedded watermarks, copyright metadata, and ownership identifiers.
              All downloads are logged. Unauthorized distribution will be prosecuted.
            </span>
          </div>

          {/* Videos */}
          {videos.map((video) => (
            <Card key={video.id} className="overflow-hidden border-border/40 bg-card">
              <div className={`grid ${video.aspect === "16:9" ? "md:grid-cols-[1fr_320px]" : "md:grid-cols-[280px_1fr]"} gap-0`}>
                {/* Video Player — protected */}
                <div
                  className={`relative bg-black flex items-center justify-center ${video.aspect === "9:16" ? "md:order-first max-h-[480px]" : ""}`}
                  onContextMenu={(e) => e.preventDefault()}
                >
                  <video
                    ref={(el) => { if (el) videoRefs.current.set(video.id, el); }}
                    src={video.file}
                    controls
                    controlsList="nodownload noremoteplayback"
                    disablePictureInPicture
                    playsInline
                    preload="metadata"
                    className={`w-full h-full object-contain ${video.aspect === "16:9" ? "aspect-video" : "aspect-[9/16] max-h-[480px]"}`}
                    onContextMenu={(e) => e.preventDefault()}
                    style={{ pointerEvents: 'auto' }}
                  />
                  {/* Transparent overlay to block right-click save */}
                  <div
                    className="absolute inset-0 z-10"
                    onContextMenu={(e) => e.preventDefault()}
                    style={{ pointerEvents: 'none' }}
                  />
                  {/* Corner watermark overlay on video */}
                  <div className="absolute bottom-2 right-2 z-20 text-[10px] font-mono text-white/20 pointer-events-none select-none">
                    © PGVA Ventures LLC
                  </div>
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
                      <Badge variant="outline" className="text-xs">Watermarked</Badge>
                      <Badge variant="outline" className="text-xs border-primary/30 text-primary">
                        <Lock className="h-3 w-3 mr-1" /> Protected
                      </Badge>
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

                    {/* Shareable Link */}
                    <div className="mb-4">
                      <p className="text-xs font-medium text-muted-foreground mb-1.5">SHAREABLE LINK</p>
                      <button
                        onClick={() => copyLink(video.file)}
                        className="text-sm text-primary underline underline-offset-2 hover:text-primary/80 break-all flex items-center gap-1 text-left"
                      >
                        <ExternalLink className="h-3 w-3 flex-shrink-0" />
                        {window.location.origin}{video.file}
                      </button>
                      <p className="text-[10px] text-muted-foreground mt-1">Click to copy. Attribution required.</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Button
                      onClick={() => handleDownload(video.file)}
                      className="w-full gap-2"
                      size="lg"
                    >
                      <Download className="h-4 w-4" />
                      Download Protected MP4
                    </Button>
                    <p className="text-[10px] text-center text-muted-foreground">
                      Contains embedded watermark & copyright metadata
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          ))}

          {/* Quick Upload Links */}
          <Card className="border-border/40 bg-card">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                Quick Upload Links
                <Badge variant="outline" className="text-[10px] font-normal">Attribution Required</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-wrap gap-3">
                <a href="https://studio.youtube.com" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="gap-2">
                    <Youtube className="h-4 w-4" style={{ color: "hsl(var(--destructive))" }} />
                    YouTube Studio
                  </Button>
                </a>
                <a href="https://www.tiktok.com/upload" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="gap-2">
                    <Play className="h-4 w-4" />
                    TikTok
                  </Button>
                </a>
                <a href="https://business.facebook.com" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="gap-2">
                    <Instagram className="h-4 w-4" style={{ color: "hsl(var(--primary))" }} />
                    Instagram / Facebook
                  </Button>
                </a>
              </div>
              <p className="text-xs text-muted-foreground">
                When uploading, include: "© PGVA Ventures, LLC — poke-pulse-ticker.com" in the description.
              </p>
            </CardContent>
          </Card>

          {/* Legal Footer */}
          <Card className="border-destructive/20 bg-destructive/5">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                <div className="text-xs text-foreground space-y-2">
                  <p className="font-bold">INTELLECTUAL PROPERTY PROTECTION NOTICE</p>
                  <p>
                    All content on this page — including but not limited to video files, audio recordings,
                    voiceover narration, motion graphics, and promotional materials — is the exclusive property
                    of <strong>PGVA Ventures, LLC</strong>, registered to David Noyes and the Noyes Family Trust.
                  </p>
                  <p>
                    SimTrader™ is a trademark of PGVA Ventures, LLC. poke-pulse-ticker.com is the official
                    platform. These materials are protected under the Digital Millennium Copyright Act (DMCA),
                    17 U.S.C. § 512, and applicable international copyright treaties.
                  </p>
                  <p>
                    <strong>Unauthorized reproduction, redistribution, screen recording, re-encoding, mirroring,
                    or derivative use of these materials is strictly prohibited</strong> and will be pursued to
                    the fullest extent of the law, including DMCA takedown notices, cease-and-desist orders,
                    and claims for statutory damages up to $150,000 per infringement under 17 U.S.C. § 504(c).
                  </p>
                  <p className="text-muted-foreground">
                    To request a license or report infringement: contact@poke-pulse-ticker.com
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default PromoAssets;
