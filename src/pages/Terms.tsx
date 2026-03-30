import TerminalHeader from "@/components/TerminalHeader";
import FinancialDisclaimer from "@/components/FinancialDisclaimer";

const Terms = () => (
  <>
    <TerminalHeader />
    <main className="max-w-3xl mx-auto px-4 py-10 space-y-6">
      <h1 className="font-mono text-2xl font-bold text-foreground tracking-wider">Terms of Service</h1>
      <p className="font-mono text-xs text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>

      <section className="space-y-3">
        <h2 className="font-mono text-sm font-semibold text-foreground uppercase tracking-wider">1. Acceptance of Terms</h2>
        <p className="font-mono text-xs text-muted-foreground leading-relaxed">
          By accessing and using Poke-Pulse-Ticker ("the Service"), you agree to be bound by these Terms of Service. If you do not agree, do not use the Service.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-mono text-sm font-semibold text-foreground uppercase tracking-wider">2. Description of Service</h2>
        <p className="font-mono text-xs text-muted-foreground leading-relaxed">
          Poke-Pulse-Ticker provides live Pokémon TCG market data, portfolio tracking, and related tools. Data is sourced from third-party APIs and is provided "as-is" for informational purposes only.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-mono text-sm font-semibold text-foreground uppercase tracking-wider">3. Not Financial Advice</h2>
        <p className="font-mono text-xs text-muted-foreground leading-relaxed">
          All market data, price information, and analytics displayed on the Service are for informational purposes only and do not constitute financial, investment, or trading advice. You should not make any financial decisions based solely on the information provided.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-mono text-sm font-semibold text-foreground uppercase tracking-wider">4. User Accounts</h2>
        <p className="font-mono text-xs text-muted-foreground leading-relaxed">
          You are responsible for maintaining the security of your account credentials. You agree not to share your account or use another user's account without permission.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-mono text-sm font-semibold text-foreground uppercase tracking-wider">5. Intellectual Property</h2>
        <p className="font-mono text-xs text-muted-foreground leading-relaxed">
          All content, design, code, and branding on Poke-Pulse-Ticker are the intellectual property of PGVA Ventures, LLC. You may not copy, reproduce, distribute, or create derivative works without explicit written permission.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-mono text-sm font-semibold text-foreground uppercase tracking-wider">6. Proprietary Data &amp; Anti-Redistribution</h2>
        <p className="font-mono text-xs text-muted-foreground leading-relaxed">
          The RAW 500 INDEX, GRADED 1000 INDEX, SEALED 1000 INDEX, Alpha Signals, and all derived analytics (including Buy/Sell/Hold signal badges, RSI indicators, and predictive algorithms) are proprietary intellectual property of PGVA Ventures, LLC. Commercial redistribution, resale, syndication, data mining, automated scraping, or systematic extraction of any proprietary data, indexes, or analytics from the Service is strictly prohibited. Violation may result in immediate account termination and legal action.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-mono text-sm font-semibold text-foreground uppercase tracking-wider">6A. SimTrader™ Proprietary Game System</h2>
        <p className="font-mono text-xs text-muted-foreground leading-relaxed">
          SimTrader™, the Pokémon Stock Market Simulator, including but not limited to its concept, design, user interface, game mechanics, virtual trading engine, order types (market, limit, stop-loss), contest systems, leaderboard algorithms, portfolio simulation logic, token economy, and all associated source code, artwork, and documentation, is the exclusive proprietary intellectual property of PGVA Ventures, LLC, a company wholly owned by the Noyes Family Trust, managed by David Noyes. All rights are reserved under United States and international copyright, trade secret, and intellectual property law.
        </p>
        <p className="font-mono text-xs text-muted-foreground leading-relaxed">
          No individual, entity, corporation, partnership, or organization may copy, reproduce, reverse-engineer, decompile, disassemble, emulate, clone, create derivative works from, or otherwise replicate any aspect of SimTrader™ or the Poke-Pulse-Ticker platform without prior express written consent from PGVA Ventures, LLC. This prohibition extends to but is not limited to: the simulated stock market concept as applied to Pokémon TCG cards; the virtual currency and token trading mechanics; the daily contest and tournament systems; the integration of live market data into simulated trading; and all proprietary algorithms governing price simulation, order matching, and portfolio valuation.
        </p>
        <p className="font-mono text-xs text-muted-foreground leading-relaxed">
          Unauthorized reproduction or distribution of SimTrader™ or any component thereof constitutes willful infringement and will be prosecuted to the fullest extent of applicable law, including but not limited to claims under the Digital Millennium Copyright Act (DMCA), the Computer Fraud and Abuse Act (CFAA), the Defend Trade Secrets Act (DTSA), and applicable state trade secret statutes. PGVA Ventures, LLC reserves the right to seek injunctive relief, actual damages, statutory damages, attorneys' fees, and any other remedies available at law or in equity.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-mono text-sm font-semibold text-foreground uppercase tracking-wider">6B. Ownership Chain &amp; Legal Entity Structure</h2>
        <p className="font-mono text-xs text-muted-foreground leading-relaxed">
          All intellectual property rights in and to Poke-Pulse-Ticker, SimTrader™, Pokegarageva, Poke Pulse Market Ticker, and all associated trademarks, trade names, service marks, copyrights, trade secrets, patents, and proprietary technology are owned exclusively by PGVA Ventures, LLC. PGVA Ventures, LLC is wholly owned by the Noyes Family Trust. The Noyes Family Trust is managed by David Noyes, who serves as the ultimate beneficial owner and controlling party of all aforementioned intellectual property. This ownership structure is established and maintained under the laws of the United States of America. Any dispute regarding ownership, licensing, or use of said intellectual property shall be governed by the laws of the State in which PGVA Ventures, LLC is organized, without regard to conflict of law principles.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-mono text-sm font-semibold text-foreground uppercase tracking-wider">7. Prohibited Conduct</h2>
        <p className="font-mono text-xs text-muted-foreground leading-relaxed">
          You agree not to: scrape, harvest, or systematically extract data from the Service; reverse-engineer, decompile, or copy the Service or its algorithms; redistribute or resell any proprietary data, indexes, or signals; use automated tools (bots, crawlers, scripts) to access the Service; use the Service for any unlawful purpose; interfere with or disrupt the Service's operation; share account credentials or enable unauthorized access.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-mono text-sm font-semibold text-foreground uppercase tracking-wider">8. Fair Use &amp; Trademark Notice</h2>
        <p className="font-mono text-xs text-muted-foreground leading-relaxed">
          Pokémon, Pokémon TCG, and all related trademarks, logos, and card images are the property of Nintendo, Creatures Inc., GAME FREAK inc., and The Pokémon Company International. Poke-Pulse-Ticker is not affiliated with, sponsored by, or endorsed by The Pokémon Company, Nintendo, or any official entity. All Pokémon card images are used under fair use for informational and commentary purposes. Market data is sourced from public third-party APIs.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-mono text-sm font-semibold text-foreground uppercase tracking-wider">9. Limitation of Liability</h2>
        <p className="font-mono text-xs text-muted-foreground leading-relaxed">
          The Service is provided "as-is" without warranties of any kind. PGVA Ventures, LLC is not liable for any damages arising from your use of the Service, including but not limited to data inaccuracies, service interruptions, financial losses, or reliance on market analytics. Tax reports generated by the Service are estimates only — PGVA Ventures, LLC is not a Certified Public Accountant (CPA) or licensed tax advisor.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-mono text-sm font-semibold text-foreground uppercase tracking-wider">10. Changes to Terms</h2>
        <p className="font-mono text-xs text-muted-foreground leading-relaxed">
          We reserve the right to modify these terms at any time. Continued use of the Service after changes constitutes acceptance of the updated terms.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-mono text-sm font-semibold text-foreground uppercase tracking-wider">11. Contact</h2>
        <p className="font-mono text-xs text-muted-foreground leading-relaxed">
          For questions about these terms, contact us at <a href="mailto:contact@poke-pulse-ticker.com" className="text-primary hover:underline">contact@poke-pulse-ticker.com</a>.
        </p>
      </section>
      <FinancialDisclaimer compact />
    </main>
  </>
);

export default Terms;
