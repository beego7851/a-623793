import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Mail, Clock, ChartBar, Settings } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";

const EmailManagementCard = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: emailStats, isLoading: statsLoading } = useQuery({
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

  const { data: queueConfig, isLoading: configLoading } = useQuery({
    queryKey: ['queue-config'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('email_queue_config')
        .select('*');
      
      if (error) throw error;
      return data;
    }
  });

  const updateConfigMutation = useMutation({
    mutationFn: async ({ id, daily_limit, auto_process_interval }: { id: string, daily_limit: number, auto_process_interval: number }) => {
      const { error } = await supabase
        .from('email_queue_config')
        .update({ daily_limit, auto_process_interval })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['queue-config'] });
      toast({
        title: "Settings Updated",
        description: "Email queue configuration has been updated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const processQueue = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('process-email-queue', {
        method: 'POST',
      });

      if (error) throw error;

      toast({
        title: "Queue Processed",
        description: "Email queue has been processed successfully",
      });
    } catch (error: any) {
      console.error('Error processing queue:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to process email queue",
        variant: "destructive",
      });
    }
  };

  const handleConfigUpdate = (id: string, field: 'daily_limit' | 'auto_process_interval', value: string) => {
    const numValue = parseInt(value);
    if (isNaN(numValue) || numValue < 0) return;

    const config = queueConfig?.find(c => c.id === id);
    if (!config) return;

    updateConfigMutation.mutate({
      id,
      daily_limit: field === 'daily_limit' ? numValue : config.daily_limit,
      auto_process_interval: field === 'auto_process_interval' ? numValue : config.auto_process_interval
    });
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
                <span className="text-dashboard-accent1">{statsLoading ? '...' : emailStats?.pending}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-dashboard-text">Sent</span>
                <span className="text-dashboard-accent3">{statsLoading ? '...' : emailStats?.sent}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-dashboard-text">Failed</span>
                <span className="text-dashboard-error">{statsLoading ? '...' : emailStats?.failed}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-dashboard-card/50 p-4 rounded-lg border border-white/10">
            <h3 className="text-sm text-dashboard-text mb-2">Categories</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-dashboard-text">Payment</span>
                <span className="text-dashboard-accent1">{statsLoading ? '...' : emailStats?.payment}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-dashboard-text">General</span>
                <span className="text-dashboard-accent1">{statsLoading ? '...' : emailStats?.general}</span>
              </div>
            </div>
          </div>

          <div className="bg-dashboard-card/50 p-4 rounded-lg border border-white/10">
            <h3 className="text-sm text-dashboard-text mb-2">Queue Settings</h3>
            {configLoading ? (
              <div className="text-dashboard-text">Loading settings...</div>
            ) : (
              <div className="space-y-4">
                {queueConfig?.map((config) => (
                  <div key={config.id} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Settings className="w-4 h-4 text-dashboard-text" />
                      <span className="text-dashboard-text capitalize">{config.category}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ChartBar className="w-4 h-4 text-dashboard-text" />
                      <span className="text-dashboard-text text-sm">Daily Limit:</span>
                      <Input
                        type="number"
                        value={config.daily_limit}
                        onChange={(e) => handleConfigUpdate(config.id, 'daily_limit', e.target.value)}
                        className="w-20 h-8 text-sm"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-dashboard-text" />
                      <span className="text-dashboard-text text-sm">Process Interval (min):</span>
                      <Input
                        type="number"
                        value={config.auto_process_interval}
                        onChange={(e) => handleConfigUpdate(config.id, 'auto_process_interval', e.target.value)}
                        className="w-20 h-8 text-sm"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmailManagementCard;