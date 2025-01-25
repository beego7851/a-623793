import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Lock, Loader2 } from "lucide-react";
import { PasswordInput } from "./PasswordInput";
import { usePasswordChange } from "./usePasswordChange";
import { PasswordFormValues } from "./types";

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least one special character"),
  confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

interface PasswordFormProps {
  onSubmit?: (values: PasswordFormValues) => Promise<void>;
  memberNumber: string;
  onCancel?: () => void;
  onSuccess?: () => void;
  hideCurrentPassword?: boolean;
}

export const PasswordForm = ({
  onSubmit,
  memberNumber,
  onCancel,
  onSuccess,
  hideCurrentPassword = false,
}: PasswordFormProps) => {
  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  const { isSubmitting, handlePasswordChange } = usePasswordChange(memberNumber, onSuccess);

  const handleFormSubmit = async (values: PasswordFormValues) => {
    try {
      console.log("[PasswordForm] Submitting form...");
      if (onSubmit) {
        await onSubmit(values);
      } else {
        const result = await handlePasswordChange(values);
        if (result && result.success) {
          console.log("[PasswordForm] Password change successful");
          form.reset();
          if (onSuccess) {
            onSuccess();
          }
        }
      }
    } catch (error) {
      console.error("[PasswordForm] Submit error:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
        {!hideCurrentPassword && (
          <PasswordInput
            form={form}
            name="currentPassword"
            label="Current Password"
            disabled={isSubmitting}
            required
          />
        )}
        
        <PasswordInput
          form={form}
          name="newPassword"
          label="New Password"
          disabled={isSubmitting}
          required
        />

        <PasswordInput
          form={form}
          name="confirmPassword"
          label="Confirm Password"
          disabled={isSubmitting}
          required
        />

        <div className="flex justify-end space-x-4 pt-4">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
              className="bg-dashboard-dark hover:bg-dashboard-cardHover hover:text-white border-dashboard-cardBorder transition-all duration-200"
            >
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-[#9b87f5] text-white hover:bg-[#7E69AB] transition-all duration-200 flex items-center gap-2"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Lock className="w-4 h-4" />
            )}
            {isSubmitting ? "Changing..." : "Change Password"}
          </Button>
        </div>
      </form>
    </Form>
  );
};