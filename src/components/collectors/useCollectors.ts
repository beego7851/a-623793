import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

type UserRole = Database['public']['Enums']['app_role'];

export const useCollectors = (page: number, itemsPerPage: number) => {
  return useQuery({
    queryKey: ['members_collectors', page],
    queryFn: async () => {
      console.log('Fetching collectors from members_collectors...');
      const from = (page - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;

      // First fetch collectors
      const { data: collectorsData, error: collectorsError, count } = await supabase
        .from('members_collectors')
        .select('*', { count: 'exact' })
        .eq('active', true)
        .order('number', { ascending: true })
        .range(from, to);
      
      if (collectorsError) {
        console.error('Error fetching collectors:', collectorsError);
        throw collectorsError;
      }

      if (!collectorsData) return { data: [], count: 0 };

      const collectorsWithCounts = await Promise.all(collectorsData.map(async (collector) => {
        // Get member count for this collector
        const { count } = await supabase
          .from('members')
          .select('*', { count: 'exact', head: true })
          .eq('collector', collector.name);

        // Get member data if member_number exists
        let memberData = null;
        if (collector.member_number) {
          const { data: member } = await supabase
            .from('members')
            .select('auth_user_id')
            .eq('member_number', collector.member_number)
            .single();
          memberData = member;
        }

        // Get enhanced roles if we have auth_user_id
        let enhancedRoles = [];
        let syncStatus = null;
        if (memberData?.auth_user_id) {
          const { data: roles } = await supabase
            .from('enhanced_roles')
            .select('*')
            .eq('user_id', memberData.auth_user_id);
          
          const { data: sync } = await supabase
            .from('sync_status')
            .select('*')
            .eq('user_id', memberData.auth_user_id)
            .single();
          
          enhancedRoles = roles || [];
          syncStatus = sync;
        }

        // Get user roles if we have auth_user_id
        let roles: UserRole[] = [];
        if (memberData?.auth_user_id) {
          const { data: rolesData } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', memberData.auth_user_id);
          roles = rolesData?.map(r => r.role as UserRole) || [];
        }

        return {
          ...collector,
          memberCount: count || 0,
          roles,
          enhanced_roles: enhancedRoles?.map(role => ({
            role_name: role.role_name,
            is_active: role.is_active || false
          })) || [],
          syncStatus
        };
      }));

      return {
        data: collectorsWithCounts,
        count: count || 0
      };
    },
  });
};