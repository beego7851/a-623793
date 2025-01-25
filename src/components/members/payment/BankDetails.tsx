import { Card } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface BankDetailsProps {
  memberNumber?: string;
}

const BankDetails = ({ memberNumber }: BankDetailsProps) => {
  return (
    <div className="space-y-4">
      <Alert variant="default" className="bg-yellow-500/10 border-yellow-500/20">
        <AlertCircle className="h-4 w-4 text-yellow-500" />
        <AlertDescription className="text-yellow-100">
          IMPORTANT: You must use your member number (<span className="font-bold">{memberNumber}</span>) as the payment reference when making the bank transfer.
        </AlertDescription>
      </Alert>

      <div className="p-6 bg-dashboard-dark/80 rounded-lg border-2 border-dashboard-accent2/30 shadow-lg">
        <h3 className="text-xl font-medium text-dashboard-highlight mb-4">Bank Details</h3>
        <div className="space-y-4">
          <div>
            <p className="text-dashboard-muted">Bank Name</p>
            <p className="text-dashboard-text font-medium">HSBC Bank</p>
          </div>
          <div>
            <p className="text-dashboard-muted">Account Name</p>
            <p className="text-dashboard-text font-medium">Pakistan Welfare Association</p>
          </div>
          <div>
            <p className="text-dashboard-muted">Sort Code</p>
            <p className="text-dashboard-text font-semibold text-xl text-blue-400">40-15-34</p>
          </div>
          <div>
            <p className="text-dashboard-muted">Account Number</p>
            <p className="text-dashboard-text font-semibold text-xl text-blue-400">41024892</p>
          </div>
          <div>
            <p className="text-dashboard-muted">Payment Reference</p>
            <p className="text-dashboard-text font-semibold text-xl text-yellow-400">
              {memberNumber || '[Your Member Number]'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BankDetails;