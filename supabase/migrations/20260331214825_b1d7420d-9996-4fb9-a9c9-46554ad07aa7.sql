
-- Fix 1: Remove overly-permissive public read policy on site_audits
DROP POLICY IF EXISTS "Anyone can read audits" ON public.site_audits;

-- Fix 2: Create a database view for arena leaderboard that only exposes safe data
CREATE OR REPLACE VIEW public.arena_leaderboard AS
SELECT 
  aw.user_id,
  aw.lifetime_won,
  aw.lifetime_wagered,
  p.display_name,
  p.avatar_url
FROM public.arena_wallets aw
LEFT JOIN public.profiles p ON p.id = aw.user_id AND p.is_public = true
ORDER BY aw.lifetime_won DESC
LIMIT 100;

-- Fix 3: Replace overly-permissive arena_wallets public policy with authenticated-only
DROP POLICY IF EXISTS "Anyone can view leaderboard data" ON public.arena_wallets;

CREATE POLICY "Authenticated users can view leaderboard data"
ON public.arena_wallets
FOR SELECT
TO authenticated
USING (true);
