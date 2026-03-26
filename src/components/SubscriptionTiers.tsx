const tiers = [
  {
    name: "FREE",
    price: "$0",
    period: "forever",
    description: "Basic market access for casual collectors",
    features: [
      "Raw card market ticker (delayed 15 min)",
      "Top 12 movers dashboard",
      "Daily market summary",
      "Community access",
    ],
    cta: "Get Started",
    highlight: false,
  },
  {
    name: "PRO",
    price: "$19",
    period: "/month",
    description: "Real-time data for serious traders",
    features: [
      "Everything in Free",
      "Real-time raw card ticker",
      "Real-time graded card ticker",
      "Real-time sealed product ticker",
      "Full card board (500+ cards)",
      "Price alerts & notifications",
      "Historical price charts",
    ],
    cta: "Subscribe to Pro",
    highlight: true,
  },
  {
    name: "INSTITUTIONAL",
    price: "$99",
    period: "/month",
    description: "Enterprise-grade analytics for dealers & shops",
    features: [
      "Everything in Pro",
      "API access for custom integrations",
      "Arbitrage scanner",
      "Portfolio tracking & P&L",
      "Bulk export (CSV/JSON)",
      "Priority support",
      "Custom watchlists (unlimited)",
    ],
    cta: "Contact Sales",
    highlight: false,
  },
];

const SubscriptionTiers = () => {
  return (
    <section className="py-16 px-4">
      <div className="text-center mb-12">
        <h2 className="font-mono text-xs tracking-[0.3em] text-secondary uppercase font-semibold mb-3">
          Subscription Plans
        </h2>
        <p className="font-mono text-2xl font-bold text-foreground mb-2">
          Upgrade Your Market Intelligence
        </p>
        <p className="text-sm text-muted-foreground max-w-lg mx-auto">
          From casual collectors to institutional dealers — pick the plan that matches your trading volume.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {tiers.map((tier) => (
          <div
            key={tier.name}
            className={`terminal-card p-6 flex flex-col ${
              tier.highlight
                ? "border-t-2 border-t-primary glow-green"
                : ""
            }`}
          >
            <div className="mb-4">
              <span className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
                {tier.name}
              </span>
            </div>
            <div className="mb-1 flex items-baseline gap-1">
              <span className="font-mono text-3xl font-bold text-foreground">{tier.price}</span>
              <span className="font-mono text-sm text-muted-foreground">{tier.period}</span>
            </div>
            <p className="text-xs text-muted-foreground mb-6">{tier.description}</p>
            <ul className="space-y-2.5 mb-8 flex-1">
              {tier.features.map((f, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                  <span className="text-primary mt-0.5 text-xs">✓</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <button
              className={`w-full py-2.5 rounded font-mono text-sm font-semibold transition-all ${
                tier.highlight
                  ? "bg-primary text-primary-foreground hover:opacity-90"
                  : "border border-border text-foreground hover:bg-muted"
              }`}
            >
              {tier.cta}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SubscriptionTiers;
