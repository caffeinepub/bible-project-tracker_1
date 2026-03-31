import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Flame, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useSaveProfile } from "../hooks/useQueries";

interface DisplayNameModalProps {
  open: boolean;
  onClose: () => void;
}

export function DisplayNameModal({ open, onClose }: DisplayNameModalProps) {
  const [name, setName] = useState("");
  const saveProfile = useSaveProfile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      await saveProfile.mutateAsync(name.trim());
      toast.success("Welcome to ScriptureFlow!");
      onClose();
    } catch {
      toast.error("Failed to save name. Please try again.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent
        className="bg-card border-border max-w-sm"
        data-ocid="displayname.dialog"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <div className="flex justify-center mb-2">
            <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center">
              <Flame className="w-6 h-6 text-gold" />
            </div>
          </div>
          <DialogTitle className="font-display text-center text-xl text-foreground">
            Welcome to ScriptureFlow
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground">
            Set your display name to get started
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label htmlFor="display-name" className="text-foreground">
              Your Name
            </Label>
            <Input
              id="display-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your display name"
              className="bg-input border-border"
              data-ocid="displayname.input"
              autoFocus
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-gold text-[oklch(0.12_0_0)] hover:bg-gold-dim font-semibold"
            disabled={!name.trim() || saveProfile.isPending}
            data-ocid="displayname.submit_button"
          >
            {saveProfile.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...
              </>
            ) : (
              "Continue"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
