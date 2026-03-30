import { useState, useEffect } from "react";
import FinancialDisclaimer from "@/components/FinancialDisclaimer";
import { useSearchParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, CheckCircle, XCircle, MailX } from "lucide-react";

const Unsubscribe = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"loading" | "valid" | "used" | "invalid" | "success" | "error">("loading");
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    if (!token) {
      setStatus("invalid");
      return;
    }

    const validate = async () => {
      try {
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const anonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
        const res = await fetch(
          `${supabaseUrl}/functions/v1/handle-email-unsubscribe?token=${token}`,
          { headers: { apikey: anonKey } }
        );
        const data = await res.json();
        if (res.ok && data.valid === true) {
          setStatus("valid");
        } else if (data.reason === "already_unsubscribed") {
          setStatus("used");
        } else {
          setStatus("invalid");
        }
      } catch {
        setStatus("invalid");
      }
    };
    validate();
  }, [token]);

  const handleConfirm = async () => {
    if (!token) return;
    setConfirming(true);
    try {
      const { data, error } = await supabase.functions.invoke("handle-email-unsubscribe", {
        body: { token },
      });
      if (error) throw error;
      if (data?.success) {
        setStatus("success");
      } else if (data?.reason === "already_unsubscribed") {
        setStatus("used");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    } finally {
      setConfirming(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="terminal-card max-w-md w-full p-8 text-center space-y-4">
        {status === "loading" && (
          <>
            <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
            <p className="font-mono text-sm text-muted-foreground">Validating your request…</p>
          </>
        )}

        {status === "valid" && (
          <>
            <MailX className="w-10 h-10 text-terminal-amber mx-auto" />
            <h1 className="font-mono text-lg font-bold text-foreground">Unsubscribe</h1>
            <p className="font-mono text-sm text-muted-foreground">
              Are you sure you want to unsubscribe from Poke-Pulse-Ticker email notifications?
            </p>
            <button
              onClick={handleConfirm}
              disabled={confirming}
              className="w-full py-3 px-4 rounded-md bg-destructive text-destructive-foreground font-mono text-sm font-semibold hover:bg-destructive/90 transition-colors disabled:opacity-50"
            >
              {confirming ? "Processing…" : "Confirm Unsubscribe"}
            </button>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle className="w-10 h-10 text-primary mx-auto" />
            <h1 className="font-mono text-lg font-bold text-foreground">Unsubscribed</h1>
            <p className="font-mono text-sm text-muted-foreground">
              You've been unsubscribed from email notifications. You can re-enable them anytime from your profile settings.
            </p>
          </>
        )}

        {status === "used" && (
          <>
            <CheckCircle className="w-10 h-10 text-muted-foreground mx-auto" />
            <h1 className="font-mono text-lg font-bold text-foreground">Already Unsubscribed</h1>
            <p className="font-mono text-sm text-muted-foreground">
              This email has already been unsubscribed.
            </p>
          </>
        )}

        {status === "invalid" && (
          <>
            <XCircle className="w-10 h-10 text-destructive mx-auto" />
            <h1 className="font-mono text-lg font-bold text-foreground">Invalid Link</h1>
            <p className="font-mono text-sm text-muted-foreground">
              This unsubscribe link is invalid or expired.
            </p>
          </>
        )}

        {status === "error" && (
          <>
            <XCircle className="w-10 h-10 text-destructive mx-auto" />
            <h1 className="font-mono text-lg font-bold text-foreground">Something Went Wrong</h1>
            <p className="font-mono text-sm text-muted-foreground">
              We couldn't process your request. Please try again later.
            </p>
          </>
        )}

        <Link to="/" className="inline-block font-mono text-xs text-primary hover:underline mt-4">
          ← Back to Poke-Pulse-Ticker
        </Link>
        <FinancialDisclaimer compact />
      </div>
    </div>
  );
};

export default Unsubscribe;
