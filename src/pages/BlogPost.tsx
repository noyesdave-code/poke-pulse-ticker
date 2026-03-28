import { useParams, useNavigate } from "react-router-dom";
import { usePostBySlug } from "@/hooks/useBlog";
import TerminalHeader from "@/components/TerminalHeader";
import TickerBar from "@/components/TickerBar";
import FinancialDisclaimer from "@/components/FinancialDisclaimer";
import { ArrowLeft, CalendarDays, Loader2 } from "lucide-react";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { data: post, isLoading, error } = usePostBySlug(slug || "");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <TerminalHeader />
      <TickerBar />

      <main className="max-w-3xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate("/blog")}
          className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to articles
        </button>

        {isLoading && (
          <div className="flex justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        )}

        {error && (
          <div className="terminal-card p-8 text-center">
            <p className="font-mono text-sm text-muted-foreground">Article not found.</p>
          </div>
        )}

        {post && (
          <article className="space-y-6">
            {post.cover_image && (
              <img
                src={post.cover_image}
                alt={post.title}
                className="w-full h-48 md:h-64 object-cover rounded-lg"
              />
            )}
            <div>
              <h1 className="font-mono text-xl md:text-2xl font-bold text-foreground">
                {post.title}
              </h1>
              <div className="flex items-center gap-2 mt-2">
                <CalendarDays className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="font-mono text-xs text-muted-foreground">
                  {new Date(post.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>

            <div className="prose prose-invert prose-sm max-w-none font-mono">
              {post.content.split("\n").map((paragraph, i) =>
                paragraph.trim() ? (
                  <p key={i} className="text-sm text-foreground/90 leading-relaxed mb-4">
                    {paragraph}
                  </p>
                ) : null
              )}
            </div>
          </article>
        )}
      </main>

      <FinancialDisclaimer />
    </div>
  );
};

export default BlogPost;
