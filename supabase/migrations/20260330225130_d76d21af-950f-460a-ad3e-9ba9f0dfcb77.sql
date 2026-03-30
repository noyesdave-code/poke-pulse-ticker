
-- Create user_trials table to track free trial auto-enrollment
CREATE TABLE public.user_trials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  tier text NOT NULL DEFAULT 'pro',
  starts_at timestamp with time zone NOT NULL DEFAULT now(),
  ends_at timestamp with time zone NOT NULL DEFAULT (now() + interval '7 days'),
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Add unique constraint so each user gets one trial
ALTER TABLE public.user_trials ADD CONSTRAINT user_trials_user_id_unique UNIQUE (user_id);

-- Enable RLS
ALTER TABLE public.user_trials ENABLE ROW LEVEL SECURITY;

-- Users can read their own trial
CREATE POLICY "Users can view own trial" ON public.user_trials
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- Service role can manage all trials
CREATE POLICY "Service role can manage trials" ON public.user_trials
  FOR ALL TO public
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Update the handle_new_user trigger function to also insert a trial record
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id) VALUES (NEW.id);
  INSERT INTO public.user_trials (user_id) VALUES (NEW.id);
  RETURN NEW;
END;
$$;
