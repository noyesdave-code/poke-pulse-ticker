import { usePushNotifications } from "@/hooks/usePushNotifications";
import { Bell, BellOff, BellRing } from "lucide-react";
import { toast } from "sonner";

const PushNotificationToggle = () => {
  const { isSupported, isSubscribed, permission, subscribe, unsubscribe } = usePushNotifications();

  if (!isSupported) return null;

  const handleToggle = async () => {
    if (isSubscribed) {
      await unsubscribe();
      toast.success("Push notifications disabled");
    } else {
      const success = await subscribe();
      if (success) {
        toast.success("Push notifications enabled!");
      } else if (permission === "denied") {
        toast.error("Notifications blocked — enable them in browser settings");
      }
    }
  };

  return (
    <div className="terminal-card p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${isSubscribed ? "bg-primary/20" : "bg-muted"}`}>
            {isSubscribed ? (
              <BellRing className="w-4.5 h-4.5 text-primary" />
            ) : (
              <BellOff className="w-4.5 h-4.5 text-muted-foreground" />
            )}
          </div>
          <div>
            <p className="font-mono text-sm font-semibold text-foreground">Push Notifications</p>
            <p className="font-mono text-[10px] text-muted-foreground">
              {isSubscribed ? "You'll receive price alerts even when the app is closed" : "Enable to get notified about price changes"}
            </p>
          </div>
        </div>
        <button
          onClick={handleToggle}
          className={`relative w-11 h-6 rounded-full transition-colors ${isSubscribed ? "bg-primary" : "bg-muted"}`}
        >
          <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-foreground transition-transform ${isSubscribed ? "translate-x-5" : ""}`} />
        </button>
      </div>
    </div>
  );
};

export default PushNotificationToggle;
