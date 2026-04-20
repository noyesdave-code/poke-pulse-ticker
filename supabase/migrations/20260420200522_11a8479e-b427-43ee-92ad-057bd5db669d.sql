create extension if not exists pg_cron;
create extension if not exists pg_net;

select cron.unschedule('pricing-health-watchdog') where exists (select 1 from cron.job where jobname='pricing-health-watchdog');

select cron.schedule(
  'pricing-health-watchdog',
  '*/5 * * * *',
  $$
  select net.http_post(
    url := 'https://eikhrxplszgnmgzsktdl.supabase.co/functions/v1/pricing-health',
    headers := '{"Content-Type":"application/json","Authorization":"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpa2hyeHBsc3pnbm1nenNrdGRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1MzE1NDQsImV4cCI6MjA5MDEwNzU0NH0.N2hgwUgjqVHZHWt0gKhsNXDST7sgK_b_Tf-KkvPiIlQ"}'::jsonb,
    body := '{}'::jsonb
  );
  $$
);