import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import AuthModal from "@/components/AuthModal";
import { Menu, X, LayoutDashboard, Layers, Briefcase, Activity, BookOpen, Brain, CalendarDays, Eye, Mail, Bell, CheckCircle, User, ArrowLeftRight, DollarSign, ChevronDown, Gamepad2, Video, Sparkles } from "lucide-react";
import AccessibilityToggle from "@/components/AccessibilityToggle";

const primaryNav = [
  { path: "/", label: "Terminal", icon: LayoutDashboard },
  { path: "/sets", label: "Sets", icon: Layers },
  { path: "/portfolio", label: "Portfolio", icon: Briefcase },
  { path: "/dashboard", label: "Dashboard", icon: Activity },
  { path: "/pricing", label: "Pricing", icon: DollarSign },
  { path: "/sim-trader", label: "SimTrader World", icon: Gamepad2 },
  { path: "/arena", label: "Arena", icon: Sparkles },
];

const moreNav = [
  { path: "/watchlist", label: "Watchlist", icon: Eye },
  { path: "/alerts", label: "Alerts", icon: Bell },
  { path: "/releases", label: "Releases", icon: CalendarDays },
  { path: "/videos", label: "Videos", icon: Video },
  { path: "/promo", label: "Promo", icon: Video },
  { path: "/set-completion", label: "Collection", icon: CheckCircle },
  { path: "/guides", label: "Guides", icon: BookOpen },
  { path: "/trade", label: "Trade", icon: ArrowLeftRight },
  { path: "/command-center", label: "AI Center", icon: Brain },
  { path: "/profile", label: "Profile", icon: User },
  { path: "/contact", label: "Contact", icon: Mail },
];

const allNav = [...primaryNav, ...moreNav];

const formatEasternLabel = (value: string) =>
  value.replace("Eastern Daylight Time", "ET").replace("Eastern Standard Time", "ET").replace("EDT", "ET").replace("EST", "ET");

