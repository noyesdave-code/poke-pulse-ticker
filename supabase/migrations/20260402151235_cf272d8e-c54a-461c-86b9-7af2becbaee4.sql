
-- Add login tracking and win stats to game_players
ALTER TABLE public.game_players
  ADD COLUMN IF NOT EXISTS last_login_date date DEFAULT CURRENT_DATE,
  ADD COLUMN IF NOT EXISTS login_streak integer NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS total_wins integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS total_losses integer NOT NULL DEFAULT 0;

-- Achievements table
CREATE TABLE public.game_achievements (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  player_id uuid NOT NULL REFERENCES public.game_players(id) ON DELETE CASCADE,
  achievement_id text NOT NULL,
  unlocked_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(player_id, achievement_id)
);
ALTER TABLE public.game_achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own achievements" ON public.game_achievements FOR SELECT TO authenticated
  USING (player_id IN (SELECT id FROM public.game_players WHERE user_id = auth.uid()));
CREATE POLICY "Users can unlock achievements" ON public.game_achievements FOR INSERT TO authenticated
  WITH CHECK (player_id IN (SELECT id FROM public.game_players WHERE user_id = auth.uid()));

-- PvP challenges table
CREATE TABLE public.game_pvp_challenges (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  challenger_id uuid NOT NULL REFERENCES public.game_players(id) ON DELETE CASCADE,
  opponent_id uuid REFERENCES public.game_players(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'open',
  wager integer NOT NULL DEFAULT 1,
  challenger_pokemon text NOT NULL,
  opponent_pokemon text,
  challenger_answer integer,
  opponent_answer integer,
  quiz_question text,
  quiz_correct_index integer,
  winner_id uuid REFERENCES public.game_players(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  resolved_at timestamptz
);
ALTER TABLE public.game_pvp_challenges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view open challenges" ON public.game_pvp_challenges FOR SELECT TO authenticated
  USING (status = 'open' OR challenger_id IN (SELECT id FROM game_players WHERE user_id = auth.uid()) OR opponent_id IN (SELECT id FROM game_players WHERE user_id = auth.uid()));
CREATE POLICY "Users can create challenges" ON public.game_pvp_challenges FOR INSERT TO authenticated
  WITH CHECK (challenger_id IN (SELECT id FROM game_players WHERE user_id = auth.uid()));
CREATE POLICY "Participants can update challenges" ON public.game_pvp_challenges FOR UPDATE TO authenticated
  USING (challenger_id IN (SELECT id FROM game_players WHERE user_id = auth.uid()) OR opponent_id IN (SELECT id FROM game_players WHERE user_id = auth.uid()));

-- Enable realtime for PvP
ALTER PUBLICATION supabase_realtime ADD TABLE public.game_pvp_challenges;
