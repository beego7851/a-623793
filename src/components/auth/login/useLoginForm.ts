import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from '@tanstack/react-query';
import { clearAuthState, verifyMember, handleSignInError } from './utils/authUtils';
import { DatabaseFunctions } from '@/integrations/supabase/types/functions';

type FailedLoginResponse = DatabaseFunctions['handle_failed_login']['Returns'];

export const useLoginForm = () => {
  const [memberNumber, setMemberNumber] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading || !memberNumber.trim() || !password.trim()) return;
    
    try {
      setLoading(true);
      const isMobile = window.innerWidth <= 768;
      console.log('Starting login process on device type:', isMobile ? 'mobile' : 'desktop');

      // Check maintenance mode first
      const { data: maintenanceData, error: maintenanceError } = await supabase
        .from('maintenance_settings')
        .select('is_enabled, message')
        .single();

      if (maintenanceError) {
        console.error('Error checking maintenance mode:', maintenanceError);
        throw new Error('Unable to verify system status');
      }

      // If in maintenance, verify if user is admin before proceeding
      if (maintenanceData?.is_enabled) {
        console.log('System in maintenance mode, checking admin credentials');
        const email = `${memberNumber.toLowerCase()}@temp.com`;
        
        // Try admin login
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) {
          console.log('Login failed during maintenance mode');
          throw new Error(maintenanceData.message || 'System is temporarily offline for maintenance');
        }

        // Check if user is admin
        const { data: roles } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', signInData.user.id);

        const isAdmin = roles?.some(r => r.role === 'admin');
        
        if (!isAdmin) {
          console.log('Non-admin access attempted during maintenance');
          throw new Error(maintenanceData.message || 'System is temporarily offline for maintenance');
        }

        console.log('Admin access granted during maintenance mode');
      }

      // Regular login flow
      const member = await verifyMember(memberNumber);
      const email = `${memberNumber.toLowerCase()}@temp.com`;
      
      console.log('Attempting sign in with:', { email });
      
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        // Handle failed login attempt
        const { data: failedLoginData, error: failedLoginError } = await supabase
          .rpc('handle_failed_login', { member_number: memberNumber });

        if (failedLoginError) throw failedLoginError;

        const typedFailedLoginData = failedLoginData as FailedLoginResponse;

        if (typedFailedLoginData.locked) {
          throw new Error(`Account locked. Too many failed attempts. Please try again after ${typedFailedLoginData.lockout_duration}`);
        }

        throw new Error('Invalid member number or password');
      }

      // Reset failed login attempts on successful login
      await supabase.rpc('reset_failed_login', { member_number: memberNumber });

      // Check if password reset is required
      const { data: memberData } = await supabase
        .from('members')
        .select('password_reset_required')
        .eq('member_number', memberNumber)
        .maybeSingle();

      if (memberData?.password_reset_required) {
        toast({
          title: "Password reset required",
          description: "Please set a new password for your account",
        });
        // TODO: Implement password reset flow
        return;
      }

      await queryClient.cancelQueries();
      await queryClient.clear();

      console.log('Verifying session...');
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Session verification error:', sessionError);
        throw sessionError;
      }

      if (!session) {
        console.error('No session established');
        throw new Error('Failed to establish session');
      }

      console.log('Session established successfully');
      await queryClient.invalidateQueries();

      toast({
        title: "Login successful",
        description: "Welcome back!",
      });

      if (isMobile) {
        window.location.href = '/';
      } else {
        navigate('/', { replace: true });
      }
    } catch (error: any) {
      console.error('Login error:', error);
      
      toast({
        title: "Login failed",
        description: error.message || 'An unexpected error occurred',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    memberNumber,
    password,
    setMemberNumber,
    setPassword,
    loading,
    handleLogin,
  };
};