const TerminalHeader = () => {
  const [time, setTime] = useState(new Date());
  const [showAuth, setShowAuth] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);
  const { user, signOut, tier } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const easternTime = useMemo(
    () => ({
      compact: formatEasternLabel(
        time.toLocaleTimeString("en-US", {
          timeZone: "America/New_York",
          hour: "numeric",
          minute: "2-digit",
          timeZoneName: "short",
        })
      ),
      full: formatEasternLabel(
        time.toLocaleString("en-US", {
          timeZone: "America/New_York",
          month: "numeric",
          day: "numeric",
          year: "numeric",
          hour: "numeric",
          minute: "2-digit",
          timeZoneName: "short",
        })
      ),
    }),
    [time]
  );

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
    setMoreOpen(false);
  }, [location.pathname]);

  // Close "More" dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleNav = (path: string) => {
    navigate(path);
    setMenuOpen(false);
  };

  return (
    <>
      <header data-demo-hide className="sticky top-0 z-50 border-b border-border/60 bg-terminal-header/98 backdrop-blur-xl shadow-[0_1px_3px_hsl(228_40%_3%/0.4),0_4px_20px_hsl(228_40%_3%/0.3)]">
        <div className="flex items-center justify-between px-3 py-2.5 sm:px-4 sm:py-3 lg:px-4 xl:px-6">
          {/* Left: logo + hamburger */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            {/* Hamburger — mobile only */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="sm:hidden flex items-center justify-center w-8 h-8 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
              aria-label="Toggle menu"
            >
              {menuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>

            <div
              className="flex items-center gap-2 sm:gap-3 cursor-pointer group"
              onClick={() => handleNav("/")}
            >
              <div className="flex flex-col leading-none select-none">
                <span className="font-display font-black text-[13px] sm:text-[15px] tracking-tight text-foreground transition-all duration-300 group-hover:brightness-125" style={{ textShadow: '0 0 8px hsl(210 25% 97% / 0.5)' }}>
                  Poke-Pulse-
                </span>
                <span className="font-display font-extrabold text-[11px] sm:text-[13px] tracking-[0.06em] text-primary uppercase" style={{ textShadow: '0 0 10px hsl(158 72% 46% / 0.4)' }}>
                  Market Terminal
                </span>
              </div>
            </div>

            {/* Desktop nav */}
            <nav className="hidden sm:flex items-center gap-0 ml-2 lg:ml-3">
              {primaryNav.map((item) => (
                <button
                  key={item.path}
                  onClick={() => handleNav(item.path)}
                  className={`relative text-[9px] xl:text-[10px] font-semibold uppercase tracking-wide px-1.5 xl:px-2 py-1.5 rounded-md transition-all duration-200 whitespace-nowrap flex-shrink-0 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:h-[2px] after:bg-primary after:transition-all after:duration-300 ${
                    location.pathname === item.path
                      ? "text-primary bg-primary/10 after:w-3/4"
                      : "text-foreground hover:text-primary hover:bg-muted/40 after:w-0 hover:after:w-3/4"
                  }`}
                >
                  {item.label}
                </button>
              ))}
              {/* More dropdown */}
              <div ref={moreRef} className="relative">
                <button
                  onClick={() => setMoreOpen(!moreOpen)}
                  className={`flex items-center gap-1 text-[9px] xl:text-[10px] font-semibold uppercase tracking-wide px-1.5 xl:px-2 py-1.5 rounded-md transition-all flex-shrink-0 ${
                    moreNav.some(i => i.path === location.pathname)
                      ? "text-primary bg-primary/10"
                      : "text-foreground hover:text-primary hover:bg-muted/40"
                  }`}
                >
                  More <ChevronDown className={`w-3 h-3 transition-transform ${moreOpen ? "rotate-180" : ""}`} />
                </button>
                {moreOpen && (
                  <div className="absolute top-full right-0 mt-1.5 w-48 rounded-lg border border-border bg-card shadow-xl z-50 py-1 animate-in fade-in slide-in-from-top-2 duration-150">
                    {moreNav.map((item) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.path}
                          onClick={() => { handleNav(item.path); setMoreOpen(false); }}
                          className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-semibold transition-all ${
                            location.pathname === item.path
                              ? "text-primary bg-primary/10"
                              : "text-foreground hover:text-primary hover:bg-muted/40"
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                          {item.label}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </nav>
          </div>

          {/* Right: status + auth — single row on mobile, stacked on desktop */}
          <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2 flex-shrink-0 pl-2">
            {/* LIVE indicator — always visible */}
            <div className="flex items-center gap-1 rounded-md border border-border px-1.5 py-0.5 sm:px-2">
              <div className="h-1.5 w-1.5 rounded-full bg-primary pulse-live" />
              <span className="text-[9px] sm:text-[10px] font-bold text-primary tracking-wide">LIVE</span>
            </div>

            {tier && (
              <span className="hidden sm:inline text-[9px] px-1.5 py-0.5 rounded-md bg-secondary text-secondary-foreground font-bold uppercase tracking-wide">
                {tier}
              </span>
            )}

            <div className="hidden lg:block xl:hidden font-mono text-[9px] text-primary whitespace-nowrap">
              {easternTime.compact}
            </div>
            <div className="hidden xl:block font-mono text-[9px] 2xl:text-[10px] text-primary whitespace-nowrap">
              {easternTime.full}
            </div>

            <AccessibilityToggle />

            {/* Auth button */}
            {user ? (
              <div className="flex items-center gap-1.5">
                <span className="hidden lg:inline text-[10px] text-muted-foreground truncate max-w-[100px]">
                  {user.email}
                </span>
                <button
                  onClick={signOut}
                  className="text-[10px] font-medium text-muted-foreground hover:text-foreground border border-border rounded-md px-2 py-1 transition-colors hover:bg-muted/40 whitespace-nowrap"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowAuth(true)}
                className="text-[10px] sm:text-[11px] font-bold bg-primary text-primary-foreground rounded-md px-2 py-1 sm:px-2.5 hover:opacity-90 transition-opacity shadow-sm whitespace-nowrap"
              >
                Sign In
              </button>
            )}
          </div>
        </div>

        {/* Mobile slide-down menu */}
        {menuOpen && (
          <div className="sm:hidden border-t border-border bg-terminal-header animate-in slide-in-from-top-2 duration-200">
            <nav className="flex flex-col py-2">
              {primaryNav.map((item) => {
                const Icon = item.icon;
                const active = location.pathname === item.path;
                return (
                  <button
                    key={item.path}
                    onClick={() => handleNav(item.path)}
                    className={`flex items-center gap-3.5 px-5 py-4 min-h-[48px] transition-all ${
                      active
                        ? "text-primary bg-primary/10"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="uppercase text-sm font-bold tracking-wide">{item.label}</span>
                    {active && (
                      <div className="ml-auto h-2 w-2 rounded-full bg-primary" />
                    )}
                  </button>
                );
              })}
              <div className="mx-5 my-1 border-t border-border/50" />
              {moreNav.map((item) => {
                const Icon = item.icon;
                const active = location.pathname === item.path;
                return (
                  <button
                    key={item.path}
                    onClick={() => handleNav(item.path)}
                    className={`flex items-center gap-3.5 px-5 py-4 min-h-[48px] transition-all ${
                      active
                        ? "text-primary bg-primary/10"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="uppercase text-sm font-bold tracking-wide">{item.label}</span>
                    {active && (
                      <div className="ml-auto h-2 w-2 rounded-full bg-primary" />
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Mobile-only extras */}
            <div className="border-t border-border px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full bg-primary pulse-live" />
                <span className="text-[10px] font-bold text-primary tracking-wide">LIVE</span>
              </div>
              {tier && (
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-secondary text-secondary-foreground font-bold uppercase tracking-wide">
                  {tier}
                </span>
              )}
              <span className="font-mono text-[10px] text-muted-foreground">
                {time.toLocaleTimeString()}
              </span>
            </div>
          </div>
        )}
      </header>

      {/* Backdrop overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/60 backdrop-blur-sm sm:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </>
  );
};

export default TerminalHeader;
