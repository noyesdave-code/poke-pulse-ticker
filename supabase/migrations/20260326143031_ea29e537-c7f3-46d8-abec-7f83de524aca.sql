
-- Portfolio cards table
CREATE TABLE public.portfolio_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  card_api_id TEXT NOT NULL,
  card_name TEXT NOT NULL,
  card_set TEXT NOT NULL,
  card_number TEXT NOT NULL,
  card_image TEXT,
  purchase_price NUMERIC(10, 2),
  quantity INTEGER NOT NULL DEFAULT 1,
  added_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, card_api_id)
);

-- Enable RLS
ALTER TABLE public.portfolio_cards ENABLE ROW LEVEL SECURITY;

-- Users can only see their own cards
CREATE POLICY "Users can view own portfolio" ON public.portfolio_cards
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- Users can insert their own cards
CREATE POLICY "Users can add to portfolio" ON public.portfolio_cards
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own cards
CREATE POLICY "Users can update own portfolio" ON public.portfolio_cards
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own cards
CREATE POLICY "Users can delete from portfolio" ON public.portfolio_cards
  FOR DELETE TO authenticated
  USING (auth.uid() = user_id);
