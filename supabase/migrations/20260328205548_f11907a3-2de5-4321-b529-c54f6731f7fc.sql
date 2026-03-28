
CREATE TABLE public.audit_actions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  audit_id uuid REFERENCES public.site_audits(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text,
  category text,
  impact text DEFAULT 'medium',
  effort text DEFAULT 'medium',
  status text NOT NULL DEFAULT 'pending',
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz
);

ALTER TABLE public.audit_actions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own actions" ON public.audit_actions
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own actions" ON public.audit_actions
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own actions" ON public.audit_actions
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own actions" ON public.audit_actions
  FOR DELETE TO authenticated USING (auth.uid() = user_id);
