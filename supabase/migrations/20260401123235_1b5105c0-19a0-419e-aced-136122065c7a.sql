DROP POLICY "Anyone can insert affiliate clicks" ON public.affiliate_clicks;
CREATE POLICY "Anyone can insert affiliate clicks"
  ON public.affiliate_clicks FOR INSERT TO anon, authenticated
  WITH CHECK (true);