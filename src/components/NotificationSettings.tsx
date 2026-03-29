import { useState, useEffect } from "react";
import { Bell, BellOff, Mail } from "lucide-react";
import { motion } from "framer-motion";
import { useNotificationPreferences, useUpsertNotificationPreferences } from "@/hooks/useNotificationPreferences";
import { useAuth } from "@/contexts/AuthContext";

const NotificationSettings = () => {
  const { user } = useAuth();
  const { data: prefs, isLoading } = useNotificationPreferences();
  const upsert = useUpsertNotificationPreferences();
  
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [threshold, setThreshold] = useState(5);

  useEffect(() => {
    if (prefs) {
      setEmailAlerts(prefs.email_portfolio_alerts);
      setThreshold(prefs.alert_threshold);
    }
  }, [prefs]);

  if (!user) return null;

  const handleToggle = () => {
    const newVal = !emailAlerts;
    setEmailAlerts(newVal);
    upsert.mutate({ email_portfolio_alerts: newVal });
  };

  const handleThresholdChange = (val: number) => {
    setThreshold(val);
    upsert.mutate({ alert_threshold: val });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="terminal-card overflow-hidden"
    >
      <div className="border-b border-border px-4 py-3 flex items-center justify-between">
        <h3 className="font-mono text-xs tracking-widest text-secondary uppercase font-semibold flex items-center gap-2">
          <Mail className="w-3.5 h-3.5" /> Email Notifications
        </h3>
        {isLoading && (
          <span className="font-mono text-[9px] text-muted-foreground animate-pulse">Loading…</span>
        )}
      </div>

      <div className="p-4 space-y-4">
        {/* Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-md flex items-center justify-center transition-colors ${emailAlerts ? 'bg-primary/15' : 'bg-muted'}`}>
              {emailAlerts ? (
                <Bell className="w-4 h-4 text-primary" />
              ) : (
                <BellOff className="w-4 h-4 text-muted-foreground" />
              )}
            </div>
            <div>
              <p className="font-mono text-xs font-semibold text-foreground">Portfolio Price Alerts</p>
              <p className="font-mono text-[9px] text-muted-foreground">
                Get emailed when cards move significantly
              </p>
            </div>
          </div>
          <button
            onClick={handleToggle}
            disabled={upsert.isPending}
            className={`relative w-11 h-6 rounded-full transition-colors ${emailAlerts ? 'bg-primary' : 'bg-muted'}`}
          >
            <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-foreground transition-transform ${emailAlerts ? 'translate-x-5' : 'translate-x-0'}`} />
          </button>
        </div>

        {/* Threshold */}
        {emailAlerts && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2 pl-11"
          >
            <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">
              Alert Threshold
            </p>
            <div className="flex items-center gap-3">
              {[3, 5, 10, 15].map((val) => (
                <button
                  key={val}
                  onClick={() => handleThresholdChange(val)}
                  className={`px-3 py-1.5 rounded font-mono text-[10px] font-semibold transition-colors ${
                    threshold === val
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  ±{val}%
                </button>
              ))}
            </div>
            <p className="font-mono text-[9px] text-muted-foreground">
              You'll be notified when any card in your portfolio moves more than {threshold}% in a day.
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default NotificationSettings;
