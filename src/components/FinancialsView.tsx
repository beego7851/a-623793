import { Card } from "@/components/ui/card";
import PaymentStatistics from './financials/PaymentStatistics';
import CollectorsSummary from './financials/CollectorsSummary';
import AllPaymentsTable from './financials/AllPaymentsTable';
import { DashboardTabs, DashboardTabsList, DashboardTabsTrigger, DashboardTabsContent } from "@/components/ui/dashboard-tabs";
import MemberStatsView from './members/MemberStatsView';

const FinancialsView = () => {
  return (
    <div className="space-y-6">
      <header className="mb-8">
        <h1 className="text-3xl font-medium mb-2 text-white">Financial Management</h1>
        <p className="text-dashboard-text">View and manage payment requests</p>
      </header>

      <DashboardTabs defaultValue="overview" className="w-full">
        <DashboardTabsList className="grid w-full grid-cols-2 md:grid-cols-4 gap-2 md:gap-0">
          <DashboardTabsTrigger value="overview" className="w-full">Payment Overview</DashboardTabsTrigger>
          <DashboardTabsTrigger value="collectors" className="w-full">Collectors Overview</DashboardTabsTrigger>
          <DashboardTabsTrigger value="payments" className="w-full">All Payments</DashboardTabsTrigger>
          <DashboardTabsTrigger value="stats" className="w-full">Member Stats</DashboardTabsTrigger>
        </DashboardTabsList>

        <DashboardTabsContent value="overview" className="mt-6">
          <PaymentStatistics />
        </DashboardTabsContent>

        <DashboardTabsContent value="collectors" className="mt-6">
          <CollectorsSummary />
        </DashboardTabsContent>

        <DashboardTabsContent value="payments" className="mt-6">
          <AllPaymentsTable />
        </DashboardTabsContent>

        <DashboardTabsContent value="stats" className="mt-6">
          <MemberStatsView />
        </DashboardTabsContent>
      </DashboardTabs>
    </div>
  );
};

export default FinancialsView;