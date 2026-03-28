
CREATE TABLE public.price_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  card_api_id text NOT NULL,
  card_name text NOT NULL,
  card_set text NOT NULL,
  card_number text NOT NULL,
  card_image text,
  target_price numeric NOT NULL,
  direction text NOT NULL DEFAULT 'below',
  is_triggered boolean NOT NULL DEFAULT false,
  triggered_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id, card_api_id, target_price)
);

ALTER TABLE public.price_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own alerts" ON public.price_alerts FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own alerts" ON public.price_alerts FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own alerts" ON public.price_alerts FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own alerts" ON public.price_alerts FOR DELETE TO authenticated USING (auth.uid() = user_id);
