import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { CollectorInfo, UserRole, SyncStatus } from "@/types/collector-roles";

export const useCollectorRoles = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: collectors, isLoading, error, refetch } = useQuery({
    queryKey: ['collectors-roles'],
    queryFn: async () => {
      try {
        const { data: collectorsData, error: collectorsError } = await supabase
          .from('members_collectors')
          .select(`
            *,
            members!inner (
              full_name,
              auth_user_id,
              member_number,
              email,
              phone
            )
          `)
          .eq('active', true);

        if (collectorsError) throw collectorsError;

        const transformedData: CollectorInfo[] = await Promise.all(
          (collectorsData || []).map(async (collector) => {
            const authUserId = collector.members?.[0]?.auth_user_id;
            
            if (!authUserId) {
              console.log(`No auth_user_id found for collector: ${collector.name}`);
              const defaultSyncStatus: SyncStatus = {
                id: crypto.randomUUID(),
                user_id: null,
                sync_started_at: null,
                last_attempted_sync_at: new Date().toISOString(),
                status: 'pending',
                error_message: 'No auth user ID associated',
                store_status: 'pending',
                store_error: 'No auth user ID associated'
              };

              return {
                full_name: collector.name || 'N/A',
                member_number: collector.member_number || '',
                roles: [],
                auth_user_id: null,
                role_details: [],
                email: collector.email || '',
                phone: collector.phone || '',
                prefix: collector.prefix || '',
                number: collector.number || '',
                enhanced_roles: [],
                sync_status: defaultSyncStatus
              };
            }

            const [userRoles, syncStatus] = await Promise.all([
              supabase
                .from('user_roles')
                .select('role, created_at')
                .eq('user_id', authUserId),
              supabase
                .from('sync_status')
                .select('*')
                .eq('user_id', authUserId)
                .maybeSingle()
            ]);

            const defaultSyncStatus: SyncStatus = {
              id: crypto.randomUUID(),
              user_id: authUserId,
              sync_started_at: null,
              last_attempted_sync_at: new Date().toISOString(),
              status: 'pending',
              error_message: null,
              store_status: 'pending',
              store_error: null
            };

            return {
              full_name: collector.name || 'N/A',
              member_number: collector.member_number || '',
              roles: userRoles.data?.map(ur => ur.role as UserRole) || [],
              auth_user_id: authUserId,
              role_details: userRoles.data?.map(ur => ({
                role: ur.role as UserRole,
                created_at: ur.created_at
              })) || [],
              email: collector.email || '',
              phone: collector.phone || '',
              prefix: collector.prefix || '',
              number: collector.number || '',
              enhanced_roles: [],
              sync_status: syncStatus.data || defaultSyncStatus
            };
          })
        );

        return transformedData;
      } catch (err) {
        console.error('Error in collector roles query:', err);
        throw err;
      }
    }
  });

  const handleRoleChange = async (userId: string, role: UserRole, action: 'add' | 'remove') => {
    if (!userId) {
      toast({
        title: "Error",
        description: "No auth user ID associated with this collector",
        variant: "destructive",
      });
      return;
    }

    try {
      if (action === 'add') {
        const { error } = await supabase
          .from('user_roles')
          .insert({ user_id: userId, role });
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('user_roles')
          .delete()
          .eq('user_id', userId)
          .eq('role', role);
        if (error) throw error;
      }

      await queryClient.invalidateQueries({ queryKey: ['collectors-roles'] });
      
      toast({
        title: "Success",
        description: `Role ${action === 'add' ? 'added' : 'removed'} successfully`,
      });
    } catch (error) {
      console.error('Role change error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update role",
        variant: "destructive",
      });
    }
  };

  const handleSync = async (userId: string) => {
    if (!userId) {
      toast({
        title: "Error",
        description: "No auth user ID associated with this collector",
        variant: "destructive",
      });
      return;
    }

    try {
      await supabase.rpc('perform_user_roles_sync');
      await queryClient.invalidateQueries({ queryKey: ['collectors-roles'] });

      toast({
        title: "Success",
        description: "Roles synchronized successfully",
      });
    } catch (error) {
      console.error('Sync error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to sync roles",
        variant: "destructive",
      });
    }
  };

  return {
    collectors,
    isLoading,
    error,
    refetch,
    handleRoleChange,
    handleSync
  };
};