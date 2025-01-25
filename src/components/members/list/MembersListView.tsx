import { useState } from "react";
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import CollectorMemberPayments from '../CollectorMemberPayments';
import MembersListContent from './MembersListContent';
import { DashboardTabs, DashboardTabsList, DashboardTabsTrigger, DashboardTabsContent } from "@/components/ui/dashboard-tabs";
import CollectorPaymentSummary from '@/components/CollectorPaymentSummary';
import RoleBasedRenderer from '@/components/RoleBasedRenderer';
import NotesList from '../notes/NotesList';
import { useToast } from "@/hooks/use-toast";

interface MembersListViewProps {
  searchTerm: string;
  userRole: string | null;
  collectorInfo: any;
}

const MembersListView = ({ searchTerm, userRole, collectorInfo }: MembersListViewProps) => {
  const [page, setPage] = useState(1);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const ITEMS_PER_PAGE = 20;
  const { toast } = useToast();

  const { data: membersData, isLoading, refetch } = useQuery({
    queryKey: ['members', searchTerm, userRole, page, collectorInfo?.name],
    queryFn: async () => {
      console.log('Fetching members with search term:', searchTerm);
      console.log('Collector info:', collectorInfo);
      
      // First get total count
      let countQuery = supabase
        .from('members')
        .select('*', { count: 'exact', head: true });
      
      if (searchTerm) {
        countQuery = countQuery.or(`full_name.ilike.%${searchTerm}%,member_number.ilike.%${searchTerm}%,collector.ilike.%${searchTerm}%`);
      }

      // If user is a collector, only show their assigned members
      if (userRole === 'collector' && collectorInfo?.name) {
        countQuery = countQuery.eq('collector', collectorInfo.name);
      }
      
      const { count } = await countQuery;
      const totalCount = count || 0;
      
      // Calculate safe pagination values
      const maxPage = Math.ceil(totalCount / ITEMS_PER_PAGE);
      const safePage = Math.min(page, maxPage);
      const safeOffset = (safePage - 1) * ITEMS_PER_PAGE;
      
      // Fetch paginated data
      let query = supabase
        .from('members')
        .select('*');
      
      if (searchTerm) {
        query = query.or(`full_name.ilike.%${searchTerm}%,member_number.ilike.%${searchTerm}%,collector.ilike.%${searchTerm}%`);
      }

      // If user is a collector, only show their assigned members
      if (userRole === 'collector' && collectorInfo?.name) {
        query = query.eq('collector', collectorInfo.name);
      }
      
      const { data, error } = await query
        .order('created_at', { ascending: false })
        .range(safeOffset, safeOffset + ITEMS_PER_PAGE - 1);
      
      if (error) throw error;
      
      return {
        members: data,
        totalCount,
        currentPage: safePage
      };
    },
  });

  const handleEditClick = (memberId: string) => {
    setSelectedMemberId(memberId);
    // Add your edit logic here
  };

  const handleDeleteClick = async (memberId: string) => {
    try {
      const { error } = await supabase
        .from('members')
        .delete()
        .eq('id', memberId);

      if (error) throw error;

      toast({
        title: "Member deleted",
        description: "Member has been successfully deleted",
      });

      refetch(); // Refresh the members list
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <DashboardTabs defaultValue="members" className="w-full">
      <DashboardTabsList className="w-full grid grid-cols-1 sm:grid-cols-3 gap-0">
        {userRole === 'collector' && (
          <>
            <DashboardTabsTrigger value="summary">Summary</DashboardTabsTrigger>
            <DashboardTabsTrigger value="payments">Payments</DashboardTabsTrigger>
          </>
        )}
        <DashboardTabsTrigger value="members">Members List</DashboardTabsTrigger>
        <RoleBasedRenderer allowedRoles={['admin']}>
          <DashboardTabsTrigger value="notes">Notes</DashboardTabsTrigger>
        </RoleBasedRenderer>
      </DashboardTabsList>

      {userRole === 'collector' && collectorInfo && (
        <>
          <DashboardTabsContent value="summary">
            <CollectorPaymentSummary collectorName={collectorInfo.name} />
          </DashboardTabsContent>

          <DashboardTabsContent value="payments">
            <CollectorMemberPayments collectorName={collectorInfo.name} />
          </DashboardTabsContent>
        </>
      )}

      <DashboardTabsContent value="members">
        <MembersListContent
          members={membersData?.members || []}
          isLoading={isLoading}
          userRole={userRole}
          currentPage={page}
          totalPages={Math.ceil((membersData?.totalCount || 0) / ITEMS_PER_PAGE)}
          onPageChange={setPage}
          onEditClick={handleEditClick}
          onDeleteClick={handleDeleteClick}
        />
      </DashboardTabsContent>

      <RoleBasedRenderer allowedRoles={['admin']}>
        <DashboardTabsContent value="notes">
          <div className="text-center text-dashboard-muted py-8">
            Loading notes...
          </div>
        </DashboardTabsContent>
      </RoleBasedRenderer>
    </DashboardTabs>
  );
};

export default MembersListView;