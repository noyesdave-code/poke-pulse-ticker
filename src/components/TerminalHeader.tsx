import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import AuthModal from "@/components/AuthModal";
import { Menu, X, LayoutDashboard, Layers, Briefcase, Activity, BookOpen, Brain, CalendarDays, Eye, Mail, Bell, CheckCircle, User, Newspaper, ArrowLeftRight, DollarSign } from "lucide-react";

const navItems = [
  { path: "/", label: "Terminal", icon: LayoutDashboard },
  { path: "/sets", label: "Sets", icon: Layers },
  { path: "/releases", label: "Releases", icon: CalendarDays },
  { path: "/watchlist", label: "Watchlist", icon: Eye },
  { path: "/alerts", label: "Alerts", icon: Bell },
  { path: "/portfolio", label: "Portfolio", icon: Briefcase },
  { path: "/dashboard", label: "Dashboard", icon: Activity },
  { path: "/set-completion", label: "Collection", icon: CheckCircle },
  { path: "/guides", label: "Guides", icon: BookOpen },
  { path: "/blog", label: "Blog", icon: Newspaper },
  { path: "/trade", label: "Trade", icon: ArrowLeftRight },
  { path: "/pricing", label: "Pricing", icon: DollarSign },
  { path: "/command-center", label: "AI Center", icon: Brain },
  { path: "/profile", label: "Profile", icon: User },
  { path: "/contact", label: "Contact", icon: Mail },
];

const TerminalHeader = () => {
  const [time, setTime] = useState(new Date());
  const [showAuth, setShowAuth] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, signOut, tier } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const handleNav = (path: string) => {
    navigate(path);
    setMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border bg-terminal-header/95 backdrop-blur-md">
        <div className="flex items-center justify-between px-4 py-3.5 lg:px-6">
          {/* Left: logo + hamburger */}
          <div className="flex items-center gap-3">
            {/* Hamburger — mobile only */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="sm:hidden flex items-center justify-center w-9 h-9 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
              aria-label="Toggle menu"
            >
              {menuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>

            <div
              className="flex items-center gap-2.5 cursor-pointer group"
              onClick={() => handleNav("/")}
            >
              <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                <span className="font-bold text-sm text-primary-foreground">PG</span>
              </div>
              <div className="hidden min-[400px]:block">
                <h1 className="text-sm font-extrabold tracking-tight text-foreground">
                  Poke Pulse Ticker
                </h1>
                <p className="text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
                  Market Terminal
                </p>
              </div>
            </div>

            {/* Desktop nav */}
            <nav className="hidden sm:flex items-center gap-0.5 ml-5">
              {navItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => handleNav(item.path)}
                  className={`text-[11px] font-semibold uppercase tracking-wide px-2.5 py-1.5 rounded-md transition-all ${
                    location.pathname === item.path
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Right: status + auth */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden sm:flex items-center gap-2 rounded border border-border px-2 py-1">
              <div className="h-2 w-2 rounded-full bg-primary pulse-live" />
              <span className="font-mono text-xs font-semibold text-primary">LIVE</span>
            </div>
            {tier && (
              <span className="hidden sm:inline font-mono text-[10px] px-2 py-0.5 rounded bg-secondary text-secondary-foreground font-semibold uppercase">
                {tier}
              </span>
            )}
            <div className="hidden md:block font-mono text-xs text-muted-foreground">
              {time.toLocaleString()}
            </div>
            {user ? (
              <div className="flex items-center gap-2">
                <span className="hidden sm:inline font-mono text-xs text-muted-foreground truncate max-w-[120px]">
                  {user.email}
                </span>
                <button
                  onClick={signOut}
                  className="font-mono text-xs text-muted-foreground hover:text-foreground border border-border rounded px-2 py-1"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowAuth(true)}
                className="font-mono text-xs font-semibold bg-primary text-primary-foreground rounded px-3 py-1.5 hover:opacity-90"
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
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = location.pathname === item.path;
                return (
                  <button
                    key={item.path}
                    onClick={() => handleNav(item.path)}
                    className={`flex items-center gap-3 px-4 py-3 font-mono text-sm transition-colors ${
                      active
                        ? "text-primary bg-primary/10"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="tracking-wider uppercase text-xs font-semibold">{item.label}</span>
                    {active && (
                      <div className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Mobile-only extras */}
            <div className="border-t border-border px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-primary pulse-live" />
                <span className="font-mono text-[10px] font-semibold text-primary">LIVE</span>
              </div>
              {tier && (
                <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-secondary text-secondary-foreground font-semibold uppercase">
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
