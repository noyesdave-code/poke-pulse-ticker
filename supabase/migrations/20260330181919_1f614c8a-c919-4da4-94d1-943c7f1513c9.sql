
-- Virtual trading portfolios for SimTrader game
CREATE TABLE public.trader_portfolios (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  virtual_balance NUMERIC NOT NULL DEFAULT 100000,
  starting_balance NUMERIC NOT NULL DEFAULT 100000,
  total_portfolio_value NUMERIC NOT NULL DEFAULT 100000,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  season_id TEXT NOT NULL DEFAULT 'season_1',
  is_active BOOLEAN NOT NULL DEFAULT true,
  UNIQUE(user_id, season_id)
);

-- Holdings: virtual card token positions
CREATE TABLE public.trader_holdings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  portfolio_id UUID REFERENCES public.trader_portfolios(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  card_api_id TEXT NOT NULL,
  card_name TEXT NOT NULL,
  card_set TEXT NOT NULL,
  card_image TEXT,
  quantity NUMERIC NOT NULL DEFAULT 0,
  avg_cost NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(portfolio_id, card_api_id)
);

-- Trade orders (market, limit, stop-loss)
CREATE TABLE public.trade_orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  portfolio_id UUID REFERENCES public.trader_portfolios(id) ON DELETE CASCADE NOT NULL,
  card_api_id TEXT NOT NULL,
  card_name TEXT NOT NULL,
  card_set TEXT NOT NULL,
  card_image TEXT,
  order_type TEXT NOT NULL DEFAULT 'market',
  side TEXT NOT NULL DEFAULT 'buy',
  quantity NUMERIC NOT NULL,
  price NUMERIC NOT NULL,
  limit_price NUMERIC,
  stop_price NUMERIC,
  status TEXT NOT NULL DEFAULT 'pending',
  filled_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (now() + interval '24 hours')
);

-- Daily trading contests
CREATE TABLE public.trading_contests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  starts_at TIMESTAMP WITH TIME ZONE NOT NULL,
  ends_at TIMESTAMP WITH TIME ZONE NOT NULL,
  entry_balance NUMERIC NOT NULL DEFAULT 50000,
  status TEXT NOT NULL DEFAULT 'upcoming',
  prize_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Contest entries / leaderboard
CREATE TABLE public.contest_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  contest_id UUID REFERENCES public.trading_contests(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  portfolio_id UUID REFERENCES public.trader_portfolios(id) ON DELETE CASCADE NOT NULL,
  final_value NUMERIC,
  pnl_pct NUMERIC,
  rank INTEGER,
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(contest_id, user_id)
);

-- RLS policies
ALTER TABLE public.trader_portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trader_holdings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trade_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trading_contests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contest_entries ENABLE ROW LEVEL SECURITY;

-- Portfolios: users manage own
CREATE POLICY "Users can view own trader portfolio" ON public.trader_portfolios FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own trader portfolio" ON public.trader_portfolios FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own trader portfolio" ON public.trader_portfolios FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Holdings: users manage own
CREATE POLICY "Users can view own holdings" ON public.trader_holdings FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own holdings" ON public.trader_holdings FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own holdings" ON public.trader_holdings FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own holdings" ON public.trader_holdings FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Orders: users manage own
CREATE POLICY "Users can view own orders" ON public.trade_orders FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own orders" ON public.trade_orders FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own orders" ON public.trade_orders FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Contests: public read
CREATE POLICY "Anyone can view contests" ON public.trading_contests FOR SELECT TO public USING (true);
CREATE POLICY "Service role can manage contests" ON public.trading_contests FOR ALL TO public USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');

-- Contest entries: users own + public leaderboard
CREATE POLICY "Users can view all contest entries" ON public.contest_entries FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can join contests" ON public.contest_entries FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own entries" ON public.contest_entries FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
