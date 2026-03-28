
CREATE TABLE public.site_audits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  trigger_type text NOT NULL DEFAULT 'manual',
  status text NOT NULL DEFAULT 'pending',
  categories jsonb NOT NULL DEFAULT '[]'::jsonb,
  overall_score integer,
  summary text,
  recommendations jsonb DEFAULT '[]'::jsonb,
  competitive_intel jsonb DEFAULT '{}'::jsonb,
  legal_compliance jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz
);

ALTER TABLE public.site_audits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own audits" ON public.site_audits
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own audits" ON public.site_audits
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own audits" ON public.site_audits
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
