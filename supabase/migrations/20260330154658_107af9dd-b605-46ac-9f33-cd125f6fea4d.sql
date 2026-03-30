
-- Phase 1: Index Data Cache table
CREATE TABLE public.index_cache (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cache_key text NOT NULL UNIQUE,
  data jsonb NOT NULL DEFAULT '{}',
  expires_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Allow public read for cache (no auth needed for index data)
ALTER TABLE public.index_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read cache"
  ON public.index_cache FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Service role can manage cache"
  ON public.index_cache FOR ALL
  TO public
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Phase 2: Alpha signals table for divergence alerts
CREATE TABLE public.alpha_signals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  card_api_id text NOT NULL,
  card_name text NOT NULL,
  card_set text NOT NULL,
  card_image text,
  signal_type text NOT NULL DEFAULT 'volume_divergence',
  strength text NOT NULL DEFAULT 'medium',
  price_change_pct numeric NOT NULL DEFAULT 0,
  volume_change_pct numeric NOT NULL DEFAULT 0,
  description text,
  detected_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '24 hours')
);

ALTER TABLE public.alpha_signals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read signals"
  ON public.alpha_signals FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Service role can manage signals"
  ON public.alpha_signals FOR ALL
  TO public
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');
