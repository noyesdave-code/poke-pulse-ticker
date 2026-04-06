-- Fix duplicate/overly permissive INSERT policies on investor-assets storage
DROP POLICY IF EXISTS "Authenticated users can upload investor assets" ON storage.objects;
DROP POLICY IF EXISTS "owner_upload_investor_assets" ON storage.objects;

-- Find and drop any INSERT policies on investor-assets bucket
DO $$
DECLARE
  pol record;
BEGIN
  FOR pol IN 
    SELECT policyname FROM pg_policies 
    WHERE tablename = 'objects' 
    AND schemaname = 'storage'
    AND cmd = 'INSERT'
    AND qual::text LIKE '%investor-assets%' OR with_check::text LIKE '%investor-assets%'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON storage.objects', pol.policyname);
  END LOOP;
END $$;

-- Create a single secure INSERT policy scoped to user folder
CREATE POLICY "Users upload to own folder in investor-assets"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'investor-assets'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Fix UPDATE policy to also restrict target path
DROP POLICY IF EXISTS "Owners can update own investor assets" ON storage.objects;
CREATE POLICY "Owners can update own investor assets"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'investor-assets' AND owner = auth.uid())
WITH CHECK (
  bucket_id = 'investor-assets'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Create a leaderboard view for game_players exposing only safe columns
CREATE OR REPLACE VIEW public.game_players_leaderboard
WITH (security_invoker = true)
AS SELECT
  id,
  display_name,
  level,
  xp,
  total_wins,
  total_losses,
  starter_pokemon,
  starter_pokemon_image
FROM public.game_players
WHERE total_wins > 0 OR total_losses > 0;