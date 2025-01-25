import { useState, useEffect } from "react";
import { Key } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { PasswordForm } from "./password/PasswordForm";
import { PasswordRequirements } from "./password/PasswordRequirements";

interface ChangePasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  memberNumber: string;
}

const ChangePasswordDialog = ({
  open,
  onOpenChange,
  memberNumber,
}: ChangePasswordDialogProps) => {
  const [memberName, setMemberName] = useState<string>("Loading...");

  useEffect(() => {
    const fetchMemberName = async () => {
      try {
        const { data, error } = await supabase
          .from('members')
          .select('full_name')
          .eq('member_number', memberNumber)
          .single();

        if (error) {
          console.error('Error fetching member name:', error);
          setMemberName("Unknown Member");
          return;
        }

        setMemberName(data.full_name);
      } catch (error) {
        console.error('Error in fetchMemberName:', error);
        setMemberName("Unknown Member");
      }
    };

    if (open && memberNumber) {
      fetchMemberName();
    }
  }, [open, memberNumber]);

  const handleSuccess = () => {
    console.log("[ChangePasswordDialog] Password change successful, closing dialog");
    onOpenChange(false);
  };

  return (
    <Dialog 
      open={open} 
      onOpenChange={onOpenChange}
    >
      <DialogContent className="w-full max-w-md bg-dashboard-card border border-dashboard-cardBorder">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-dashboard-accent1 flex items-center gap-2">
            <Key className="w-5 h-5" />
            Change Password
          </DialogTitle>
          <div className="text-sm text-dashboard-text mt-2">
            <p className="mb-1">Member: <span className="font-medium">{memberName}</span></p>
            <p>Member Number: <span className="font-medium">{memberNumber}</span></p>
          </div>
        </DialogHeader>

        <PasswordRequirements />
        
        <PasswordForm
          memberNumber={memberNumber}
          onCancel={() => onOpenChange(false)}
          onSuccess={handleSuccess}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ChangePasswordDialog;