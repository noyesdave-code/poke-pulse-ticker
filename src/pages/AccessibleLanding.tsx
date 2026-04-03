import { useNavigate } from "react-router-dom";
import { Eye, ArrowRight, Sun, Type, Zap, Volume2, MousePointer } from "lucide-react";
import TerminalHeader from "@/components/TerminalHeader";
import FinancialDisclaimer from "@/components/FinancialDisclaimer";
import { useAccessibility } from "@/contexts/AccessibilityContext";
import ShareButton from "@/components/ShareButton";
import { useEffect } from "react";

const features = [
  {
    icon: Sun,
    title: "Bright, High-Contrast Colors",
    description: "White backgrounds with deep black text and bold accent colors ensure maximum readability in any lighting condition.",
  },
  {
    icon: Type,
    title: "Extra-Large Text",
    description: "All body text starts at 18px with heavy font weights. Headings use 900-weight for unmistakable hierarchy.",
  },
  {
    icon: Zap,
    title: "No Animations or Distractions",
    description: "All motion, shimmer effects, and parallax are disabled. Content is static and easy to focus on.",
  },
  {
    icon: MousePointer,
    title: "Thick Focus Indicators",
    description: "Every interactive element shows a bold 3px blue outline when focused, making keyboard navigation crystal clear.",
  },
  {
    icon: Volume2,
    title: "Screen Reader Friendly",
    description: "Proper semantic HTML, ARIA labels, and skip navigation ensure compatibility with assistive technologies.",
  },
  {
    icon: Eye,
    title: "Underlined Links",
    description: "All links are underlined by default so they're identifiable without relying on color alone.",
  },
];

const quickLinks = [
  { path: "/", label: "Market Terminal — Live card prices" },
  { path: "/sets", label: "Set Browser — Browse all sets" },
  { path: "/portfolio", label: "Portfolio — Track your collection" },
  { path: "/guides", label: "Guides — Learn card investing" },
  { path: "/pricing", label: "Pricing — Subscription plans" },
  { path: "/contact", label: "Contact — Get in touch" },
];

const AccessibleLanding = () => {
  const navigate = useNavigate();
  const { highContrast, toggleHighContrast } = useAccessibility();

  // Auto-enable high contrast when visiting this page
  useEffect(() => {
    if (!highContrast) {
      toggleHighContrast();
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded-md focus:text-lg focus:font-bold"
      >
        Skip to main content
      </a>

      <TerminalHeader />

      <main id="main-content" className="max-w-4xl mx-auto px-6 py-10 space-y-12">
        {/* Hero */}
        <section className="text-center space-y-6" aria-labelledby="a11y-hero-heading">
          <div className="inline-flex items-center gap-3 bg-primary/10 border-2 border-primary rounded-full px-6 py-2">
            <Eye className="w-6 h-6 text-primary" aria-hidden="true" />
            <span className="text-sm font-bold text-primary uppercase tracking-wider">
              Accessibility Mode Active
            </span>
          </div>

          <h1
            id="a11y-hero-heading"
            className="text-4xl sm:text-5xl font-black text-foreground leading-tight"
            style={{ textShadow: "none" }}
          >
            Poke Pulse Market Terminal
          </h1>

          <p className="text-xl text-foreground max-w-2xl mx-auto leading-relaxed">
            Track Poké card prices with a display designed for
            <strong> maximum visibility</strong>. Large text, high contrast,
            no distracting animations.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <button
              onClick={() => navigate("/")}
              className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground font-bold text-lg rounded-lg px-8 py-4 hover:opacity-90 transition-opacity border-2 border-primary"
            >
              Enter Market Terminal
              <ArrowRight className="w-5 h-5" aria-hidden="true" />
            </button>
            <button
              onClick={toggleHighContrast}
              className="inline-flex items-center justify-center gap-2 bg-muted text-foreground font-bold text-lg rounded-lg px-8 py-4 hover:opacity-90 transition-opacity border-2 border-border"
            >
              {highContrast ? "Switch to Standard Mode" : "Enable High Contrast"}
            </button>
          </div>
        </section>

        {/* Features */}
        <section aria-labelledby="a11y-features-heading" className="space-y-6">
          <h2
            id="a11y-features-heading"
            className="text-2xl font-black text-foreground text-center"
            style={{ textShadow: "none" }}
          >
            What's Different in Accessibility Mode
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className="border-2 border-border rounded-xl p-6 bg-card"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 border-2 border-primary/30 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-primary" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-foreground mb-1">
                        {f.title}
                      </h3>
                      <p className="text-base text-foreground leading-relaxed">
                        {f.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Quick Links */}
        <section aria-labelledby="a11y-links-heading" className="space-y-6">
          <h2
            id="a11y-links-heading"
            className="text-2xl font-black text-foreground text-center"
            style={{ textShadow: "none" }}
          >
            Quick Navigation
          </h2>

          <nav aria-label="Quick navigation links">
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <button
                    onClick={() => navigate(link.path)}
                    className="w-full text-left border-2 border-border rounded-xl p-5 bg-card hover:border-primary transition-colors flex items-center justify-between group"
                  >
                    <span className="text-lg font-bold text-foreground">
                      {link.label}
                    </span>
                    <ArrowRight className="w-5 h-5 text-primary opacity-60 group-hover:opacity-100" aria-hidden="true" />
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </section>

        {/* Help section */}
        <section
          aria-labelledby="a11y-help-heading"
          className="border-2 border-primary rounded-xl p-8 bg-primary/5 text-center space-y-4"
        >
          <h2
            id="a11y-help-heading"
            className="text-2xl font-black text-foreground"
            style={{ textShadow: "none" }}
          >
            Need Additional Help?
          </h2>
          <p className="text-lg text-foreground max-w-xl mx-auto leading-relaxed">
            You can toggle high-contrast mode on any page using the <strong>A11Y</strong> button
            in the top navigation bar. Your preference is saved automatically.
          </p>
          <p className="text-lg text-foreground max-w-xl mx-auto leading-relaxed">
            If you have specific accessibility needs, please{" "}
            <button
              onClick={() => navigate("/contact")}
              className="text-primary font-bold underline underline-offset-4"
            >
              contact us
            </button>{" "}
            and we'll work to accommodate you.
          </p>
        </section>

        <FinancialDisclaimer compact />
      </main>
    </div>
  );
};

export default AccessibleLanding;
