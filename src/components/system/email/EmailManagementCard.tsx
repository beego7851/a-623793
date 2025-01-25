import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Mail, Clock, ChartBar } from "lucide-react";
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";

const EmailManagementCard = () => {
  const { toast } = useToast();

  const { data: emailStats, isLoading } = useQuery({
    queryKey: ['email-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('email_logs')
        .select('status, email_category')
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());
      
      if (error) throw error;
      
      const stats = {
        pending: data.filter(log => log.status === 'pending').length,
        sent: data.filter(log => log.status === 'delivered').length,
        failed: data.filter(log => log.status === 'failed').length,
        payment: data.filter(log => log.email_category === 'payment').length,
        general: data.filter(log => log.email_category === 'general').length
      };
      
      return stats;
    }
  });

  const processQueue = async () => {
    try {
      const response = await fetch(
        'https://trzaeinxlytyqxptkuyj.functions.supabase.co/process-email-queue',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      if (!response.ok) throw new Error('Failed to process queue');

      toast({
        title: "Queue Processed",
        description: "Email queue has been processed successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process email queue",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="bg-dashboard-card border-white/10">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-dashboard-accent1" />
            <CardTitle className="text-xl text-white">Email Management</CardTitle>
          </div>
          <Button 
            onClick={processQueue}
            className="bg-dashboard-accent1 hover:bg-dashboard-accent1/80"
          >
            Process Queue
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-dashboard-card/50 p-4 rounded-lg border border-white/10">
            <h3 className="text-sm text-dashboard-text mb-2">Last 24 Hours</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-dashboard-text">Pending</span>
                <span className="text-dashboard-accent1">{isLoading ? '...' : emailStats?.pending}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-dashboard-text">Sent</span>
                <span className="text-dashboard-accent3">{isLoading ? '...' : emailStats?.sent}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-dashboard-text">Failed</span>
                <span className="text-dashboard-error">{isLoading ? '...' : emailStats?.failed}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-dashboard-card/50 p-4 rounded-lg border border-white/10">
            <h3 className="text-sm text-dashboard-text mb-2">Categories</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-dashboard-text">Payment</span>
                <span className="text-dashboard-accent1">{isLoading ? '...' : emailStats?.payment}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-dashboard-text">General</span>
                <span className="text-dashboard-accent1">{isLoading ? '...' : emailStats?.general}</span>
              </div>
            </div>
          </div>

          <div className="bg-dashboard-card/50 p-4 rounded-lg border border-white/10">
            <h3 className="text-sm text-dashboard-text mb-2">Queue Settings</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-dashboard-text">
                <Clock className="w-4 h-4" />
                <span>Auto-process every 5 min</span>
              </div>
              <div className="flex items-center gap-2 text-dashboard-text">
                <ChartBar className="w-4 h-4" />
                <span>Daily limit: 50/category</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmailManagementCard;