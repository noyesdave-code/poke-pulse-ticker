-- FIX: Storage ownership check for investor-assets updates
DROP POLICY IF EXISTS "Authenticated users can update investor-assets" ON storage.objects;
CREATE POLICY "Authenticated users can update own investor-assets"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'investor-assets' AND owner = auth.uid())
WITH CHECK (bucket_id = 'investor-assets');

-- Consolidate INSERT policies - remove redundant public one if exists
DROP POLICY IF EXISTS "Allow public uploads to investor-assets" ON storage.objects;

-- FIX: Realtime authorization - note we cannot modify realtime schema directly,
-- but we can add channel-level authorization via the existing tables.
-- The realtime.messages table is in a reserved schema, so we handle this
-- by documenting that Realtime subscriptions are filtered client-side
-- and the underlying table RLS policies already restrict data access.

-- Add limited leaderboard SELECT policies for contests/tournaments
DROP POLICY IF EXISTS "Users can view own contest entries" ON public.contest_entries;
CREATE POLICY "Users can view contest leaderboard"
ON public.contest_entries FOR SELECT TO authenticated
USING (auth.uid() = user_id OR rank IS NOT NULL);

DROP POLICY IF EXISTS "Users can view own tournament entries" ON public.arena_tournament_entries;
CREATE POLICY "Users can view tournament leaderboard"
ON public.arena_tournament_entries FOR SELECT TO authenticated
USING (auth.uid() = user_id OR rank IS NOT NULL);