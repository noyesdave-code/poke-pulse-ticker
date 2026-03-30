import { useState } from "react";
import FinancialDisclaimer from "@/components/FinancialDisclaimer";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useMyPosts, useCreatePost, useUpdatePost, useDeletePost, type BlogPost } from "@/hooks/useBlog";
import TerminalHeader from "@/components/TerminalHeader";
import TickerBar from "@/components/TickerBar";
import { Plus, Edit2, Trash2, Eye, EyeOff, Loader2, Save } from "lucide-react";
import { toast } from "sonner";

const BlogEditor = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: posts, isLoading } = useMyPosts();
  const createPost = useCreatePost();
  const updatePost = useUpdatePost();
  const deletePost = useDeletePost();

  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [form, setForm] = useState({ title: "", slug: "", excerpt: "", content: "", cover_image: "", published: false });

  if (!user) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <TerminalHeader />
        <TickerBar />
        <div className="max-w-3xl mx-auto px-4 py-16 text-center">
          <p className="font-mono text-sm text-muted-foreground">Sign in to manage blog posts.</p>
        </div>
      </div>
    );
  }

  const startNew = () => {
    setIsNew(true);
    setEditing(null);
    setForm({ title: "", slug: "", excerpt: "", content: "", cover_image: "", published: false });
  };

  const startEdit = (post: BlogPost) => {
    setIsNew(false);
    setEditing(post);
    setForm({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || "",
      content: post.content,
      cover_image: post.cover_image || "",
      published: post.published,
    });
  };

  const handleSave = async () => {
    if (!form.title || !form.content) {
      toast.error("Title and content are required");
      return;
    }
    const slug = form.slug || form.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    try {
      if (isNew) {
        await createPost.mutateAsync({ ...form, slug });
        toast.success("Post created!");
      } else if (editing) {
        await updatePost.mutateAsync({ id: editing.id, ...form, slug });
        toast.success("Post updated!");
      }
      setEditing(null);
      setIsNew(false);
    } catch (e: any) {
      toast.error(e.message || "Failed to save");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this post?")) return;
    await deletePost.mutateAsync(id);
    toast.success("Post deleted");
  };

  const showForm = isNew || editing;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <TerminalHeader />
      <TickerBar />

      <main className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="font-mono text-lg font-bold">Blog Manager</h1>
          {!showForm && (
            <button onClick={startNew} className="flex items-center gap-1.5 font-mono text-xs bg-primary text-primary-foreground px-3 py-2 rounded hover:opacity-90">
              <Plus className="w-3.5 h-3.5" /> New Post
            </button>
          )}
        </div>

        {showForm && (
          <div className="terminal-card p-5 space-y-4">
            <input
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="Post title"
              className="w-full bg-muted rounded px-3 py-2 font-mono text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 ring-primary"
            />
            <input
              value={form.slug}
              onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
              placeholder="URL slug (auto-generated from title if empty)"
              className="w-full bg-muted rounded px-3 py-2 font-mono text-xs text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 ring-primary"
            />
            <input
              value={form.excerpt}
              onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
              placeholder="Short excerpt / summary"
              className="w-full bg-muted rounded px-3 py-2 font-mono text-xs text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 ring-primary"
            />
            <input
              value={form.cover_image}
              onChange={(e) => setForm((f) => ({ ...f, cover_image: e.target.value }))}
              placeholder="Cover image URL (optional)"
              className="w-full bg-muted rounded px-3 py-2 font-mono text-xs text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 ring-primary"
            />
            <textarea
              value={form.content}
              onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
              placeholder="Write your article content here..."
              rows={12}
              className="w-full bg-muted rounded px-3 py-2 font-mono text-xs text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 ring-primary resize-y"
            />
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.published}
                  onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked }))}
                  className="rounded"
                />
                <span className="font-mono text-xs text-foreground">Published</span>
              </label>
              <div className="flex gap-2">
                <button onClick={() => { setEditing(null); setIsNew(false); }} className="font-mono text-xs text-muted-foreground hover:text-foreground px-3 py-2">
                  Cancel
                </button>
                <button onClick={handleSave} disabled={createPost.isPending || updatePost.isPending} className="flex items-center gap-1.5 font-mono text-xs bg-primary text-primary-foreground px-3 py-2 rounded hover:opacity-90 disabled:opacity-50">
                  <Save className="w-3.5 h-3.5" /> Save
                </button>
              </div>
            </div>
          </div>
        )}

        {isLoading && (
          <div className="flex justify-center py-8">
            <Loader2 className="w-5 h-5 animate-spin text-primary" />
          </div>
        )}

        {!showForm && posts?.map((post) => (
          <div key={post.id} className="terminal-card p-4 flex items-center justify-between">
            <div className="min-w-0">
              <p className="font-mono text-sm font-semibold text-foreground truncate">{post.title}</p>
              <p className="font-mono text-[10px] text-muted-foreground mt-0.5">
                {post.published ? "Published" : "Draft"} • {new Date(post.created_at).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <button onClick={() => updatePost.mutate({ id: post.id, published: !post.published })} className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors" title={post.published ? "Unpublish" : "Publish"}>
                {post.published ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
              <button onClick={() => startEdit(post)} className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => handleDelete(post.id)} className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-terminal-red transition-colors">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
        <FinancialDisclaimer compact />
      </main>
    </div>
  );
};

export default BlogEditor;
