import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock, Zap, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

/**
 * Urgency countdown — shows time remaining on the "launch week" offer.
 * Persists end time in localStorage so it's consistent per visitor.
 */
const STORAGE_KEY = "ppt_offer_end";
const OFFER_HOURS = 36; // 36-hour countdown window per visitor

function getEndTime(): number {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    const ts = parseInt(stored, 10);
    if (ts > Date.now()) return ts;
  }
  const end = Date.now() + OFFER_HOURS * 60 * 60 * 1000;
  localStorage.setItem(STORAGE_KEY, String(end));
  return end;
}

function formatTime(ms: number) {
  if (ms <= 0) return { h: "00", m: "00", s: "00" };
  const totalSec = Math.floor(ms / 1000);
  const h = String(Math.floor(totalSec / 3600)).padStart(2, "0");
  const m = String(Math.floor((totalSec % 3600) / 60)).padStart(2, "0");
  const s = String(totalSec % 60).padStart(2, "0");
  return { h, m, s };
}

const LaunchCountdown = () => {
  const [endTime] = useState(getEndTime);
  const [remaining, setRemaining] = useState(endTime - Date.now());
  const navigate = useNavigate();

  useEffect(() => {
    const id = setInterval(() => {
      const r = endTime - Date.now();
      setRemaining(r > 0 ? r : 0);
      if (r <= 0) clearInterval(id);
    }, 1000);
    return () => clearInterval(id);
  }, [endTime]);

  const { h, m, s } = formatTime(remaining);
  const expired = remaining <= 0;

  if (expired) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7, duration: 0.5 }}
      className="terminal-card border-primary/30 bg-gradient-to-r from-primary/5 via-background to-primary/5 overflow-hidden"
    >
      <div className="px-4 py-3 sm:px-6 sm:py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-primary/15 flex items-center justify-center flex-shrink-0">
            <Zap className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="font-mono text-xs font-bold text-foreground">
              🚀 Launch Week — <span className="text-primary">50% OFF</span> first month
            </p>
            <p className="font-mono text-[10px] text-muted-foreground flex items-center gap-1.5 mt-0.5">
              <Users className="w-3 h-3" />
              <span>127 collectors joined today</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-terminal-amber flex-shrink-0" />
            <div className="flex items-center gap-0.5 font-mono text-sm font-bold text-foreground">
              <span className="bg-muted px-1.5 py-0.5 rounded text-xs">{h}</span>
              <span className="text-muted-foreground text-[10px]">:</span>
              <span className="bg-muted px-1.5 py-0.5 rounded text-xs">{m}</span>
              <span className="text-muted-foreground text-[10px]">:</span>
              <span className="bg-muted px-1.5 py-0.5 rounded text-xs">{s}</span>
            </div>
          </div>
          <a
            href="/pricing"
            className="font-mono text-[11px] font-bold bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:shadow-[0_0_20px_hsl(160_84%_50%/0.3)] transition-all flex items-center gap-1.5 flex-shrink-0"
          >
            <Zap className="w-3 h-3" />
            Claim Offer
          </a>
        </div>
      </div>
    </motion.div>
  );
};

export default LaunchCountdown;
