
CREATE POLICY "Anyone can view leaderboard data" ON public.arena_wallets FOR SELECT TO public USING (true);
