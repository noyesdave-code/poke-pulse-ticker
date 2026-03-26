import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import AuthModal from "@/components/AuthModal";

const TerminalHeader = () => {
  const [time, setTime] = useState(new Date());
  const [showAuth, setShowAuth] = useState(false);
  const { user, signOut, tier } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border bg-terminal-header/95 backdrop-blur-sm">
        <div className="flex items-center justify-between px-4 py-3 lg:px-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded bg-primary flex items-center justify-center">
                <span className="font-mono text-sm font-bold text-primary-foreground">PG</span>
              </div>
              <div>
                <h1 className="font-mono text-sm font-bold tracking-wider text-foreground">
                  POKÉGARAGEVA
                </h1>
                <p className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
                  Market Terminal
                </p>
              </div>
            </div>
            </div>
            <nav className="hidden sm:flex items-center gap-1 ml-4">
              <button
                onClick={() => navigate("/")}
                className={`font-mono text-[10px] uppercase tracking-widest px-2 py-1 rounded transition-colors ${location.pathname === "/" ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
              >
                Terminal
              </button>
              <button
                onClick={() => navigate("/sets")}
                className={`font-mono text-[10px] uppercase tracking-widest px-2 py-1 rounded transition-colors ${location.pathname === "/sets" ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
              >
                Sets
              </button>
              <button
                onClick={() => navigate("/portfolio")}
                className={`font-mono text-[10px] uppercase tracking-widest px-2 py-1 rounded transition-colors ${location.pathname === "/portfolio" ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
              >
                Portfolio
              </button>
            </nav>

          <div className="flex items-center gap-3">
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
                <span className="hidden sm:inline font-mono text-xs text-muted-foreground truncate max-w-[120px]">{user.email}</span>
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
      </header>
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </>
  );
};

export default TerminalHeader;
