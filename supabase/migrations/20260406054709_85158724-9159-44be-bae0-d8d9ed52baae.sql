-- Fix remaining RLS always-true: tighten affiliate_clicks to require user_id match
DROP POLICY IF EXISTS "Authenticated users can insert affiliate clicks" ON public.affiliate_clicks;
CREATE POLICY "Authenticated users can insert affiliate clicks"
ON public.affiliate_clicks FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Also allow anon clicks but with no user_id requirement (functional need)
CREATE POLICY "Anon users can insert affiliate clicks"
ON public.affiliate_clicks FOR INSERT TO anon
WITH CHECK (user_id IS NULL);