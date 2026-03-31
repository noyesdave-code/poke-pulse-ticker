
DROP VIEW IF EXISTS public.arena_leaderboard;

CREATE VIEW public.arena_leaderboard
WITH (security_invoker = true)
AS
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
