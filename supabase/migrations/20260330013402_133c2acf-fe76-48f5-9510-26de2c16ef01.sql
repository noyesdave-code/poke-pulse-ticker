CREATE TABLE public.delta_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  card_api_id text NOT NULL,
  card_name text NOT NULL,
  card_set text NOT NULL,
  card_number text NOT NULL,
  card_image text,
  deviation_threshold numeric NOT NULL DEFAULT 5.0,
  is_active boolean NOT NULL DEFAULT true,
  last_triggered_at timestamp with time zone,
  last_deviation numeric,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id, card_api_id)
);

ALTER TABLE public.delta_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own delta alerts" ON public.delta_alerts FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own delta alerts" ON public.delta_alerts FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own delta alerts" ON public.delta_alerts FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own delta alerts" ON public.delta_alerts FOR DELETE TO authenticated USING (auth.uid() = user_id);