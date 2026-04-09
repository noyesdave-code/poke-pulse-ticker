
DROP POLICY "Service role full access on sales_leads" ON public.sales_leads;
DROP POLICY "Service role full access on sales_pipeline_metrics" ON public.sales_pipeline_metrics;
DROP POLICY "Service role full access on sales_outreach_log" ON public.sales_outreach_log;

-- Read-only for authenticated users
CREATE POLICY "Authenticated read sales_leads" ON public.sales_leads FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated read sales_pipeline_metrics" ON public.sales_pipeline_metrics FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated read sales_outreach_log" ON public.sales_outreach_log FOR SELECT TO authenticated USING (true);
