
CREATE TABLE public.prediction_duels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  challenger_id uuid NOT NULL,
  opponent_id uuid,
  card_api_id text NOT NULL,
  card_name text NOT NULL,
  card_set text NOT NULL,
  card_image text,
  challenger_prediction text NOT NULL DEFAULT 'up',
  snapshot_price numeric NOT NULL,
  wager numeric NOT NULL DEFAULT 500,
  status text NOT NULL DEFAULT 'open',
  resolves_at timestamptz NOT NULL,
  resolved_price numeric,
  winner_id uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  accepted_at timestamptz,
  resolved_at timestamptz
);

ALTER TABLE public.prediction_duels ENABLE ROW LEVEL SECURITY;

-- Anyone authenticated can see open duels (for matchmaking)
CREATE POLICY "Anyone can view open duels"
ON public.prediction_duels FOR SELECT TO authenticated
USING (status = 'open' OR challenger_id = auth.uid() OR opponent_id = auth.uid());

-- Users can create duels
CREATE POLICY "Users can create duels"
ON public.prediction_duels FOR INSERT TO authenticated
WITH CHECK (auth.uid() = challenger_id);

-- Participants can update their duels (accept/resolve)
CREATE POLICY "Participants can update duels"
ON public.prediction_duels FOR UPDATE TO authenticated
USING (challenger_id = auth.uid() OR opponent_id = auth.uid());

ALTER PUBLICATION supabase_realtime ADD TABLE public.prediction_duels;
