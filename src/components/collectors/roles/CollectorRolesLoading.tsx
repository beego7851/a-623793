import { Loader2 } from 'lucide-react';

export const CollectorRolesLoading = () => {
  return (
    <div className="flex justify-center items-center p-4">
      <Loader2 className="h-6 w-6 animate-spin text-dashboard-accent1" />
    </div>
  );
};