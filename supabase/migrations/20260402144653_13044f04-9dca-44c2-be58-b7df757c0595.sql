
-- PokémonKids game tables

-- Player game profiles
CREATE TABLE public.game_players (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  starter_pokemon TEXT NOT NULL,
  starter_pokemon_image TEXT,
  display_name TEXT,
  level INTEGER NOT NULL DEFAULT 1,
  xp INTEGER NOT NULL DEFAULT 0,
  coins_balance INTEGER NOT NULL DEFAULT 500,
  has_paid BOOLEAN NOT NULL DEFAULT false,
  free_battles_remaining INTEGER NOT NULL DEFAULT 3,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Collected Pokémon characters
CREATE TABLE public.game_collected_pokemon (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  player_id UUID REFERENCES public.game_players(id) ON DELETE CASCADE NOT NULL,
  pokemon_name TEXT NOT NULL,
  pokemon_image TEXT,
  pokemon_type TEXT,
  collected_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(player_id, pokemon_name)
);

-- Collected cards
CREATE TABLE public.game_collected_cards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  player_id UUID REFERENCES public.game_players(id) ON DELETE CASCADE NOT NULL,
  card_api_id TEXT NOT NULL,
  card_name TEXT NOT NULL,
  card_image TEXT,
  card_set TEXT,
  card_rarity TEXT,
  pokemon_name TEXT NOT NULL,
  collected_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(player_id, card_api_id)
);

-- Battle history
CREATE TABLE public.game_battles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  player_id UUID REFERENCES public.game_players(id) ON DELETE CASCADE NOT NULL,
  opponent_type TEXT NOT NULL DEFAULT 'bot',
  opponent_id UUID REFERENCES public.game_players(id),
  opponent_pokemon TEXT NOT NULL,
  player_pokemon TEXT NOT NULL,
  cards_wagered INTEGER NOT NULL DEFAULT 1,
  cards_won INTEGER NOT NULL DEFAULT 0,
  knowledge_score INTEGER NOT NULL DEFAULT 0,
  matchup_score INTEGER NOT NULL DEFAULT 0,
  card_score INTEGER NOT NULL DEFAULT 0,
  result TEXT NOT NULL,
  xp_earned INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Game purchases (track $0.99 game unlock)
CREATE TABLE public.game_purchases (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  product_type TEXT NOT NULL DEFAULT 'game_access',
  stripe_session_id TEXT,
  amount_cents INTEGER NOT NULL DEFAULT 99,
  status TEXT NOT NULL DEFAULT 'completed',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.game_players ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_collected_pokemon ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_collected_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_battles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_purchases ENABLE ROW LEVEL SECURITY;

-- RLS policies: users can only access their own game data
CREATE POLICY "Users can view own game player" ON public.game_players FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can create own game player" ON public.game_players FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own game player" ON public.game_players FOR UPDATE TO authenticated USING (user_id = auth.uid());

CREATE POLICY "Users can view own collected pokemon" ON public.game_collected_pokemon FOR SELECT TO authenticated USING (player_id IN (SELECT id FROM public.game_players WHERE user_id = auth.uid()));
CREATE POLICY "Users can collect pokemon" ON public.game_collected_pokemon FOR INSERT TO authenticated WITH CHECK (player_id IN (SELECT id FROM public.game_players WHERE user_id = auth.uid()));

CREATE POLICY "Users can view own collected cards" ON public.game_collected_cards FOR SELECT TO authenticated USING (player_id IN (SELECT id FROM public.game_players WHERE user_id = auth.uid()));
CREATE POLICY "Users can collect cards" ON public.game_collected_cards FOR INSERT TO authenticated WITH CHECK (player_id IN (SELECT id FROM public.game_players WHERE user_id = auth.uid()));

CREATE POLICY "Users can view own battles" ON public.game_battles FOR SELECT TO authenticated USING (player_id IN (SELECT id FROM public.game_players WHERE user_id = auth.uid()));
CREATE POLICY "Users can create battles" ON public.game_battles FOR INSERT TO authenticated WITH CHECK (player_id IN (SELECT id FROM public.game_players WHERE user_id = auth.uid()));

CREATE POLICY "Users can view own purchases" ON public.game_purchases FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can create purchases" ON public.game_purchases FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
