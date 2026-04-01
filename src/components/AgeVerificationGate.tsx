import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Shield, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Props {
  onVerified: () => void;
}

export default function AgeVerificationGate({ onVerified }: Props) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [dob, setDob] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleVerify = async () => {
    if (!user || !dob || !confirmed) return;

    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    if (age < 18) {
      toast({
        title: "Age Requirement Not Met",
        description: "You must be 18 or older to use the chat feature.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          date_of_birth: dob,
          chat_age_verified: true,
        } as any)
        .eq("id", user.id);
      if (error) throw error;
      toast({ title: "✅ Age verified!", description: "You now have access to chat." });
      onVerified();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="max-w-md mx-auto border-primary/30">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary" />
          Age Verification Required
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground">
            Chat is restricted to users <strong>18 years or older</strong>. 
            Please provide your date of birth and confirm your age to continue.
          </p>
        </div>

        <div>
          <label className="text-xs font-semibold text-muted-foreground mb-1 block">Date of Birth</label>
          <Input
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            max={new Date().toISOString().split("T")[0]}
            className="bg-muted/30"
          />
        </div>

        <div className="flex items-start gap-3">
          <Checkbox
            id="age-confirm"
            checked={confirmed}
            onCheckedChange={(v) => setConfirmed(v === true)}
          />
          <label htmlFor="age-confirm" className="text-xs text-muted-foreground leading-relaxed cursor-pointer">
            I confirm that I am <strong>18 years of age or older</strong> and agree to the 
            community chat guidelines. I understand that inappropriate behavior will result 
            in a permanent ban.
          </label>
        </div>

        <Button
          onClick={handleVerify}
          disabled={!dob || !confirmed || submitting}
          className="w-full font-bold"
        >
          {submitting ? "Verifying..." : "Verify Age & Access Chat"}
        </Button>

        <p className="text-[10px] text-muted-foreground text-center">
          Your date of birth is stored securely and used only for age verification. 
          © {new Date().getFullYear()} PGVA Ventures, LLC.
        </p>
      </CardContent>
    </Card>
  );
}
