import { Database } from "@/integrations/supabase/types";
import { useRoleStore } from '@/store/roleStore';
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { hasRole, hasAnyRole, canAccessTab } from '@/utils/roleUtils';

export type UserRole = Database['public']['Enums']['app_role'];

export const useRoleAccess = () => {
  const { toast } = useToast();
  const {
    userRole,
    userRoles,
    isLoading: roleLoading,
    error,
    permissions,
    setUserRole,
    setUserRoles,
    setIsLoading,
    setError
  } = useRoleStore();

  const { refetch } = useQuery({
    queryKey: ['userRoles'],
    queryFn: async () => {
      console.log('[RoleAccess] Starting role fetch process...');
      setIsLoading(true);
      
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          console.log('[RoleAccess] No authenticated session found');
          setUserRoles(null);
          setUserRole(null);
          return null;
        }

        console.log('[RoleAccess] Fetching roles for user:', {
          userId: session.user.id,
          email: session.user.email,
          timestamp: new Date().toISOString()
        });

        const { data: roleData, error: rolesError } = await supabase
          .from('user_roles')
          .select('*')
          .eq('user_id', session.user.id);

        if (rolesError) throw rolesError;

        console.log('[RoleAccess] Raw role data:', roleData);

        const userRoles = roleData?.map(r => r.role as UserRole) || ['member'];
        console.log('[RoleAccess] Mapped roles:', userRoles);

        // Set primary role (admin > collector > member)
        const primaryRole = userRoles.includes('admin' as UserRole) 
          ? 'admin' as UserRole 
          : userRoles.includes('collector' as UserRole)
            ? 'collector' as UserRole
            : 'member' as UserRole;

        console.log('[RoleAccess] Final role determination:', {
          userRole: primaryRole,
          userRoles,
          timestamp: new Date().toISOString()
        });
        
        setUserRoles(userRoles);
        setUserRole(primaryRole);
        return userRoles;
      } catch (error: any) {
        console.error('[RoleAccess] Role fetch error:', error);
        toast({
          title: "Error fetching roles",
          description: "There was a problem loading your permissions. Please try again.",
          variant: "destructive",
        });
        setError(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchInterval: 5000 // Poll every 5 seconds
  });

  return {
    userRole,
    userRoles,
    roleLoading,
    error,
    permissions,
    hasRole: (role: UserRole) => hasRole(userRoles, role),
    hasAnyRole: (roles: UserRole[]) => hasAnyRole(userRoles, roles),
    canAccessTab: (tab: string) => canAccessTab(tab, userRoles),
    refetchRoles: refetch
  };
};