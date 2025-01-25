import { PostgrestError } from '@supabase/supabase-js';

export interface PasswordFormValues {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface PasswordChangeData {
  success: boolean;
  message?: string;
  error?: string;
  code?: string;
  details?: {
    timestamp: string;
    [key: string]: any;
  };
}

export interface PasswordChangeResponse {
  data: PasswordChangeData | null;
  error: PostgrestError | null;
}

// Debug Helpers
export const logPasswordChangeAttempt = (
  memberNumber: string, 
  values: Partial<PasswordFormValues>
) => {
  console.log("[PasswordChange] Attempt Details:", {
    memberNumber,
    hasCurrentPassword: !!values.currentPassword,
    hasNewPassword: !!values.newPassword,
    hasConfirmPassword: !!values.confirmPassword,
    passwordsMatch: values.newPassword === values.confirmPassword,
    timestamp: new Date().toISOString()
  });
};

export const logPasswordChangeResponse = (
  response: PasswordChangeResponse
) => {
  console.log("[PasswordChange] Response:", {
    success: response.data?.success,
    hasError: !!response.error,
    errorMessage: response.error?.message,
    details: response.data?.details,
    timestamp: new Date().toISOString()
  });
};