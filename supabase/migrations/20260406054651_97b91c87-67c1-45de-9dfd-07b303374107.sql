-- FIX 1: Remove public access to site_audits (EXPOSED_SENSITIVE_DATA - error)
DROP POLICY IF EXISTS "Anyone can view audits" ON public.site_audits;

-- FIX 2: Restrict investor-assets storage uploads to authenticated users
DROP POLICY IF EXISTS "Allow public uploads to investor-assets" ON storage.objects;
DROP POLICY IF EXISTS "Allow public updates to investor-assets" ON storage.objects;

CREATE POLICY "Authenticated users can upload to investor-assets"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'investor-assets');

CREATE POLICY "Authenticated users can update investor-assets"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'investor-assets')
WITH CHECK (bucket_id = 'investor-assets');

-- FIX 3: Security definer view - drop and recreate game_pvp_leaderboard as SECURITY INVOKER
DROP VIEW IF EXISTS public.game_pvp_leaderboard;
CREATE VIEW public.game_pvp_leaderboard
WITH (security_invoker = true)
AS
SELECT
  gp.id AS player_id,
  gp.display_name,
  gp.starter_pokemon,
  gp.starter_pokemon_image,
  gp.level,
  gp.total_wins,
  gp.total_losses
FROM public.game_players gp
WHERE gp.total_wins > 0 OR gp.total_losses > 0
ORDER BY gp.total_wins DESC;

-- FIX 4: Tighten game_players leaderboard policy
DROP POLICY IF EXISTS "Anyone can view pvp leaderboard" ON public.game_players;
CREATE POLICY "Anyone can view pvp leaderboard"
ON public.game_players FOR SELECT TO authenticated
USING (total_wins > 0 OR total_losses > 0 OR user_id = auth.uid());

-- FIX 5: Tighten arena_wallets leaderboard - only own wallet
DROP POLICY IF EXISTS "Authenticated users can view leaderboard data" ON public.arena_wallets;

-- FIX 6: Tighten sentiment_votes - only own votes
DROP POLICY IF EXISTS "Authenticated users can view votes" ON public.sentiment_votes;
CREATE POLICY "Users can view own votes"
ON public.sentiment_votes FOR SELECT TO authenticated
USING (auth.uid() = user_id);

-- FIX 7: Tighten contest_entries - own entries only
DROP POLICY IF EXISTS "Users can view all contest entries" ON public.contest_entries;
CREATE POLICY "Users can view own contest entries"
ON public.contest_entries FOR SELECT TO authenticated
USING (auth.uid() = user_id);

-- FIX 8: Tighten tournament_entries - own entries only
DROP POLICY IF EXISTS "Users can view all tournament entries" ON public.arena_tournament_entries;
CREATE POLICY "Users can view own tournament entries"
ON public.arena_tournament_entries FOR SELECT TO authenticated
USING (auth.uid() = user_id);

-- FIX 9: Tighten ripz_ratings - own ratings only
DROP POLICY IF EXISTS "Anyone can view ratings" ON public.ripz_ratings;
CREATE POLICY "Users can view own ratings"
ON public.ripz_ratings FOR SELECT TO authenticated
USING (auth.uid() = user_id);

-- FIX 10: Tighten unified_wallets leaderboard policy
DROP POLICY IF EXISTS "Leaderboard view" ON public.unified_wallets;

-- FIX 11: Tighten affiliate_clicks INSERT - remove anon
DROP POLICY IF EXISTS "Anyone can insert affiliate clicks" ON public.affiliate_clicks;
CREATE POLICY "Authenticated users can insert affiliate clicks"
ON public.affiliate_clicks FOR INSERT TO authenticated
WITH CHECK (true);