import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { AccessibilityProvider } from "@/contexts/AccessibilityContext";
import { useCopyProtection } from "@/hooks/useCopyProtection";
import Watermark from "@/components/Watermark";
import CopyrightBanner from "@/components/CopyrightBanner";
import CookieConsent from "@/components/CookieConsent";
import { AnimatePresence, motion } from "framer-motion";
import Index from "./pages/Index.tsx";
import CardDetail from "./pages/CardDetail.tsx";
import SetBrowser from "./pages/SetBrowser.tsx";
import Portfolio from "./pages/Portfolio.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import Terms from "./pages/Terms.tsx";
import Privacy from "./pages/Privacy.tsx";
import Guides from "./pages/Guides.tsx";
import CommandCenter from "./pages/CommandCenter.tsx";
import ReleaseCalendar from "./pages/ReleaseCalendar.tsx";
import Watchlist from "./pages/Watchlist.tsx";
import Contact from "./pages/Contact.tsx";
import PriceAlerts from "./pages/PriceAlerts.tsx";
import SetCompletion from "./pages/SetCompletion.tsx";
import ProfilePage from "./pages/Profile.tsx";
import PublicProfile from "./pages/PublicProfile.tsx";
import NotFound from "./pages/NotFound.tsx";
import Blog from "./pages/Blog.tsx";
import BlogPost from "./pages/BlogPost.tsx";
import BlogEditor from "./pages/BlogEditor.tsx";
import TradeCalculator from "./pages/TradeCalculator.tsx";
import Pricing from "./pages/Pricing.tsx";
import Methodology from "./pages/Methodology.tsx";
import Unsubscribe from "./pages/Unsubscribe.tsx";
import AccessibleLanding from "./pages/AccessibleLanding.tsx";
import SocialLanding from "./pages/SocialLanding.tsx";

const queryClient = new QueryClient();

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
      >
        <Routes location={location}>
          <Route path="/" element={<Index />} />
          <Route path="/card/:slug" element={<CardDetail />} />
          <Route path="/sets" element={<SetBrowser />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/command-center" element={<CommandCenter />} />
          <Route path="/releases" element={<ReleaseCalendar />} />
          <Route path="/watchlist" element={<Watchlist />} />
          <Route path="/alerts" element={<PriceAlerts />} />
          <Route path="/set-completion" element={<SetCompletion />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/profile/:userId" element={<PublicProfile />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/guides" element={<Guides />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/blog-editor" element={<BlogEditor />} />
          <Route path="/trade" element={<TradeCalculator />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/methodology" element={<Methodology />} />
          <Route path="/unsubscribe" element={<Unsubscribe />} />
          <Route path="/accessible" element={<AccessibleLanding />} />
          <Route path="/go" element={<SocialLanding />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
};

const App = () => {
  useCopyProtection();
  return (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Watermark />
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AccessibilityProvider>
            <AnimatedRoutes />
            <CopyrightBanner />
            <CookieConsent />
          </AccessibilityProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  );
};

export default App;
