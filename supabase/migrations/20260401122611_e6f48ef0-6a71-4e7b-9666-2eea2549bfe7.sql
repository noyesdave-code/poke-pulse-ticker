CREATE TABLE public.affiliate_clicks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  partner text NOT NULL,
  card_name text,
  card_set text,
  clicked_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.affiliate_clicks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert affiliate clicks"
  ON public.affiliate_clicks FOR INSERT TO public
  WITH CHECK (true);

CREATE POLICY "Service role can read affiliate clicks"
  ON public.affiliate_clicks FOR SELECT TO public
  USING (auth.role() = 'service_role');

CREATE INDEX idx_affiliate_clicks_partner ON public.affiliate_clicks (partner);
CREATE INDEX idx_affiliate_clicks_clicked_at ON public.affiliate_clicks (clicked_at);