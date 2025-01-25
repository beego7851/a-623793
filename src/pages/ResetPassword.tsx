import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { PasswordForm } from "@/components/auth/password/PasswordForm";
import { PasswordRequirements } from "@/components/auth/password/PasswordRequirements";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [isValidToken, setIsValidToken] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setIsValidToken(false);
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .rpc('validate_reset_token', { token_value: token });

        if (error) throw error;
        setIsValidToken(!!data);
      } catch (error: any) {
        console.error('Token validation error:', error);
        setIsValidToken(false);
        toast({
          title: "Invalid Reset Link",
          description: "This password reset link is invalid or has expired.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    validateToken();
  }, [token, toast]);

  const handleSuccess = () => {
    toast({
      title: "Password Reset Successful",
      description: "Your password has been successfully reset. Please login with your new password.",
    });
    navigate('/login');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-dashboard-dark">
        <Loader2 className="w-8 h-8 animate-spin text-dashboard-accent1" />
      </div>
    );
  }

  if (!isValidToken) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-dashboard-dark p-4">
        <Alert className="max-w-md bg-dashboard-card border-dashboard-error/50">
          <AlertTitle className="text-xl font-semibold text-white mb-2">
            Invalid Reset Link
          </AlertTitle>
          <AlertDescription className="text-dashboard-text">
            This password reset link is invalid or has expired. Please request a new password reset link.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dashboard-dark flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">
            Reset Your Password
          </h1>
          <p className="text-dashboard-text">
            Please enter your new password below
          </p>
        </div>

        <div className="bg-dashboard-card p-6 rounded-lg border border-dashboard-cardBorder space-y-6">
          <PasswordRequirements />
          <PasswordForm
            onSuccess={handleSuccess}
            memberNumber=""
            hideCurrentPassword
          />
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;