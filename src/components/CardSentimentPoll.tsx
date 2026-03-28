import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useCardSentiment, useMyVote, useSubmitVote } from "@/hooks/useSentiment";
import { TrendingUp, TrendingDown, Star } from "lucide-react";

interface Props {
  cardApiId: string;
}

const CardSentimentPoll = ({ cardApiId }: Props) => {
  const { user } = useAuth();
  const { data } = useCardSentiment(cardApiId);
  const { data: myVote } = useMyVote(cardApiId);
  const submitVote = useSubmitVote();

  const [direction, setDirection] = useState<"bull" | "bear">(
    (myVote?.direction as "bull" | "bear") || "bull"
  );
  const [rating, setRating] = useState(myVote?.rating || 3);
  const [hoveredStar, setHoveredStar] = useState(0);

  const summary = data?.summary;

  const handleSubmit = () => {
    submitVote.mutate({ card_api_id: cardApiId, direction, rating });
  };

  return (
    <div className="terminal-card overflow-hidden">
      <div className="border-b border-border px-4 py-3">
        <h2 className="font-mono text-xs tracking-widest text-secondary uppercase font-semibold">
          Community Sentiment
        </h2>
      </div>

      <div className="p-4 space-y-4">
        {/* Summary */}
        {summary && (
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono text-[10px] text-terminal-green flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> Bull {summary.bullPct}%
                </span>
                <span className="font-mono text-[10px] text-terminal-red flex items-center gap-1">
                  Bear {summary.bearPct}% <TrendingDown className="w-3 h-3" />
                </span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden flex">
                <div
                  className="h-full bg-terminal-green transition-all"
                  style={{ width: `${summary.bullPct}%` }}
                />
                <div
                  className="h-full bg-terminal-red transition-all"
                  style={{ width: `${summary.bearPct}%` }}
                />
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`w-3 h-3 ${s <= Math.round(summary.avgRating) ? "text-terminal-amber fill-terminal-amber" : "text-muted-foreground"}`}
                  />
                ))}
              </div>
              <p className="font-mono text-[9px] text-muted-foreground mt-0.5">
                {summary.avgRating.toFixed(1)} avg • {summary.totalVotes} vote{summary.totalVotes !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
        )}

        {!summary && (
          <p className="font-mono text-xs text-muted-foreground text-center py-2">
            No votes yet — be the first!
          </p>
        )}

        {/* Vote form */}
        {user && (
          <div className="border-t border-border pt-3 space-y-3">
            <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
              {myVote ? "Update your vote" : "Cast your vote"}
            </p>

            {/* Direction */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setDirection("bull")}
                className={`flex-1 flex items-center justify-center gap-1.5 font-mono text-xs font-semibold rounded py-2 transition-colors ${
                  direction === "bull"
                    ? "bg-terminal-green/20 text-terminal-green border border-terminal-green/30"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5" /> Bullish
              </button>
              <button
                onClick={() => setDirection("bear")}
                className={`flex-1 flex items-center justify-center gap-1.5 font-mono text-xs font-semibold rounded py-2 transition-colors ${
                  direction === "bear"
                    ? "bg-terminal-red/20 text-terminal-red border border-terminal-red/30"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                <TrendingDown className="w-3.5 h-3.5" /> Bearish
              </button>
            </div>

            {/* Star rating */}
            <div className="flex items-center gap-1">
              <span className="font-mono text-[10px] text-muted-foreground mr-2">Rating:</span>
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  onMouseEnter={() => setHoveredStar(s)}
                  onMouseLeave={() => setHoveredStar(0)}
                  onClick={() => setRating(s)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-5 h-5 ${
                      s <= (hoveredStar || rating)
                        ? "text-terminal-amber fill-terminal-amber"
                        : "text-muted-foreground"
                    }`}
                  />
                </button>
              ))}
              <span className="font-mono text-xs text-foreground ml-1">{rating}/5</span>
            </div>

            <button
              onClick={handleSubmit}
              disabled={submitVote.isPending}
              className="w-full font-mono text-xs font-semibold bg-primary text-primary-foreground rounded py-2 hover:opacity-90 disabled:opacity-50"
            >
              {submitVote.isPending ? "Submitting…" : myVote ? "Update Vote" : "Submit Vote"}
            </button>
          </div>
        )}

        {!user && (
          <p className="font-mono text-[10px] text-muted-foreground text-center border-t border-border pt-3">
            Sign in to vote on this card's sentiment
          </p>
        )}
      </div>
    </div>
  );
};

export default CardSentimentPoll;
