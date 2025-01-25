import { format } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";

interface MemberPaymentHistoryProps {
  memberId: string;
}

const MemberPaymentHistory = ({ memberId }: MemberPaymentHistoryProps) => {
  const { data: paymentHistory } = useQuery({
    queryKey: ['payment-history', memberId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payment_requests')
        .select('*')
        .eq('member_id', memberId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium text-dashboard-accent3">Payment History</h4>
      <div className="bg-dashboard-card p-3 rounded-lg border border-dashboard-cardBorder">
        {paymentHistory && paymentHistory.length > 0 ? (
          <div className="space-y-3">
            {paymentHistory.map((payment) => (
              <div key={payment.id} className="border-b border-dashboard-cardBorder pb-2">
                <p className="text-sm text-dashboard-text">Date: <span className="text-white">{format(new Date(payment.created_at), 'dd/MM/yyyy')}</span></p>
                <p className="text-sm text-dashboard-text">Status: 
                  <span className={`ml-1 ${
                    payment.status === 'completed' ? 'text-dashboard-accent3' :
                    payment.status === 'pending' ? 'text-dashboard-warning' :
                    'text-dashboard-error'
                  }`}>
                    {payment.status}
                  </span>
                </p>
                <p className="text-sm text-dashboard-text">Type: <span className="text-dashboard-accent2">{payment.payment_type}</span></p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-dashboard-muted">No payment history available</p>
        )}
      </div>
    </div>
  );
};

export default MemberPaymentHistory;