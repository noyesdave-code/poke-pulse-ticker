
-- Blog posts table
CREATE TABLE public.blog_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  author_id UUID NOT NULL,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT NOT NULL,
  cover_image TEXT,
  published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Anyone can read published posts
CREATE POLICY "Anyone can read published posts" ON public.blog_posts
  FOR SELECT TO public USING (published = true);

-- Authors can manage own posts
CREATE POLICY "Authors can manage own posts" ON public.blog_posts
  FOR ALL TO authenticated USING (auth.uid() = author_id)
  WITH CHECK (auth.uid() = author_id);

-- Push subscriptions table
CREATE TABLE public.push_subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  endpoint TEXT NOT NULL UNIQUE,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own subscriptions" ON public.push_subscriptions
  FOR ALL TO authenticated USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
