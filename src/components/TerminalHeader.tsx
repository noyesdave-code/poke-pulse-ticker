import { useState, useEffect } from "react";

const TerminalHeader = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
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

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 rounded border border-border px-2 py-1">
            <div className="h-2 w-2 rounded-full bg-primary pulse-live" />
            <span className="font-mono text-xs font-semibold text-primary">LIVE</span>
          </div>
          <div className="hidden md:block font-mono text-xs text-muted-foreground">
            Refresh: 60s
          </div>
          <div className="font-mono text-xs text-muted-foreground">
            {time.toLocaleString()}
          </div>
        </div>
      </div>
    </header>
  );
};

export default TerminalHeader;
