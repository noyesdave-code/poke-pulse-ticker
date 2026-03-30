import { useParams, useNavigate } from "react-router-dom";
import FinancialDisclaimer from "@/components/FinancialDisclaimer";
import { usePublicProfile } from "@/hooks/useProfile";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { fetchCardById, getBestPrice } from "@/lib/pokemonTcgApi";
import TerminalHeader from "@/components/TerminalHeader";
import TickerBar from "@/components/TickerBar";
import { ArrowLeft, User, Loader2, Lock } from "lucide-react";

const PublicProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { data: profile, isLoading } = usePublicProfile(userId);

  // Fetch public portfolio
  const { data: portfolio } = useQuery({
    queryKey: ["public-portfolio", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("portfolio_cards")
        .select("*")
        .eq("user_id", userId!)
        .order("added_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!profile,
  });

  // Fetch live prices for portfolio
  const { data: livePrices } = useQuery({
    queryKey: ["public-prices", portfolio?.map((c) => c.card_api_id).join(",")],
    queryFn: async () => {
      if (!portfolio) return {};
      const prices: Record<string, number> = {};
      for (let i = 0; i < Math.min(portfolio.length, 20); i += 5) {
        const batch = portfolio.slice(i, i + 5);
        await Promise.allSettled(
          batch.map(async (card) => {
            const apiCard = await fetchCardById(card.card_api_id);
            const p = getBestPrice(apiCard);
            if (p) prices[card.card_api_id] = p.market;
          })
        );
      }
      return prices;
    },
    enabled: !!portfolio && portfolio.length > 0,
    staleTime: 5 * 60 * 1000,
  });

  const totalValue = portfolio?.reduce((s, c) => {
    const p = livePrices?.[c.card_api_id];
    return s + (p ? p * c.quantity : 0);
  }, 0) ?? 0;

  return (
    <div className="min-h-screen bg-background">
      <TerminalHeader />
      <TickerBar />
      <main className="max-w-5xl mx-auto px-4 lg:px-6 py-6 space-y-6">
        <button onClick={() => navigate("/")} className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Terminal
        </button>

        {isLoading ? (
          <div className="flex items-center justify-center py-12 gap-2">
            <Loader2 className="w-5 h-5 text-primary animate-spin" />
            <span className="font-mono text-xs text-muted-foreground">Loading profile…</span>
          </div>
        ) : !profile ? (
          <div className="terminal-card p-8 text-center space-y-3">
            <Lock className="w-10 h-10 text-muted-foreground mx-auto" />
            <p className="font-mono text-sm text-muted-foreground">This profile is private or doesn't exist.</p>
          </div>
        ) : (
          <>
            {/* Profile header */}
            <div className="terminal-card p-6 flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-muted border-2 border-border flex items-center justify-center overflow-hidden">
                {profile.avatar_url ? (
                  <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-8 h-8 text-muted-foreground" />
                )}
              </div>
              <div>
                <h1 className="font-mono text-lg font-bold text-foreground">
                  {profile.display_name || "Anonymous Trainer"}
                </h1>
                <p className="font-mono text-[10px] text-muted-foreground">
                  Member since {new Date(profile.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                </p>
                <div className="flex items-center gap-4 mt-1">
                  <span className="font-mono text-xs text-primary font-semibold">
                    {portfolio?.length ?? 0} unique cards
                  </span>
                  {totalValue > 0 && (
                    <span className="font-mono text-xs text-terminal-green font-semibold">
                      ${totalValue.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Portfolio grid */}
            {portfolio && portfolio.length > 0 ? (
              <div className="terminal-card overflow-hidden">
                <div className="border-b border-border px-4 py-3">
                  <h2 className="font-mono text-xs tracking-widest text-secondary uppercase font-semibold">
                    Portfolio ({portfolio.length})
                  </h2>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 p-3">
                  {portfolio.slice(0, 30).map((card) => {
                    const price = livePrices?.[card.card_api_id];
                    return (
                      <button
                        key={card.id}
                        onClick={() => navigate(`/card/${card.card_api_id}`)}
                        className="terminal-card overflow-hidden text-left hover:border-primary/50 transition-all group"
                      >
                        {card.card_image && (
                          <div className="aspect-[2.5/3.5] bg-muted overflow-hidden">
                            <img src={card.card_image} alt={card.card_name} className="w-full h-full object-contain group-hover:scale-105 transition-transform" loading="lazy" />
                          </div>
                        )}
                        <div className="p-1.5">
                          <p className="font-mono text-[9px] text-foreground truncate">{card.card_name}</p>
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-[8px] text-muted-foreground">×{card.quantity}</span>
                            {price && <span className="font-mono text-[9px] text-terminal-green font-semibold">${price.toFixed(2)}</span>}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="terminal-card p-8 text-center">
                <p className="font-mono text-xs text-muted-foreground">This user hasn't added any cards yet.</p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default PublicProfile;
