import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { useCopyProtection } from "@/hooks/useCopyProtection";
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
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AnimatedRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  );
};

export default App;
