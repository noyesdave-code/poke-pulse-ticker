---
name: Pricing Health Watchdog
description: 6-source pricing engine with live signal-strength monitoring and auto-failover
type: feature
---
- **Sources (6):** TCGPlayer (free), eBay (key pending), PriceCharting (paid), Card Ladder (paid), Probstein RSS (free), 130point scrape (free)
- **Watchdog:** `pricing-health` edge fn probes all 6 every 5 min via pg_cron, caches result in `index_cache` (key: `pricing_health`)
- **Signal strength:** `(liveSources / 6) * 100` — pill turns green ≥67%, yellow 34-66%, red <34%
- **UI:** `usePricingHealth` hook polls cache + invokes function every 5 min; `CertifiedDataPartner` renders per-source pills
- **Failover:** consensus-pricing returns `apiStatus` + `signalStrength` per request; missing sources skipped, never fabricated as live
- **Free-tier signal:** ~50% (TCG + Probstein + 130point) until eBay App ID arrives → ~67%
