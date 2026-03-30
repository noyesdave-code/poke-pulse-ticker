import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";
import { getTierByProductId, type TierKey } from "@/lib/stripe";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  subscribed: boolean;
  tier: TierKey | null;
  subscriptionEnd: string | null;
  trial: boolean;
  trialEndsAt: string | null;
  signOut: () => Promise<void>;
  checkSubscription: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  subscribed: false,
  tier: null,
  subscriptionEnd: null,
  trial: false,
  trialEndsAt: null,
  signOut: async () => {},
  checkSubscription: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [subscribed, setSubscribed] = useState(false);
  const [tier, setTier] = useState<TierKey | null>(null);
  const [subscriptionEnd, setSubscriptionEnd] = useState<string | null>(null);
  const [trial, setTrial] = useState(false);
  const [trialEndsAt, setTrialEndsAt] = useState<string | null>(null);

  const checkSubscription = useCallback(async () => {
    try {
      const { data, error } = await supabase.functions.invoke("check-subscription");
      if (error) throw error;
      setSubscribed(data.subscribed ?? false);
      setTier(data.product_id ? getTierByProductId(data.product_id) : null);
      setSubscriptionEnd(data.subscription_end ?? null);
      setTrial(data.trial ?? false);
      setTrialEndsAt(data.trial_ends_at ?? null);
    } catch {
      setSubscribed(false);
      setTier(null);
      setSubscriptionEnd(null);
      setTrial(false);
      setTrialEndsAt(null);
    }
  }, []);

  useEffect(() => {
    supabase.auth.onAuthStateChange((_, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (user) {
      checkSubscription();
      const interval = setInterval(checkSubscription, 60000);
      return () => clearInterval(interval);
    } else {
      setSubscribed(false);
      setTier(null);
      setSubscriptionEnd(null);
      setTrial(false);
      setTrialEndsAt(null);
    }
  }, [user, checkSubscription]);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, subscribed, tier, subscriptionEnd, trial, trialEndsAt, signOut, checkSubscription }}>
      {children}
    </AuthContext.Provider>
  );
};
