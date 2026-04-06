-- Fix remaining security definer views
DROP VIEW IF EXISTS public.arena_leaderboard;
CREATE VIEW public.arena_leaderboard
WITH (security_invoker = true)
AS
SELECT aw.user_id,
    aw.lifetime_won,
    aw.lifetime_wagered,
    p.display_name,
    p.avatar_url
FROM arena_wallets aw
LEFT JOIN profiles p ON p.id = aw.user_id AND p.is_public = true
ORDER BY aw.lifetime_won DESC
LIMIT 100;

DROP VIEW IF EXISTS public.race_leaderboard;
CREATE VIEW public.race_leaderboard
WITH (security_invoker = true)
AS
SELECT rw.user_id,
    p.display_name,
    p.avatar_url,
    rw.lifetime_won,
    rw.lifetime_wagered,
    rw.balance
FROM race_wallets rw
LEFT JOIN profiles p ON p.id = rw.user_id
ORDER BY rw.lifetime_won DESC
LIMIT 50;