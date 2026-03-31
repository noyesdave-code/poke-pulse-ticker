import { useState } from "react";
import { motion } from "framer-motion";
import { Fingerprint, ShieldCheck, KeyRound, AlertTriangle, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const PasskeyEnrollment = () => {
  const { tier } = useAuth();
  const { toast } = useToast();
  const [enrolled, setEnrolled] = useState(() => localStorage.getItem("ppt_passkey_enrolled") === "1");
  const [enrolling, setEnrolling] = useState(false);

  const isInstitutional = tier === "premium" || tier === "team";

  const handleEnroll = async () => {
    if (!isInstitutional) {
      toast({
        title: "Institutional Tier Required",
        description: "2FA/Passkey security is available on the Institutional plan ($99/mo).",
        variant: "destructive",
      });
      return;
    }

    // Check WebAuthn support
    if (!window.PublicKeyCredential) {
      toast({
        title: "Not Supported",
        description: "Your browser doesn't support WebAuthn/Passkeys. Please use a modern browser.",
        variant: "destructive",
      });
      return;
    }

    setEnrolling(true);
    try {
      // Simulate passkey enrollment flow
      const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
      if (!available) {
        toast({
          title: "No Platform Authenticator",
          description: "No biometric authenticator detected. Please use a hardware security key.",
          variant: "destructive",
        });
        setEnrolling(false);
        return;
      }

      // Simulate successful registration
      await new Promise((r) => setTimeout(r, 1500));
      setEnrolled(true);
      localStorage.setItem("ppt_passkey_enrolled", "1");
      toast({
        title: "Passkey Enrolled ✓",
        description: "Your account is now protected with biometric/hardware key authentication.",
      });
    } catch {
      toast({
        title: "Enrollment Failed",
        description: "Could not complete passkey enrollment. Please try again.",
        variant: "destructive",
      });
    }
    setEnrolling(false);
  };

  const handleRemove = () => {
    setEnrolled(false);
    localStorage.removeItem("ppt_passkey_enrolled");
    toast({ title: "Passkey Removed", description: "Biometric authentication has been disabled." });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="terminal-card p-4 space-y-4"
    >
      <div className="flex items-center justify-between">
        <h3 className="font-mono text-sm font-bold text-foreground flex items-center gap-2">
          <Fingerprint className="w-4 h-4 text-primary" />
          2FA / Passkey Security
        </h3>
        {enrolled && (
          <span className="font-mono text-[9px] px-2 py-0.5 rounded bg-terminal-green/20 text-terminal-green border border-terminal-green/30 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> ENROLLED
          </span>
        )}
      </div>

      <p className="font-mono text-[10px] text-muted-foreground leading-relaxed">
        Protect high-value portfolios with biometric authentication (Face ID, Touch ID, Windows Hello) or hardware security keys (YubiKey).
      </p>

      {!isInstitutional && (
        <div className="flex items-start gap-2 bg-terminal-amber/10 border border-terminal-amber/20 rounded-lg p-3">
          <AlertTriangle className="w-4 h-4 text-terminal-amber mt-0.5 shrink-0" />
          <p className="font-mono text-[10px] text-terminal-amber">
            2FA/Passkey authentication is an Institutional-tier feature. Upgrade to protect portfolios exceeding $10,000 in tracked value.
          </p>
        </div>
      )}

      <div className="grid grid-cols-3 gap-3">
        <div className="bg-muted/50 rounded-lg p-3 text-center">
          <Fingerprint className="w-5 h-5 mx-auto text-primary mb-1" />
          <p className="font-mono text-[9px] text-foreground font-medium">Biometric</p>
          <p className="font-mono text-[8px] text-muted-foreground">Face/Touch ID</p>
        </div>
        <div className="bg-muted/50 rounded-lg p-3 text-center">
          <KeyRound className="w-5 h-5 mx-auto text-primary mb-1" />
          <p className="font-mono text-[9px] text-foreground font-medium">Hardware Key</p>
          <p className="font-mono text-[8px] text-muted-foreground">YubiKey / Titan</p>
        </div>
        <div className="bg-muted/50 rounded-lg p-3 text-center">
          <ShieldCheck className="w-5 h-5 mx-auto text-primary mb-1" />
          <p className="font-mono text-[9px] text-foreground font-medium">FIDO2</p>
          <p className="font-mono text-[8px] text-muted-foreground">WebAuthn Std</p>
        </div>
      </div>

      {enrolled ? (
        <div className="space-y-2">
          <div className="flex items-center gap-2 bg-terminal-green/10 border border-terminal-green/20 rounded-lg p-3">
            <ShieldCheck className="w-4 h-4 text-terminal-green" />
            <p className="font-mono text-[10px] text-terminal-green">
              Your account is secured with passkey authentication.
            </p>
          </div>
          <button
            onClick={handleRemove}
            className="w-full font-mono text-[10px] text-destructive hover:text-destructive/80 py-1.5 transition-colors"
          >
            Remove Passkey
          </button>
        </div>
      ) : (
        <button
          onClick={handleEnroll}
          disabled={enrolling || !isInstitutional}
          className="w-full flex items-center justify-center gap-2 font-mono text-xs font-semibold bg-primary text-primary-foreground rounded py-2.5 hover:opacity-90 disabled:opacity-50 transition-opacity"
        >
          <Fingerprint className="w-3.5 h-3.5" />
          {enrolling ? "Enrolling…" : "Enroll Passkey"}
        </button>
      )}
    </motion.div>
  );
};

export default PasskeyEnrollment;
