import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

export interface NotificationPreferences {
  id: string;
  user_id: string;
  email_portfolio_alerts: boolean;
  alert_threshold: number;
  created_at: string;
  updated_at: string;
}

export function useNotificationPreferences() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["notification-preferences", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notification_preferences")
        .select("*")
        .maybeSingle();
      if (error) throw error;
      return data as NotificationPreferences | null;
    },
    enabled: !!user,
  });
}

export function useUpsertNotificationPreferences() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (prefs: {
      email_portfolio_alerts?: boolean;
      alert_threshold?: number;
    }) => {
      if (!user) throw new Error("Not authenticated");
      const { error } = await supabase
        .from("notification_preferences")
        .upsert(
          {
            user_id: user.id,
            ...prefs,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id" }
        );
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notification-preferences"] });
      toast({ title: "Preferences saved" });
    },
    onError: (err: Error) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });
}
