import { Link } from "react-router-dom";
import { usePublishedPosts } from "@/hooks/useBlog";
import TerminalHeader from "@/components/TerminalHeader";
import TickerBar from "@/components/TickerBar";
import FinancialDisclaimer from "@/components/FinancialDisclaimer";
import { CalendarDays, ArrowRight, Loader2 } from "lucide-react";

const Blog = () => {
  const { data: posts, isLoading } = usePublishedPosts();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <TerminalHeader />
      <TickerBar />

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        <div>
          <h1 className="font-mono text-2xl font-bold text-foreground tracking-tight">
            Market Analysis & News
          </h1>
          <p className="font-mono text-sm text-muted-foreground mt-1">
            Insights, trends, and analysis for Poké TCG collectors
          </p>
        </div>

        {isLoading && (
          <div className="flex justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        )}

        {!isLoading && (!posts || posts.length === 0) && (
          <div className="terminal-card p-8 text-center">
            <p className="font-mono text-sm text-muted-foreground">
              No articles published yet. Check back soon!
            </p>
          </div>
        )}

        <div className="space-y-4">
          {posts?.map((post) => (
            <Link
              key={post.id}
              to={`/blog/${post.slug}`}
              className="terminal-card block p-5 hover:border-primary/40 transition-colors group"
            >
              <div className="flex items-start gap-4">
                {post.cover_image && (
                  <img
                    src={post.cover_image}
                    alt={post.title}
                    className="w-24 h-24 rounded object-cover flex-shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <h2 className="font-mono text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p className="font-mono text-xs text-muted-foreground mt-1.5 line-clamp-2">
                      {post.excerpt}
                    </p>
                  )}
                  <div className="flex items-center gap-3 mt-3">
                    <span className="font-mono text-[10px] text-muted-foreground flex items-center gap-1">
                      <CalendarDays className="w-3 h-3" />
                      {new Date(post.created_at).toLocaleDateString()}
                    </span>
                    <span className="font-mono text-[10px] text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
                      Read more <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>

      <FinancialDisclaimer />
    </div>
  );
};

export default Blog;
