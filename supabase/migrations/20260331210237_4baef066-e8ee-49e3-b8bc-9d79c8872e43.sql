
-- Arena Wallets: virtual PokéCoins for gambling games
CREATE TABLE public.arena_wallets (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  balance numeric NOT NULL DEFAULT 10000,
  lifetime_earned numeric NOT NULL DEFAULT 10000,
  lifetime_wagered numeric NOT NULL DEFAULT 0,
  lifetime_won numeric NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.arena_wallets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own wallet" ON public.arena_wallets FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own wallet" ON public.arena_wallets FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own wallet" ON public.arena_wallets FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Price Prediction Bets
CREATE TABLE public.arena_price_bets (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  card_api_id text NOT NULL,
  card_name text NOT NULL,
  card_set text NOT NULL,
  card_image text,
  index_type text NOT NULL DEFAULT 'raw',
  prediction text NOT NULL DEFAULT 'up',
  wager numeric NOT NULL DEFAULT 100,
  odds numeric NOT NULL DEFAULT 1.95,
  snapshot_price numeric NOT NULL,
  resolved_price numeric,
  payout numeric,
  status text NOT NULL DEFAULT 'active',
  resolves_at timestamp with time zone NOT NULL,
  resolved_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.arena_price_bets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own bets" ON public.arena_price_bets FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can place bets" ON public.arena_price_bets FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own bets" ON public.arena_price_bets FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Card Pack Opens (lottery/loot box)
CREATE TABLE public.arena_pack_opens (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  pack_type text NOT NULL DEFAULT 'standard',
  cost numeric NOT NULL DEFAULT 500,
  cards_pulled jsonb NOT NULL DEFAULT '[]'::jsonb,
  total_value numeric NOT NULL DEFAULT 0,
  rarity_hit text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.arena_pack_opens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own pack opens" ON public.arena_pack_opens FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can open packs" ON public.arena_pack_opens FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Arena Tournaments
CREATE TABLE public.arena_tournaments (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text,
  game_type text NOT NULL DEFAULT 'prediction',
  entry_cost numeric NOT NULL DEFAULT 1000,
  prize_pool numeric NOT NULL DEFAULT 0,
  prize_description text,
  max_entries integer NOT NULL DEFAULT 100,
  current_entries integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'upcoming',
  starts_at timestamp with time zone NOT NULL,
  ends_at timestamp with time zone NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.arena_tournaments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view tournaments" ON public.arena_tournaments FOR SELECT TO public USING (true);
CREATE POLICY "Service role manages tournaments" ON public.arena_tournaments FOR ALL TO public USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');

-- Arena Tournament Entries
CREATE TABLE public.arena_tournament_entries (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tournament_id uuid REFERENCES public.arena_tournaments(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  score numeric NOT NULL DEFAULT 0,
  rank integer,
  prize_awarded text,
  joined_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(tournament_id, user_id)
);

ALTER TABLE public.arena_tournament_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all tournament entries" ON public.arena_tournament_entries FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can join tournaments" ON public.arena_tournament_entries FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own entries" ON public.arena_tournament_entries FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
