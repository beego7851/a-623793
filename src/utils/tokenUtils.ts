import { supabase } from "@/integrations/supabase/client";

export const generateResetToken = async (memberNumber: string) => {
  try {
    const { data, error } = await supabase
      .rpc('generate_password_reset_token', { 
        p_member_number: memberNumber 
      });

    if (error) throw error;
    return { token: data, error: null };
  } catch (error) {
    console.error('Error generating reset token:', error);
    return { token: null, error };
  }
};

export const validateResetToken = async (token: string) => {
  try {
    const { data, error } = await supabase
      .rpc('validate_reset_token', { 
        token_value: token 
      });

    if (error) throw error;
    return { isValid: data, error: null };
  } catch (error) {
    console.error('Error validating reset token:', error);
    return { isValid: false, error };
  }
};

export const useResetToken = async (token: string) => {
  try {
    const { data, error } = await supabase
      .rpc('use_reset_token', { 
        token_value: token 
      });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error using reset token:', error);
    return { data: null, error };
  }
};

export const cleanupExpiredTokens = async () => {
  try {
    const { data, error } = await supabase.functions.invoke('cleanup-tokens');
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error cleaning up tokens:', error);
    return { data: null, error };
  }
};