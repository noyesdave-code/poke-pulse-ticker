import TerminalHeader from "@/components/TerminalHeader";

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
          All content, design, code, and branding on Poke-Pulse-Ticker are the intellectual property of the Service owner. You may not copy, reproduce, distribute, or create derivative works without explicit written permission.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-mono text-sm font-semibold text-foreground uppercase tracking-wider">6. Prohibited Conduct</h2>
        <p className="font-mono text-xs text-muted-foreground leading-relaxed">
          You agree not to: scrape or harvest data from the Service; attempt to reverse-engineer or copy the Service; use the Service for any unlawful purpose; interfere with or disrupt the Service's operation.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-mono text-sm font-semibold text-foreground uppercase tracking-wider">7. Limitation of Liability</h2>
        <p className="font-mono text-xs text-muted-foreground leading-relaxed">
          The Service is provided "as-is" without warranties of any kind. We are not liable for any damages arising from your use of the Service, including but not limited to data inaccuracies, service interruptions, or financial losses.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-mono text-sm font-semibold text-foreground uppercase tracking-wider">8. Changes to Terms</h2>
        <p className="font-mono text-xs text-muted-foreground leading-relaxed">
          We reserve the right to modify these terms at any time. Continued use of the Service after changes constitutes acceptance of the updated terms.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-mono text-sm font-semibold text-foreground uppercase tracking-wider">9. Contact</h2>
        <p className="font-mono text-xs text-muted-foreground leading-relaxed">
          For questions about these terms, contact us at <a href="mailto:contact@poke-pulse-ticker.com" className="text-primary hover:underline">contact@poke-pulse-ticker.com</a>.
        </p>
      </section>
    </main>
  </>
);

export default Terms;
