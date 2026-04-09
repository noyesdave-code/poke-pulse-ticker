import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import TerminalHeader from "@/components/TerminalHeader";
import FinancialDisclaimer from "@/components/FinancialDisclaimer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";
import {
  Shield, TrendingUp, Eye, Zap, Scale, Target, Brain,
  AlertTriangle, CheckCircle, Clock, Play, Loader2,
  Swords, Lock, DollarSign, BarChart3, Plus, X,
  Circle, CheckCircle2, ListTodo, Trash2
} from "lucide-react";
import AuthModal from "@/components/AuthModal";
import AffiliateAnalytics from "@/components/AffiliateAnalytics";
import AISalesAgentWidget from "@/components/AISalesAgentWidget";

interface AuditCategory {
  name: string;
  score: number;
  status: string;
  findings: string[];
  recommendations: string[];
}

interface AuditResult {
  id: string;
  trigger_type: string;
  status: string;
  overall_score: number | null;
  summary: string | null;
  categories: AuditCategory[];
  recommendations: any[];
  competitive_intel: any;
  legal_compliance: any;
  created_at: string;
  completed_at: string | null;
}

interface AuditAction {
  id: string;
  audit_id: string;
  title: string;
  description: string | null;
  category: string | null;
  impact: string;
  effort: string;
  status: string;
  notes: string | null;
  created_at: string;
  completed_at: string | null;
}

const categoryIcons: Record<string, any> = {
  aesthetics: Eye,
  efficiency: Zap,
  information_quality: BarChart3,
  consumer_confidence: Shield,
  reliability: CheckCircle,
  capital_intake: DollarSign,
  market_adaptability: TrendingUp,
  market_predictability: Brain,
  competitive_edge: Swords,
  security: Lock,
  legal_compliance: Scale,
};

const statusColors: Record<string, string> = {
  strong: "bg-terminal-green/20 text-terminal-green border-terminal-green/30",
  adequate: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  needs_improvement: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  critical: "bg-red-500/20 text-red-400 border-red-500/30",
};

const actionStatusConfig: Record<string, { label: string; icon: any; className: string }> = {
  pending: { label: "Pending", icon: Circle, className: "text-muted-foreground" },
  accepted: { label: "Accepted", icon: ListTodo, className: "text-primary" },
  in_progress: { label: "In Progress", icon: Loader2, className: "text-amber-400" },
  completed: { label: "Done", icon: CheckCircle2, className: "text-terminal-green" },
  dismissed: { label: "Dismissed", icon: X, className: "text-muted-foreground/50" },
};

