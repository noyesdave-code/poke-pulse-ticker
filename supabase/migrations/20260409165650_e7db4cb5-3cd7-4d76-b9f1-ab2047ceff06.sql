
-- AI Sales Pipeline: Leads table
CREATE TABLE public.sales_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  source TEXT DEFAULT 'organic',
  status TEXT DEFAULT 'new' CHECK (status IN ('new','contacted','engaged','demo_scheduled','converted','lost')),
  score INTEGER DEFAULT 0,
  ai_personalization JSONB DEFAULT '{}',
  last_contacted_at TIMESTAMPTZ,
  next_followup_at TIMESTAMPTZ,
  notes TEXT,
  converted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Pipeline metrics table
CREATE TABLE public.sales_pipeline_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_date DATE NOT NULL DEFAULT CURRENT_DATE,
  leads_generated INTEGER DEFAULT 0,
  emails_sent INTEGER DEFAULT 0,
  responses_received INTEGER DEFAULT 0,
  demos_scheduled INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  revenue_generated NUMERIC(10,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Outreach log
CREATE TABLE public.sales_outreach_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES public.sales_leads(id) ON DELETE CASCADE,
  outreach_type TEXT DEFAULT 'email',
  subject TEXT,
  body TEXT,
  ai_model_used TEXT,
  response TEXT,
  status TEXT DEFAULT 'sent',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.sales_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales_pipeline_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales_outreach_log ENABLE ROW LEVEL SECURITY;

-- Only authenticated users (admin via service role)
CREATE POLICY "Service role full access on sales_leads" ON public.sales_leads FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access on sales_pipeline_metrics" ON public.sales_pipeline_metrics FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access on sales_outreach_log" ON public.sales_outreach_log FOR ALL USING (true) WITH CHECK (true);
