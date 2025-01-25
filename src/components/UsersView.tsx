import { useState } from "react";
import { Card } from "@/components/ui/card";
import MembersListView from './members/list/MembersListView';
import { useRoleStore } from "@/store/roleStore";
import MembersListFilters from "./members/list/MembersListFilters";

const UsersView = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { userRole } = useRoleStore();

  return (
    <div className="space-y-6">
      <header className="mb-8">
        <h1 className="text-3xl font-medium mb-2 text-white">User Management</h1>
        <p className="text-dashboard-text">View and manage member accounts</p>
      </header>

      <MembersListFilters 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      <Card className="p-6 bg-dashboard-card border-dashboard-cardBorder">
        <MembersListView 
          searchTerm={searchTerm}
          userRole={userRole}
          collectorInfo={null}
        />
      </Card>
    </div>
  );
};

export default UsersView;