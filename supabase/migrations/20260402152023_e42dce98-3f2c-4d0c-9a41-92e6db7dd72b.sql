
-- Create a view for PvP leaderboard from game_players
CREATE OR REPLACE VIEW public.game_pvp_leaderboard AS
SELECT 
  gp.id as player_id,
  gp.user_id,
  gp.display_name,
  gp.starter_pokemon,
  gp.starter_pokemon_image,
  gp.level,
  gp.total_wins,
  gp.total_losses,
  p.avatar_url
FROM public.game_players gp
LEFT JOIN public.profiles p ON p.id = gp.user_id
ORDER BY gp.total_wins DESC
LIMIT 50;

-- Allow authenticated users to read leaderboard
CREATE POLICY "Anyone can view pvp leaderboard" ON public.game_players FOR SELECT TO authenticated
  USING (true);
