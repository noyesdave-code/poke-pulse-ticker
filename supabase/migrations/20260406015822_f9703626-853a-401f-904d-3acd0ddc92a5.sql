
-- Digital portfolio for Poké Ripz ripped cards
CREATE TABLE public.digital_portfolio_cards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  card_api_id TEXT NOT NULL,
  card_name TEXT NOT NULL,
  card_set TEXT NOT NULL,
  card_number TEXT NOT NULL,
  card_image TEXT,
  card_rarity TEXT,
  rip_value NUMERIC NOT NULL DEFAULT 0,
  ripped_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  rip_session_id UUID,
  UNIQUE(user_id, card_api_id, ripped_at)
);

ALTER TABLE public.digital_portfolio_cards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own digital cards" ON public.digital_portfolio_cards FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own digital cards" ON public.digital_portfolio_cards FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own digital cards" ON public.digital_portfolio_cards FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Rip sessions track each pack/product opening
CREATE TABLE public.rip_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  product_type TEXT NOT NULL DEFAULT 'booster_pack',
  set_id TEXT NOT NULL,
  set_name TEXT NOT NULL,
  era TEXT NOT NULL DEFAULT 'modern',
  coin_cost INTEGER NOT NULL DEFAULT 100,
  cards_pulled JSONB NOT NULL DEFAULT '[]'::jsonb,
  total_rip_value NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.rip_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own rip sessions" ON public.rip_sessions FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own rip sessions" ON public.rip_sessions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Ripz wallets (separate from arena wallets)
CREATE TABLE public.ripz_wallets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  balance INTEGER NOT NULL DEFAULT 5000,
  lifetime_spent INTEGER NOT NULL DEFAULT 0,
  lifetime_ripped INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.ripz_wallets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own ripz wallet" ON public.ripz_wallets FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own ripz wallet" ON public.ripz_wallets FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own ripz wallet" ON public.ripz_wallets FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Show ratings for Poké Ripz episodes
CREATE TABLE public.ripz_ratings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  episode_id TEXT NOT NULL,
  rating INTEGER NOT NULL DEFAULT 3,
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, episode_id)
);

ALTER TABLE public.ripz_ratings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view ratings" ON public.ripz_ratings FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can insert own ratings" ON public.ripz_ratings FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own ratings" ON public.ripz_ratings FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
