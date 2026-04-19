---
name: Dead-Man's Switch
description: Edge function `dead-mans-switch` runs every 5min via pg_cron, emails contact@poke-pulse-ticker.com via Brevo if index_cache.updated_at older than 10 minutes. Returns 503 when stale.
type: feature
---
- File: `supabase/functions/dead-mans-switch/index.ts`
- Threshold: 10 minutes
- Alert email: contact@poke-pulse-ticker.com via BREVO_API_KEY
- Sender: noreply@notify.poke-pulse-ticker.com
- Schedule: every 5 minutes via pg_cron + pg_net (set up via insert tool when ready)
- Status code: 503 when stale, 200 when healthy
