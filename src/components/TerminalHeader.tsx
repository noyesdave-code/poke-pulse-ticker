import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import AuthModal from "@/components/AuthModal";
import { Menu, X, LayoutDashboard, Layers, Briefcase, Activity, BookOpen, Brain, CalendarDays, Eye, Mail, Bell, CheckCircle, User, Newspaper, ArrowLeftRight, DollarSign } from "lucide-react";
import AccessibilityToggle from "@/components/AccessibilityToggle";

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
      <header className="sticky top-0 z-50 border-b border-border bg-terminal-header/95 backdrop-blur-md shadow-[0_4px_24px_-4px_hsl(225_40%_4%/0.7),0_0_20px_hsl(160_84%_50%/0.04)]">
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
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => handleNav("/")}
            >
              <div className="relative flex items-center justify-center" style={{ height: '40px', width: '32px' }}>
                <span className="font-black text-[40px] leading-none text-foreground select-none transition-all duration-300 group-hover:scale-110 group-hover:brightness-150" style={{ textShadow: '0 0 8px hsl(210 20% 98% / 0.7), 0 0 20px hsl(210 20% 98% / 0.4), 0 0 40px hsl(210 20% 98% / 0.2)' }}>P</span>
              </div>
              <div className="hidden min-[400px]:block">
                <h1 className="text-[13px] font-extrabold tracking-tight leading-none text-primary">
                  Poke Pulse
                </h1>
                <p className="text-[9px] font-semibold tracking-[0.15em] text-secondary uppercase mt-0.5">
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
                      : "text-foreground/80 hover:text-foreground hover:bg-muted/40"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Right: status + auth */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <AccessibilityToggle />
            <div className="hidden sm:flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1">
              <div className="h-2 w-2 rounded-full bg-primary pulse-live" />
              <span className="text-[11px] font-bold text-primary tracking-wide">LIVE</span>
            </div>
            {tier && (
              <span className="hidden sm:inline text-[10px] px-2 py-0.5 rounded-md bg-secondary text-secondary-foreground font-bold uppercase tracking-wide">
                {tier}
              </span>
            )}
            <div className="hidden md:block font-mono text-xs text-foreground">
              {time.toLocaleString()}
            </div>
            {user ? (
              <div className="flex items-center gap-2">
                <span className="hidden sm:inline text-xs text-muted-foreground truncate max-w-[120px]">
                  {user.email}
                </span>
                <button
                  onClick={signOut}
                  className="text-xs font-medium text-muted-foreground hover:text-foreground border border-border rounded-md px-2.5 py-1 transition-colors hover:bg-muted/40"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowAuth(true)}
                className="text-xs font-bold bg-primary text-primary-foreground rounded-md px-3.5 py-1.5 hover:opacity-90 transition-opacity shadow-sm"
              >
                Sign In
              </button>
            )}
          </div>
        </div>

        {/* Mobile slide-down menu */}
        {menuOpen && (
          <div className="sm:hidden border-t border-border bg-terminal-header animate-in slide-in-from-top-2 duration-200">
            <nav className="flex flex-col py-1.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = location.pathname === item.path;
                return (
                  <button
                    key={item.path}
                    onClick={() => handleNav(item.path)}
                    className={`flex items-center gap-3 px-4 py-3 transition-all ${
                      active
                        ? "text-primary bg-primary/10"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="uppercase text-xs font-bold tracking-wide">{item.label}</span>
                    {active && (
                      <div className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />
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