const CommandCenter = () => {
  const { user } = useAuth();
  const [showAuth, setShowAuth] = useState(false);
  const queryClient = useQueryClient();

  const { data: audits, isLoading: loadingAudits } = useQuery({
    queryKey: ["site-audits", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_audits")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10);
      if (error) throw error;
      return data as unknown as AuditResult[];
    },
  });

  const { data: actions } = useQuery({
    queryKey: ["audit-actions", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("audit_actions")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as unknown as AuditAction[];
    },
    enabled: !!user,
  });

  const runAudit = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke("site-audit", {
        body: { trigger_type: "manual" },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["site-audits"] });
      toast({ title: "Audit Complete", description: "AI analysis finished. Review your results below." });
    },
    onError: (err: Error) => {
      toast({ title: "Audit Failed", description: err.message, variant: "destructive" });
    },
  });

  const acceptAction = useMutation({
    mutationFn: async (params: { auditId: string; title: string; description?: string; category?: string; impact?: string; effort?: string }) => {
      if (!user) throw new Error("Not authenticated");
      const { error } = await supabase.from("audit_actions").insert({
        user_id: user.id,
        audit_id: params.auditId,
        title: params.title,
        description: params.description || null,
        category: params.category || null,
        impact: params.impact || "medium",
        effort: params.effort || "medium",
        status: "accepted",
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["audit-actions"] });
      toast({ title: "Action Accepted", description: "Added to your action tracker." });
    },
  });

  const updateActionStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const updates: { status: string; completed_at?: string } = { status };
      if (status === "completed") updates.completed_at = new Date().toISOString();
      const { error } = await supabase.from("audit_actions").update(updates).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["audit-actions"] });
    },
  });

  const deleteAction = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("audit_actions").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["audit-actions"] });
      toast({ title: "Action Removed" });
    },
  });

  const latestAudit = audits?.[0];
  const isRunning = runAudit.isPending || latestAudit?.status === "running";

  // Check if a recommendation is already tracked
  const isTracked = (title: string) => actions?.some((a) => a.title === title && a.status !== "dismissed");

  const activeActions = actions?.filter((a) => a.status !== "dismissed") || [];
  const completedCount = activeActions.filter((a) => a.status === "completed").length;


  return (
    <>
      <TerminalHeader />
      <main className="max-w-7xl mx-auto px-4 lg:px-6 py-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Brain className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="font-mono text-xl font-bold tracking-wider">AI COMMAND CENTER</h1>
              <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
                PGVA Ventures, LLC • Autonomous Site Intelligence
              </p>
            </div>
          </div>
          <Button
            onClick={() => runAudit.mutate()}
            disabled={isRunning}
            className="font-mono gap-2"
          >
            {isRunning ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Running Audit…</>
            ) : (
              <><Play className="h-4 w-4" /> Run Full Audit</>
            )}
          </Button>
        </div>

        {/* Action Tracker Summary */}
        {activeActions.length > 0 && (
          <Card className="border-primary/20">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="font-mono text-xs uppercase tracking-wider flex items-center gap-2">
                  <ListTodo className="h-4 w-4 text-primary" />
                  Action Tracker — {completedCount}/{activeActions.length} Complete
                </CardTitle>
                <Progress value={(completedCount / activeActions.length) * 100} className="h-2 w-32" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {activeActions.map((action) => {
                  const cfg = actionStatusConfig[action.status] || actionStatusConfig.pending;
                  const StatusIcon = cfg.icon;
                  return (
                    <div key={action.id} className="flex items-center justify-between gap-3 p-2.5 rounded-lg bg-muted/30 border border-border/50">
                      <div className="flex items-center gap-2.5 flex-1 min-w-0">
                        <StatusIcon className={`h-4 w-4 shrink-0 ${cfg.className} ${action.status === "in_progress" ? "animate-spin" : ""}`} />
                        <div className="min-w-0 flex-1">
                          <p className={`font-mono text-xs font-semibold truncate ${action.status === "completed" ? "line-through text-muted-foreground" : ""}`}>
                            {action.title}
                          </p>
                          {action.category && (
                            <span className="font-mono text-[9px] text-muted-foreground uppercase">
                              {action.category.replace(/_/g, " ")}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        {action.status === "accepted" && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 px-2 font-mono text-[10px]"
                            onClick={() => updateActionStatus.mutate({ id: action.id, status: "in_progress" })}
                          >
                            Start
                          </Button>
                        )}
                        {action.status === "in_progress" && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 px-2 font-mono text-[10px] text-terminal-green"
                            onClick={() => updateActionStatus.mutate({ id: action.id, status: "completed" })}
                          >
                            Complete
                          </Button>
                        )}
                        {action.status === "completed" && (
                          <Badge className="bg-terminal-green/20 text-terminal-green font-mono text-[9px]">Done</Badge>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                          onClick={() => deleteAction.mutate(action.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Overall Score */}
        {latestAudit?.status === "completed" && latestAudit.overall_score != null && (
          <Card className="border-primary/20">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className={`h-20 w-20 rounded-full border-4 flex items-center justify-center font-mono text-2xl font-bold ${
                      latestAudit.overall_score >= 80 ? "border-terminal-green text-terminal-green" :
                      latestAudit.overall_score >= 60 ? "border-amber-400 text-amber-400" :
                      "border-red-400 text-red-400"
                    }`}>
                      {latestAudit.overall_score}
                    </div>
                  </div>
                  <div>
                    <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest">Overall Score</p>
                    <p className="font-mono text-sm text-foreground mt-1">{latestAudit.summary}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-auto">
                  <Clock className="h-3 w-3 text-muted-foreground" />
                  <span className="font-mono text-[10px] text-muted-foreground">
                    {new Date(latestAudit.completed_at || latestAudit.created_at).toLocaleString()}
                  </span>
                  <Badge variant="outline" className="font-mono text-[10px]">
                    {latestAudit.trigger_type}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {isRunning && !latestAudit?.overall_score && (
          <Card className="border-primary/20">
            <CardContent className="pt-6 flex items-center gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <div>
                <p className="font-mono text-sm font-semibold">AI Agents Analyzing…</p>
                <p className="font-mono text-xs text-muted-foreground">
                  Scanning aesthetics, security, compliance, competitive landscape, and more.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {latestAudit?.status === "completed" && (
          <Tabs defaultValue="categories" className="w-full">
            <TabsList className="grid grid-cols-5 w-full font-mono">
              <TabsTrigger value="categories" className="text-xs">Categories</TabsTrigger>
              <TabsTrigger value="competitive" className="text-xs">Competitive</TabsTrigger>
              <TabsTrigger value="legal" className="text-xs">Legal</TabsTrigger>
              <TabsTrigger value="priorities" className="text-xs">Priorities</TabsTrigger>
              <TabsTrigger value="affiliates" className="text-xs">Affiliates</TabsTrigger>
            </TabsList>

            {/* Categories Tab */}
            <TabsContent value="categories" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(latestAudit.categories as AuditCategory[])?.map((cat) => {
                  const Icon = categoryIcons[cat.name] || Target;
                  return (
                    <Card key={cat.name} className="border-border/50">
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4 text-primary" />
                            <CardTitle className="font-mono text-xs uppercase tracking-wider">
                              {cat.name.replace(/_/g, " ")}
                            </CardTitle>
                          </div>
                          <Badge className={`font-mono text-[10px] ${statusColors[cat.status] || ""}`}>
                            {cat.status?.replace(/_/g, " ")}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center gap-3">
                          <Progress value={cat.score} className="h-2 flex-1" />
                          <span className="font-mono text-sm font-bold">{cat.score}</span>
                        </div>
                        {cat.findings?.length > 0 && (
                          <div>
                            <p className="font-mono text-[10px] text-muted-foreground uppercase mb-1">Findings</p>
                            <ul className="space-y-1">
                              {cat.findings.slice(0, 3).map((f, i) => (
                                <li key={i} className="font-mono text-[11px] text-muted-foreground flex gap-1.5">
                                  <span className="text-primary mt-0.5">•</span>
                                  <span>{f}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {cat.recommendations?.length > 0 && (
                          <div>
                            <p className="font-mono text-[10px] text-terminal-green uppercase mb-1">Recommendations</p>
                            <ul className="space-y-1">
                              {cat.recommendations.slice(0, 2).map((r, i) => (
                                <li key={i} className="font-mono text-[11px] text-foreground/80 flex items-start gap-1.5">
                                  <span className="text-terminal-green mt-0.5 shrink-0">→</span>
                                  <span className="flex-1">{r}</span>
                                  {!isTracked(r) && (
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      className="h-5 w-5 p-0 shrink-0 text-primary hover:text-terminal-green"
                                      onClick={() => acceptAction.mutate({
                                        auditId: latestAudit.id,
                                        title: r,
                                        category: cat.name,
                                      })}
                                      title="Track this recommendation"
                                    >
                                      <Plus className="h-3 w-3" />
                                    </Button>
                                  )}
                                  {isTracked(r) && (
                                    <CheckCircle2 className="h-3.5 w-3.5 text-terminal-green shrink-0 mt-0.5" />
                                  )}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            {/* Competitive Intel Tab */}
            <TabsContent value="competitive" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border-red-500/20">
                  <CardHeader>
                    <CardTitle className="font-mono text-xs uppercase tracking-wider flex items-center gap-2">
                      <Swords className="h-4 w-4 text-red-400" />
                      TCGPlayer Advantages
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {(latestAudit.competitive_intel as any)?.tcgplayer_advantages?.map((item: string, i: number) => (
                        <li key={i} className="font-mono text-[11px] text-muted-foreground flex items-start gap-1.5">
                          <AlertTriangle className="h-3 w-3 text-red-400 mt-0.5 shrink-0" />
                          <span className="flex-1">{item}</span>
                          {!isTracked(`Counter TCGPlayer: ${item}`) && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-5 w-5 p-0 shrink-0 text-primary hover:text-terminal-green"
                              onClick={() => acceptAction.mutate({
                                auditId: latestAudit.id,
                                title: `Counter TCGPlayer: ${item}`,
                                category: "competitive_edge",
                                impact: "high",
                              })}
                              title="Track as action item"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          )}
                          {isTracked(`Counter TCGPlayer: ${item}`) && (
                            <CheckCircle2 className="h-3.5 w-3.5 text-terminal-green shrink-0 mt-0.5" />
                          )}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-amber-500/20">
                  <CardHeader>
                    <CardTitle className="font-mono text-xs uppercase tracking-wider flex items-center gap-2">
                      <Swords className="h-4 w-4 text-amber-400" />
                      RareCandy Advantages
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {(latestAudit.competitive_intel as any)?.rarecandy_advantages?.map((item: string, i: number) => (
                        <li key={i} className="font-mono text-[11px] text-muted-foreground flex items-start gap-1.5">
                          <AlertTriangle className="h-3 w-3 text-amber-400 mt-0.5 shrink-0" />
                          <span className="flex-1">{item}</span>
                          {!isTracked(`Counter RareCandy: ${item}`) && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-5 w-5 p-0 shrink-0 text-primary hover:text-terminal-green"
                              onClick={() => acceptAction.mutate({
                                auditId: latestAudit.id,
                                title: `Counter RareCandy: ${item}`,
                                category: "competitive_edge",
                                impact: "high",
                              })}
                              title="Track as action item"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          )}
                          {isTracked(`Counter RareCandy: ${item}`) && (
                            <CheckCircle2 className="h-3.5 w-3.5 text-terminal-green shrink-0 mt-0.5" />
                          )}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-terminal-green/20">
                  <CardHeader>
                    <CardTitle className="font-mono text-xs uppercase tracking-wider flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-terminal-green" />
                      Our Advantages
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {(latestAudit.competitive_intel as any)?.our_advantages?.map((item: string, i: number) => (
                        <li key={i} className="font-mono text-[11px] text-foreground/80 flex gap-1.5">
                          <CheckCircle className="h-3 w-3 text-terminal-green mt-0.5 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-primary/20">
                  <CardHeader>
                    <CardTitle className="font-mono text-xs uppercase tracking-wider flex items-center gap-2">
                      <Target className="h-4 w-4 text-primary" />
                      Opportunities
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {(latestAudit.competitive_intel as any)?.opportunities?.map((item: string, i: number) => (
                        <li key={i} className="font-mono text-[11px] text-foreground/80 flex items-start gap-1.5">
                          <Target className="h-3 w-3 text-primary mt-0.5 shrink-0" />
                          <span className="flex-1">{item}</span>
                          {!isTracked(item) && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-5 w-5 p-0 shrink-0 text-primary hover:text-terminal-green"
                              onClick={() => acceptAction.mutate({
                                auditId: latestAudit.id,
                                title: item,
                                category: "market_adaptability",
                                impact: "medium",
                              })}
                              title="Track as action item"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          )}
                          {isTracked(item) && (
                            <CheckCircle2 className="h-3.5 w-3.5 text-terminal-green shrink-0 mt-0.5" />
                          )}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Legal Tab */}
            <TabsContent value="legal" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="font-mono text-xs uppercase tracking-wider flex items-center gap-2">
                    <Scale className="h-4 w-4 text-primary" />
                    PGVA Ventures, LLC — Legal Compliance Status
                  </CardTitle>
                  <Badge className={`font-mono text-[10px] w-fit ${
                    (latestAudit.legal_compliance as any)?.status === "compliant"
                      ? "bg-terminal-green/20 text-terminal-green"
                      : (latestAudit.legal_compliance as any)?.status === "needs_review"
                      ? "bg-amber-500/20 text-amber-400"
                      : "bg-red-500/20 text-red-400"
                  }`}>
                    {(latestAudit.legal_compliance as any)?.status?.replace(/_/g, " ") || "Unknown"}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {(latestAudit.legal_compliance as any)?.items?.map((item: any, i: number) => (
                      <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 border border-border/50">
                        <div className="flex items-start gap-3 flex-1">
                          {item.status === "ok" ? (
                            <CheckCircle className="h-4 w-4 text-terminal-green mt-0.5 shrink-0" />
                          ) : item.status === "warning" ? (
                            <AlertTriangle className="h-4 w-4 text-amber-400 mt-0.5 shrink-0" />
                          ) : (
                            <AlertTriangle className="h-4 w-4 text-red-400 mt-0.5 shrink-0" />
                          )}
                          <div className="flex-1">
                            <p className="font-mono text-xs font-semibold">{item.area}</p>
                            <p className="font-mono text-[11px] text-muted-foreground mt-0.5">{item.detail}</p>
                          </div>
                        </div>
                        {item.status !== "ok" && !isTracked(`Legal: ${item.area}`) && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 px-2 shrink-0 font-mono text-[10px] text-primary hover:text-terminal-green"
                            onClick={() => acceptAction.mutate({
                              auditId: latestAudit.id,
                              title: `Legal: ${item.area}`,
                              description: item.detail,
                              category: "legal_compliance",
                              impact: item.status === "action_required" ? "high" : "medium",
                            })}
                          >
                            <Plus className="h-3 w-3 mr-1" /> Track
                          </Button>
                        )}
                        {item.status !== "ok" && isTracked(`Legal: ${item.area}`) && (
                          <Badge className="bg-terminal-green/20 text-terminal-green font-mono text-[9px] shrink-0">
                            Tracked
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Priorities Tab */}
            <TabsContent value="priorities" className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
                  Click + to track any recommendation as an action item
                </p>
              </div>
              <div className="space-y-3">
                {(latestAudit.recommendations as any[])?.map((p: any, i: number) => {
                  const tracked = isTracked(p.title);
                  return (
                    <Card key={i} className="border-border/50">
                      <CardContent className="pt-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-mono text-xs font-bold text-primary">#{i + 1}</span>
                              <h3 className="font-mono text-sm font-semibold">{p.title}</h3>
                              {tracked && (
                                <CheckCircle2 className="h-3.5 w-3.5 text-terminal-green shrink-0" />
                              )}
                            </div>
                            <p className="font-mono text-[11px] text-muted-foreground">{p.description}</p>
                          </div>
                          <div className="flex flex-col gap-1 shrink-0 items-end">
                            <div className="flex gap-1">
                              <Badge variant="outline" className="font-mono text-[10px]">
                                {p.category?.replace(/_/g, " ")}
                              </Badge>
                              {!tracked && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-6 px-2 font-mono text-[10px] text-primary border-primary/30 hover:bg-primary/10"
                                  onClick={() => acceptAction.mutate({
                                    auditId: latestAudit.id,
                                    title: p.title,
                                    description: p.description,
                                    category: p.category,
                                    impact: p.impact,
                                    effort: p.effort,
                                  })}
                                >
                                  <Plus className="h-3 w-3 mr-1" /> Track
                                </Button>
                              )}
                            </div>
                            <div className="flex gap-1">
                              <Badge className={`font-mono text-[9px] ${
                                p.impact === "high" ? "bg-red-500/20 text-red-400" :
                                p.impact === "medium" ? "bg-amber-500/20 text-amber-400" :
                                "bg-blue-500/20 text-blue-400"
                              }`}>
                                Impact: {p.impact}
                              </Badge>
                              <Badge className={`font-mono text-[9px] ${
                                p.effort === "low" ? "bg-terminal-green/20 text-terminal-green" :
                                p.effort === "medium" ? "bg-amber-500/20 text-amber-400" :
                                "bg-red-500/20 text-red-400"
                              }`}>
                                Effort: {p.effort}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            {/* Affiliates Tab */}
            <TabsContent value="affiliates" className="space-y-4">
              <AffiliateAnalytics />
            </TabsContent>
          </Tabs>
        )}

        {/* Audit History */}
        {audits && audits.length > 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="font-mono text-xs uppercase tracking-wider">Audit History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {audits.slice(1).map((a) => (
                  <div key={a.id} className="flex items-center justify-between p-2 rounded bg-muted/30 border border-border/50">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="font-mono text-[10px]">{a.trigger_type}</Badge>
                      <span className="font-mono text-xs text-muted-foreground">
                        {new Date(a.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {a.overall_score != null && (
                        <span className={`font-mono text-sm font-bold ${
                          a.overall_score >= 80 ? "text-terminal-green" :
                          a.overall_score >= 60 ? "text-amber-400" : "text-red-400"
                        }`}>
                          {a.overall_score}
                        </span>
                      )}
                      <Badge className={`font-mono text-[10px] ${
                        a.status === "completed" ? "bg-terminal-green/20 text-terminal-green" :
                        a.status === "failed" ? "bg-red-500/20 text-red-400" :
                        "bg-amber-500/20 text-amber-400"
                      }`}>
                        {a.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {!loadingAudits && (!audits || audits.length === 0) && (
          <Card className="border-dashed border-2">
            <CardContent className="pt-6 text-center space-y-3">
              <Brain className="h-12 w-12 text-muted-foreground mx-auto" />
              <p className="font-mono text-sm text-muted-foreground">No audits yet. Click "Run Full Audit" to start.</p>
              <p className="font-mono text-[10px] text-muted-foreground">
                AI agents will analyze your site across 11 categories including security, legal compliance, and competitive positioning.
              </p>
            </CardContent>
          </Card>
        )}
        <FinancialDisclaimer compact />
      </main>
    </>
  );
};

export default CommandCenter;
