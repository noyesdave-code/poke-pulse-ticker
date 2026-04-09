import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Bot, Users, Mail, TrendingUp, Target, Zap, RefreshCw } from "lucide-react";

const OWNER_ID = "noyes.dave@gmail.com";

interface PipelineStats {
  pipeline: Record<string, number>;
  total_leads: number;
  weekly_metrics: Array<{
    metric_date: string;
    leads_generated: number;
    emails_sent: number;
    conversions: number;
  }>;
  recent_outreach: Array<{
    subject: string;
    status: string;
    created_at: string;
  }>;
  daily_target: number;
  conversion_rate: string;
}

const AISalesAgentWidget = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<PipelineStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const isOwner = user?.email === OWNER_ID;

  const fetchStats = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("ai-sales-agent", {
        body: { action: "pipeline_stats" },
      });
      if (!error && data) setStats(data);
    } catch {
      /* silent */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOwner) fetchStats();
  }, [isOwner, fetchStats]);

  const runAction = async (action: string) => {
    setActionLoading(action);
    try {
      await supabase.functions.invoke("ai-sales-agent", { body: { action } });
      await fetchStats();
    } catch {
      /* silent */
    } finally {
      setActionLoading(null);
    }
  };

  if (!isOwner) return null;

  const todayMetrics = stats?.weekly_metrics?.[0];
  const pipelineTotal = stats?.total_leads || 0;
  const converted = stats?.pipeline?.converted || 0;

  return (
    <div className="terminal-card p-3 sm:p-4 border-primary/30">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Bot className="w-4 h-4 text-primary animate-pulse" />
          <h3 className="font-mono text-xs font-bold text-foreground">
            AI SALES AGENT — LIVE
          </h3>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          <span className="font-mono text-[9px] text-green-400">ACTIVE</span>
        </div>
      </div>

      {/* Pipeline Funnel */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 mb-3">
        {[
          { label: "New", count: stats?.pipeline?.new || 0, color: "text-blue-400" },
          { label: "Contacted", count: stats?.pipeline?.contacted || 0, color: "text-cyan-400" },
          { label: "Engaged", count: stats?.pipeline?.engaged || 0, color: "text-yellow-400" },
          { label: "Demo", count: stats?.pipeline?.demo_scheduled || 0, color: "text-orange-400" },
          { label: "Converted", count: converted, color: "text-green-400" },
          { label: "Lost", count: stats?.pipeline?.lost || 0, color: "text-red-400" },
        ].map((s) => (
          <div key={s.label} className="terminal-card p-1.5 text-center">
            <p className={`font-mono text-sm font-bold ${s.color}`}>{s.count}</p>
            <p className="font-mono text-[8px] text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 mb-3">
        <div className="terminal-card p-2 flex items-center gap-1.5">
          <Users className="w-3 h-3 text-primary" />
          <div>
            <p className="font-mono text-xs font-bold text-foreground">{pipelineTotal}</p>
            <p className="font-mono text-[8px] text-muted-foreground">Total Leads</p>
          </div>
        </div>
        <div className="terminal-card p-2 flex items-center gap-1.5">
          <Mail className="w-3 h-3 text-primary" />
          <div>
            <p className="font-mono text-xs font-bold text-foreground">{todayMetrics?.emails_sent || 0}</p>
            <p className="font-mono text-[8px] text-muted-foreground">Sent Today</p>
          </div>
        </div>
        <div className="terminal-card p-2 flex items-center gap-1.5">
          <Target className="w-3 h-3 text-green-400" />
          <div>
            <p className="font-mono text-xs font-bold text-green-400">{converted}/2</p>
            <p className="font-mono text-[8px] text-muted-foreground">Daily Goal</p>
          </div>
        </div>
        <div className="terminal-card p-2 flex items-center gap-1.5">
          <TrendingUp className="w-3 h-3 text-primary" />
          <div>
            <p className="font-mono text-xs font-bold text-foreground">{stats?.conversion_rate || 0}%</p>
            <p className="font-mono text-[8px] text-muted-foreground">Conv Rate</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-1.5">
        <button
          onClick={() => runAction("generate_leads")}
          disabled={!!actionLoading}
          className="flex items-center gap-1 px-2.5 py-1 rounded bg-primary text-primary-foreground font-mono text-[10px] font-semibold hover:opacity-90 disabled:opacity-50"
        >
          {actionLoading === "generate_leads" ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Zap className="w-3 h-3" />}
          Generate Leads
        </button>
        <button
          onClick={() => runAction("outreach")}
          disabled={!!actionLoading}
          className="flex items-center gap-1 px-2.5 py-1 rounded bg-green-600 text-white font-mono text-[10px] font-semibold hover:opacity-90 disabled:opacity-50"
        >
          {actionLoading === "outreach" ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Mail className="w-3 h-3" />}
          Run Outreach
        </button>
        <button
          onClick={fetchStats}
          disabled={loading}
          className="flex items-center gap-1 px-2.5 py-1 rounded bg-muted text-foreground font-mono text-[10px] hover:opacity-90 disabled:opacity-50"
        >
          <RefreshCw className={`w-3 h-3 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Recent Outreach */}
      {stats?.recent_outreach && stats.recent_outreach.length > 0 && (
        <div className="mt-3 border-t border-border/20 pt-2">
          <p className="font-mono text-[9px] text-muted-foreground mb-1">RECENT OUTREACH</p>
          {stats.recent_outreach.slice(0, 3).map((o, i) => (
            <div key={i} className="flex items-center justify-between py-0.5">
              <p className="font-mono text-[9px] text-foreground truncate max-w-[200px]">{o.subject || "Untitled"}</p>
              <span className={`font-mono text-[8px] px-1.5 py-0.5 rounded ${o.status === "generated" ? "bg-blue-500/20 text-blue-400" : "bg-green-500/20 text-green-400"}`}>
                {o.status}
              </span>
            </div>
          ))}
        </div>
      )}

      <p className="font-mono text-[7px] text-muted-foreground/40 mt-2 text-center">
        © PGVA Ventures, LLC · AI Sales Agent™ · Patent Pending · 18 U.S.C. § 1832
      </p>
    </div>
  );
};

export default AISalesAgentWidget;
