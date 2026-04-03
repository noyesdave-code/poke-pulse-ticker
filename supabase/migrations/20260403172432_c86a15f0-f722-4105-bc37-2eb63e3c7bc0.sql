
-- Poké Race sessions table
CREATE TABLE public.race_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  race_type text NOT NULL DEFAULT 'sprint' CHECK (race_type IN ('sprint', 'championship')),
  category text NOT NULL DEFAULT 'price' CHECK (category IN ('price', 'inventory')),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'finished', 'canceled')),
  started_at timestamp with time zone NOT NULL DEFAULT now(),
  ends_at timestamp with time zone NOT NULL,
  racers jsonb NOT NULL DEFAULT '[]'::jsonb,
  results jsonb DEFAULT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.race_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view race sessions" ON public.race_sessions
  FOR SELECT TO public USING (true);

CREATE POLICY "Service role manages races" ON public.race_sessions
  FOR ALL TO public USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');

-- Poké Race wallets
CREATE TABLE public.race_wallets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  balance integer NOT NULL DEFAULT 1000,
  lifetime_earned integer NOT NULL DEFAULT 1000,
  lifetime_wagered integer NOT NULL DEFAULT 0,
  lifetime_won integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.race_wallets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own wallet" ON public.race_wallets
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own wallet" ON public.race_wallets
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own wallet" ON public.race_wallets
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Poké Race bets
CREATE TABLE public.race_bets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  race_id uuid NOT NULL REFERENCES public.race_sessions(id) ON DELETE CASCADE,
  racer_id text NOT NULL,
  wager integer NOT NULL DEFAULT 100,
  odds numeric NOT NULL DEFAULT 2.0,
  payout integer DEFAULT NULL,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'won', 'lost', 'refunded')),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  resolved_at timestamp with time zone DEFAULT NULL
);

ALTER TABLE public.race_bets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own bets" ON public.race_bets
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can place bets" ON public.race_bets
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own bets" ON public.race_bets
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Race leaderboard view
CREATE OR REPLACE VIEW public.race_leaderboard AS
SELECT 
  rw.user_id,
  p.display_name,
  p.avatar_url,
  rw.lifetime_won,
  rw.lifetime_wagered,
  rw.balance
FROM public.race_wallets rw
LEFT JOIN public.profiles p ON p.id = rw.user_id
ORDER BY rw.lifetime_won DESC
LIMIT 50;
