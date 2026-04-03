import { useState, useCallback } from "react";
import { Share2, Copy, CheckCircle, X } from "lucide-react";

const ShareButton = () => {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const url = window.location.href;
  const title = document.title;

  const copyLink = useCallback(() => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [url]);

  const share = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {}
    } else {
      setOpen((o) => !o);
    }
  }, [title, url]);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
      {open && (
        <div className="bg-card border border-border rounded-xl shadow-lg p-4 w-64 space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-foreground">Share this page</span>
            <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center gap-2 bg-muted rounded-lg p-2">
            <input
              readOnly
              value={url}
              className="flex-1 bg-transparent font-mono text-[10px] text-muted-foreground outline-none truncate"
            />
            <button
              onClick={copyLink}
              className="flex items-center gap-1 px-2 py-1 bg-primary text-primary-foreground rounded font-mono text-[10px] font-semibold hover:opacity-90 transition-opacity shrink-0"
            >
              {copied ? <CheckCircle className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
          <div className="flex gap-2">
            <a
              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center py-1.5 rounded-lg bg-muted hover:bg-accent font-mono text-[10px] font-semibold text-foreground transition-colors"
            >
              𝕏 Twitter
            </a>
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center py-1.5 rounded-lg bg-muted hover:bg-accent font-mono text-[10px] font-semibold text-foreground transition-colors"
            >
              LinkedIn
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center py-1.5 rounded-lg bg-muted hover:bg-accent font-mono text-[10px] font-semibold text-foreground transition-colors"
            >
              Facebook
            </a>
          </div>
        </div>
      )}
      <button
        onClick={share}
        className="h-12 w-12 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-[0_0_20px_hsl(var(--primary)/0.4)] flex items-center justify-center transition-all duration-300 hover:scale-105"
        aria-label="Share this page"
      >
        <Share2 className="w-5 h-5" />
      </button>
    </div>
  );
};

export default ShareButton;
