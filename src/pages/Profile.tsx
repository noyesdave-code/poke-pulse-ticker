import { useState } from "react";
import FinancialDisclaimer from "@/components/FinancialDisclaimer";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile, useUpdateProfile } from "@/hooks/useProfile";
import { usePortfolio } from "@/hooks/usePortfolio";
import TerminalHeader from "@/components/TerminalHeader";
import SubscriptionStatus from "@/components/SubscriptionStatus";
import TickerBar from "@/components/TickerBar";
import PushNotificationToggle from "@/components/PushNotificationToggle";
import AuthModal from "@/components/AuthModal";
import { ArrowLeft, User, Globe, Lock, Loader2, Save } from "lucide-react";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showAuth, setShowAuth] = useState(false);
  const { data: profile, isLoading } = useProfile();
  const { data: portfolio } = usePortfolio();
  const updateProfile = useUpdateProfile();

  const [displayName, setDisplayName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // Initialize form from profile
  if (profile && !initialized) {
    setDisplayName(profile.display_name || "");
    setAvatarUrl(profile.avatar_url || "");
    setIsPublic(profile.is_public);
    setInitialized(true);
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <TerminalHeader />
        <TickerBar />
        <main className="max-w-7xl mx-auto px-4 py-12 text-center space-y-4">
          <h1 className="font-mono text-lg font-bold text-foreground">Your Profile</h1>
          <p className="font-mono text-sm text-muted-foreground">Sign in to manage your profile.</p>
          <button onClick={() => setShowAuth(true)} className="font-mono text-sm font-semibold bg-primary text-primary-foreground rounded px-6 py-2.5 hover:opacity-90">Sign In</button>
          {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
        </main>
      </div>
    );
  }

  const totalCards = portfolio?.reduce((s, c) => s + c.quantity, 0) ?? 0;

  const handleSave = () => {
    updateProfile.mutate({
      display_name: displayName || null,
      avatar_url: avatarUrl || null,
      is_public: isPublic,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <TerminalHeader />
      <TickerBar />
      <main className="max-w-3xl mx-auto px-4 lg:px-6 py-6 space-y-6">
        <button onClick={() => navigate("/")} className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Terminal
        </button>

        <div className="terminal-card p-4">
          <h1 className="font-mono text-lg font-bold text-foreground flex items-center gap-2">
            <User className="w-5 h-5 text-primary" /> Your Profile
          </h1>
          <p className="font-mono text-[10px] text-muted-foreground mt-0.5">
            Manage your public profile and portfolio visibility
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12 gap-2">
            <Loader2 className="w-5 h-5 text-primary animate-spin" />
            <span className="font-mono text-xs text-muted-foreground">Loading profile…</span>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Avatar preview */}
            <div className="terminal-card p-6 flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-muted border-2 border-border flex items-center justify-center overflow-hidden">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-8 h-8 text-muted-foreground" />
                )}
              </div>
              <div>
                <p className="font-mono text-sm font-bold text-foreground">{displayName || "Anonymous Trainer"}</p>
                <p className="font-mono text-[10px] text-muted-foreground">{user.email}</p>
                <p className="font-mono text-[10px] text-muted-foreground">{totalCards} cards in portfolio</p>
              </div>
            </div>

            {/* Form */}
            <div className="terminal-card p-4 space-y-4">
              <div>
                <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Display Name</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Your trainer name"
                  className="w-full mt-1 rounded border border-border bg-muted px-3 py-2 font-mono text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Avatar URL</label>
                <input
                  type="url"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="https://example.com/avatar.jpg"
                  className="w-full mt-1 rounded border border-border bg-muted px-3 py-2 font-mono text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-mono text-xs text-foreground font-medium">Public Profile</p>
                  <p className="font-mono text-[10px] text-muted-foreground">Allow others to view your portfolio</p>
                </div>
                <button
                  onClick={() => setIsPublic(!isPublic)}
                  className={`flex items-center gap-1.5 font-mono text-xs font-semibold rounded px-3 py-1.5 transition-colors ${
                    isPublic
                      ? "bg-terminal-green/20 text-terminal-green border border-terminal-green/30"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {isPublic ? <Globe className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                  {isPublic ? "Public" : "Private"}
                </button>
              </div>

              <button
                onClick={handleSave}
                disabled={updateProfile.isPending}
                className="w-full flex items-center justify-center gap-2 font-mono text-xs font-semibold bg-primary text-primary-foreground rounded py-2.5 hover:opacity-90 disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5" />
                {updateProfile.isPending ? "Saving…" : "Save Profile"}
              </button>
            </div>

            {/* Public link */}
            {isPublic && (
              <div className="terminal-card p-3">
                <p className="font-mono text-[10px] text-muted-foreground">Your public profile link:</p>
                <p className="font-mono text-xs text-primary mt-1 break-all">
                  {window.location.origin}/profile/{user.id}
                </p>
              </div>
            )}

            {/* Subscription Status */}
            <SubscriptionStatus />

            {/* Push notifications */}
            <PushNotificationToggle />
          </div>
        )}
      </main>
    </div>
  );
};

export default ProfilePage;
