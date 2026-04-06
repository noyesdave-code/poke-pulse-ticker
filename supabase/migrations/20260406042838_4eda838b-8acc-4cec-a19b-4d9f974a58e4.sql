
-- Create unified wallet table
CREATE TABLE public.unified_wallets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  balance INTEGER NOT NULL DEFAULT 5000,
  lifetime_earned INTEGER NOT NULL DEFAULT 5000,
  lifetime_spent INTEGER NOT NULL DEFAULT 0,
  lifetime_wagered INTEGER NOT NULL DEFAULT 0,
  lifetime_won INTEGER NOT NULL DEFAULT 0,
  lifetime_ripped INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.unified_wallets ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own wallet" ON public.unified_wallets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own wallet" ON public.unified_wallets FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own wallet" ON public.unified_wallets FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Leaderboard view" ON public.unified_wallets FOR SELECT TO authenticated USING (true);

-- Ripz episode bets table
CREATE TABLE public.ripz_episode_bets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  episode_id TEXT NOT NULL,
  bet_type TEXT NOT NULL DEFAULT 'pre_show',
  prediction TEXT NOT NULL,
  wager INTEGER NOT NULL DEFAULT 100,
  odds NUMERIC NOT NULL DEFAULT 2.0,
  pack_index INTEGER,
  status TEXT NOT NULL DEFAULT 'active',
  payout INTEGER,
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.ripz_episode_bets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own bets" ON public.ripz_episode_bets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can place bets" ON public.ripz_episode_bets FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own bets" ON public.ripz_episode_bets FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Migrate existing balances into unified_wallets
INSERT INTO public.unified_wallets (user_id, balance, lifetime_earned, lifetime_spent, lifetime_wagered, lifetime_won, lifetime_ripped)
SELECT 
  COALESCE(rw.user_id, aw.user_id, rcw.user_id) as user_id,
  COALESCE(rw.balance, 0) + COALESCE(aw.balance, 0) + COALESCE(rcw.balance, 0) as balance,
  COALESCE(rw.balance, 0) + COALESCE(aw.lifetime_earned, 0) + COALESCE(rcw.lifetime_earned, 0) as lifetime_earned,
  COALESCE(rw.lifetime_spent, 0) as lifetime_spent,
  COALESCE(aw.lifetime_wagered, 0) + COALESCE(rcw.lifetime_wagered, 0) as lifetime_wagered,
  COALESCE(aw.lifetime_won, 0) + COALESCE(rcw.lifetime_won, 0) as lifetime_won,
  COALESCE(rw.lifetime_ripped, 0) as lifetime_ripped
FROM public.ripz_wallets rw
FULL OUTER JOIN public.arena_wallets aw ON rw.user_id = aw.user_id
FULL OUTER JOIN public.race_wallets rcw ON COALESCE(rw.user_id, aw.user_id) = rcw.user_id
ON CONFLICT (user_id) DO NOTHING;
