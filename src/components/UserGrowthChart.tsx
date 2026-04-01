import { useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Users, TrendingUp } from "lucide-react";
import { SkeletonChart } from "@/components/SkeletonCard";

const UserGrowthChart = () => {
  const { data: profiles, isLoading } = useQuery({
    queryKey: ["user-growth"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("created_at")
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data || [];
    },
    staleTime: 5 * 60 * 1000,
  });

  const chartData = useMemo(() => {
    if (!profiles || profiles.length === 0) return [];

    const grouped: Record<string, number> = {};
    profiles.forEach((p) => {
      const date = new Date(p.created_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      grouped[date] = (grouped[date] || 0) + 1;
    });

    let cumulative = 0;
    return Object.entries(grouped).map(([date, count]) => {
      cumulative += count;
      return { date, new: count, total: cumulative };
    });
  }, [profiles]);

  const totalUsers = profiles?.length || 0;
  const recentGrowth = chartData.length >= 2
    ? chartData[chartData.length - 1].total - chartData[chartData.length - 2].total
    : 0;

  if (isLoading) return <SkeletonChart />;

  return (
    <div className="terminal-card overflow-hidden">
      <div className="border-b border-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-primary" />
          <div>
            <h2 className="font-mono text-xs tracking-widest text-secondary uppercase font-semibold">
              Community Growth
            </h2>
            <p className="font-mono text-[10px] text-muted-foreground mt-0.5">
              {totalUsers.toLocaleString()} total members
            </p>
          </div>
        </div>
        {recentGrowth > 0 && (
          <div className="flex items-center gap-1 text-primary font-mono text-xs">
            <TrendingUp className="h-3 w-3" />
            +{recentGrowth} latest
          </div>
        )}
      </div>
      <div className="p-4" style={{ height: 200 }}>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="growthGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 16%)" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 9, fill: "hsl(215, 15%, 55%)", fontFamily: "JetBrains Mono" }}
                tickLine={false}
                axisLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                tick={{ fontSize: 9, fill: "hsl(215, 15%, 55%)", fontFamily: "JetBrains Mono" }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(220, 20%, 8%)",
                  border: "1px solid hsl(220, 15%, 16%)",
                  borderRadius: "4px",
                  fontFamily: "JetBrains Mono",
                  fontSize: 11,
                }}
                formatter={(value: number, name: string) => [
                  value,
                  name === "total" ? "Total Users" : "New Users",
                ]}
              />
              <Area
                type="monotone"
                dataKey="total"
                stroke="hsl(160, 84%, 39%)"
                strokeWidth={2}
                fill="url(#growthGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground font-mono text-xs">
            Growth data will appear as users join
          </div>
        )}
      </div>
    </div>
  );
};

export default UserGrowthChart;
