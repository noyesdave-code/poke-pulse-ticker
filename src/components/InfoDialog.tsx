import { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface InfoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children?: ReactNode;
}

/**
 * Shared informational dialog used across landing-page widgets to explain
 * categories, indexes, and metrics in plain language.
 */
const InfoDialog = ({ open, onOpenChange, title, description, children }: InfoDialogProps) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="terminal-card max-w-lg max-h-[85vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="font-mono text-base text-foreground">{title}</DialogTitle>
        {description && (
          <DialogDescription className="font-mono text-[11px] text-muted-foreground leading-relaxed">
            {description}
          </DialogDescription>
        )}
      </DialogHeader>
      {children && <div className="mt-3 space-y-3 text-[12px] leading-relaxed">{children}</div>}
    </DialogContent>
  </Dialog>
);

export default InfoDialog;
