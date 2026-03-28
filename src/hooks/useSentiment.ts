import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

export interface SentimentVote {
  id: string;
  user_id: string;
  card_api_id: string;
  direction: string;
  rating: number;
  created_at: string;
  updated_at: string;
}

export interface SentimentSummary {
  totalVotes: number;
  avgRating: number;
  bullPct: number;
  bearPct: number;
}

export function useCardSentiment(cardApiId: string | undefined) {
  return useQuery({
    queryKey: ["sentiment", cardApiId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sentiment_votes")
        .select("*")
        .eq("card_api_id", cardApiId!);
      if (error) throw error;
      const votes = data as SentimentVote[];
      if (votes.length === 0) return { votes: [], summary: null };

      const bulls = votes.filter((v) => v.direction === "bull").length;
      const summary: SentimentSummary = {
        totalVotes: votes.length,
        avgRating: votes.reduce((s, v) => s + v.rating, 0) / votes.length,
        bullPct: Math.round((bulls / votes.length) * 100),
        bearPct: Math.round(((votes.length - bulls) / votes.length) * 100),
      };
      return { votes, summary };
    },
    enabled: !!cardApiId,
  });
}

export function useMyVote(cardApiId: string | undefined) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["my-vote", cardApiId, user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sentiment_votes")
        .select("*")
        .eq("card_api_id", cardApiId!)
        .eq("user_id", user!.id)
        .maybeSingle();
      if (error) throw error;
      return data as SentimentVote | null;
    },
    enabled: !!cardApiId && !!user,
  });
}

export function useSubmitVote() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (vote: { card_api_id: string; direction: string; rating: number }) => {
      if (!user) throw new Error("Not authenticated");
      const { error } = await supabase.from("sentiment_votes").upsert(
        {
          user_id: user.id,
          card_api_id: vote.card_api_id,
          direction: vote.direction,
          rating: vote.rating,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id,card_api_id" }
      );
      if (error) throw error;
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["sentiment", vars.card_api_id] });
      queryClient.invalidateQueries({ queryKey: ["my-vote", vars.card_api_id] });
      toast({ title: "Vote submitted!" });
    },
    onError: (err: Error) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });
}
