import TerminalHeader from "@/components/TerminalHeader";
import FinancialDisclaimer from "@/components/FinancialDisclaimer";

const Privacy = () => (
  <>
    <TerminalHeader />
    <main className="max-w-3xl mx-auto px-4 py-10 space-y-6">
      <h1 className="font-mono text-2xl font-bold text-foreground tracking-wider">Privacy Policy</h1>
      <p className="font-mono text-xs text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>

      <section className="space-y-3">
        <h2 className="font-mono text-sm font-semibold text-foreground uppercase tracking-wider">1. Information We Collect</h2>
        <p className="font-mono text-xs text-muted-foreground leading-relaxed">
          When you create an account, we collect your email address and authentication credentials. When you use the Service, we may collect usage data such as pages visited, features used, and portfolio data you voluntarily enter.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-mono text-sm font-semibold text-foreground uppercase tracking-wider">2. How We Use Your Information</h2>
        <p className="font-mono text-xs text-muted-foreground leading-relaxed">
          We use your information to: provide and maintain the Service; manage your account and portfolio; improve the Service; communicate important updates; ensure security and prevent fraud.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-mono text-sm font-semibold text-foreground uppercase tracking-wider">3. Data Storage &amp; Security</h2>
        <p className="font-mono text-xs text-muted-foreground leading-relaxed">
          Your data is stored securely using industry-standard encryption and security practices. We use secure cloud infrastructure to protect your information. However, no method of transmission over the Internet is 100% secure.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-mono text-sm font-semibold text-foreground uppercase tracking-wider">4. Third-Party Services</h2>
        <p className="font-mono text-xs text-muted-foreground leading-relaxed">
          We use third-party APIs (such as pokemontcg.io) to provide market data. These services have their own privacy policies. We also use payment processors for subscription services, which handle payment data according to their own policies.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-mono text-sm font-semibold text-foreground uppercase tracking-wider">5. Cookies &amp; Local Storage</h2>
        <p className="font-mono text-xs text-muted-foreground leading-relaxed">
          We use browser local storage and session storage for authentication tokens and user preferences. We do not use third-party tracking cookies.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-mono text-sm font-semibold text-foreground uppercase tracking-wider">6. Data Sharing</h2>
        <p className="font-mono text-xs text-muted-foreground leading-relaxed">
          We do not sell, trade, or rent your personal information to third parties. We may share anonymized, aggregate data for analytical purposes.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-mono text-sm font-semibold text-foreground uppercase tracking-wider">7. Your Rights</h2>
        <p className="font-mono text-xs text-muted-foreground leading-relaxed">
          You have the right to: access the personal data we hold about you; request correction of inaccurate data; request deletion of your account and associated data; export your portfolio data.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-mono text-sm font-semibold text-foreground uppercase tracking-wider">8. Children's Privacy</h2>
        <p className="font-mono text-xs text-muted-foreground leading-relaxed">
          The Service is not intended for children under 13. We do not knowingly collect personal information from children under 13.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-mono text-sm font-semibold text-foreground uppercase tracking-wider">9. Changes to This Policy</h2>
        <p className="font-mono text-xs text-muted-foreground leading-relaxed">
          We may update this Privacy Policy from time to time. We will notify users of significant changes via the Service.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-mono text-sm font-semibold text-foreground uppercase tracking-wider">10. Contact</h2>
        <p className="font-mono text-xs text-muted-foreground leading-relaxed">
          For privacy-related inquiries, contact us at <a href="mailto:contact@poke-pulse-ticker.com" className="text-primary hover:underline">contact@poke-pulse-ticker.com</a>.
        </p>
      </section>
    </main>
  </>
);

export default Privacy;
