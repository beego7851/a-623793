import { Badge } from '@/components/ui/badge';

interface CollectorRolesListHeaderProps {
  collectorCount: number;
}

export const CollectorRolesListHeader = ({ collectorCount }: CollectorRolesListHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-2xl font-semibold bg-gradient-to-r from-dashboard-accent1 to-dashboard-accent2 bg-clip-text text-transparent">
        Active Collectors and Roles
      </h2>
      <Badge variant="outline" className="text-dashboard-accent1 border-dashboard-accent1">
        {collectorCount} Collectors
      </Badge>
    </div>
  );
};