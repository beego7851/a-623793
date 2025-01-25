import { Card } from '@/components/ui/card';
import { Table, TableBody } from '@/components/ui/table';
import { CollectorRolesHeader } from './collectors/roles/CollectorRolesHeader';
import { CollectorRolesRow } from './collectors/roles/CollectorRolesRow';
import { CollectorRolesListHeader } from './collectors/roles/CollectorRolesListHeader';
import { CollectorRolesError } from './collectors/roles/CollectorRolesError';
import { CollectorRolesLoading } from './collectors/roles/CollectorRolesLoading';
import { useCollectorRoles } from './collectors/roles/useCollectorRoles';

const CollectorRolesList = () => {
  const { 
    collectors, 
    isLoading, 
    error, 
    refetch,
    handleRoleChange,
    handleSync
  } = useCollectorRoles();

  if (error) {
    return <CollectorRolesError onRetry={refetch} />;
  }

  if (isLoading) {
    return <CollectorRolesLoading />;
  }

  return (
    <div className="space-y-6 p-4 bg-gradient-to-br from-dashboard-dark to-dashboard-card">
      <CollectorRolesListHeader collectorCount={collectors?.length || 0} />
      <Card className="p-6 bg-dashboard-card border-dashboard-cardBorder hover:border-dashboard-cardBorderHover transition-all duration-300">
        <Table>
          <CollectorRolesHeader />
          <TableBody>
            {collectors?.map(collector => (
              <CollectorRolesRow
                key={collector.member_number}
                collector={collector}
                onRoleChange={handleRoleChange}
                onSync={handleSync}
              />
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default CollectorRolesList;