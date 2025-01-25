import { AlertCircle } from 'lucide-react';

interface CollectorRolesErrorProps {
  onRetry: () => void;
}

export const CollectorRolesError = ({ onRetry }: CollectorRolesErrorProps) => {
  return (
    <div className="flex items-center justify-center p-4 text-dashboard-error">
      <AlertCircle className="w-4 h-4 mr-2" />
      <span>Error loading collectors</span>
      <button 
        onClick={onRetry} 
        className="ml-4 text-dashboard-accent1 hover:text-dashboard-accent2"
      >
        Retry
      </button>
    </div>
  );
};