
-- Create the daily audit cron job at 6 AM EST (11 AM UTC)
-- Uses pg_net to call the site-audit edge function
SELECT cron.schedule(
  'daily-site-audit-6am',
  '0 11 * * *',
  $$
  SELECT net.http_post(
    url := 'https://eikhrxplszgnmgzsktdl.supabase.co/functions/v1/site-audit',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'apikey', current_setting('app.settings.service_role_key', true)
    ),
    body := '{"trigger_type": "scheduled"}'::jsonb
  );
  $$
);
