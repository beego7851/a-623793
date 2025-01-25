import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ForgotPasswordDialog } from "./ForgotPasswordDialog";

export const ForgotPasswordButton = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        type="button"
        variant="secondary"
        onClick={() => setOpen(true)}
        className="w-full bg-dashboard-accent2 text-white hover:bg-dashboard-accent2/80"
      >
        Forgot Password?
      </Button>
      <ForgotPasswordDialog open={open} onOpenChange={setOpen} />
    </>
  );
};