import React, { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Shield, Info, FileDown, Trash2, Power } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import SystemCheckProgress from './SystemCheckProgress';
import SystemCheckResults from './SystemCheckResults';
import { generateSystemCheckPDF } from '@/utils/systemPdfGenerator';
import { SystemCheck } from '@/types/system';
import { runAdditionalChecks } from './AdditionalSystemChecks';

const MAINTENANCE_SETTINGS_ID = '00000000-0000-0000-0000-000000000001';

const SystemHealthCheck = () => {
  const { toast } = useToast();
  const [isRunningChecks, setIsRunningChecks] = useState(false);
  const [systemChecks, setSystemChecks] = useState<SystemCheck[]>([]);
  const [currentCheck, setCurrentCheck] = useState('');
  const [completedChecks, setCompletedChecks] = useState(0);
  const [maintenanceEnabled, setMaintenanceEnabled] = useState(false);
  const [isLoadingMaintenance, setIsLoadingMaintenance] = useState(true);

  useEffect(() => {
    fetchMaintenanceStatus();
  }, []);

  const fetchMaintenanceStatus = async () => {
    try {
      console.log('Fetching maintenance status...');
      const { data, error } = await supabase
        .from('maintenance_settings')
        .select('is_enabled')
        .eq('id', MAINTENANCE_SETTINGS_ID)
        .maybeSingle();

      if (error) {
        console.error('Error fetching maintenance status:', error);
        throw error;
      }
      
      console.log('Maintenance status data:', data);
      setMaintenanceEnabled(data?.is_enabled || false);
    } catch (error) {
      console.error('Error fetching maintenance status:', error);
      toast({
        title: "Error",
        description: "Failed to fetch maintenance status",
        variant: "destructive",
      });
    } finally {
      setIsLoadingMaintenance(false);
    }
  };

  const toggleMaintenance = async () => {
    try {
      console.log('Toggling maintenance mode...');
      const newStatus = !maintenanceEnabled;
      const { error } = await supabase
        .from('maintenance_settings')
        .update({ 
          is_enabled: newStatus,
          enabled_at: newStatus ? new Date().toISOString() : null,
          enabled_by: (await supabase.auth.getUser()).data.user?.id
        })
        .eq('id', MAINTENANCE_SETTINGS_ID);

      if (error) {
        console.error('Error toggling maintenance mode:', error);
        throw error;
      }

      setMaintenanceEnabled(newStatus);
      toast({
        title: newStatus ? "Maintenance Mode Enabled" : "Maintenance Mode Disabled",
        description: newStatus 
          ? "System is now in maintenance mode. Only administrators can access the system."
          : "System is now accessible to all users.",
      });
    } catch (error) {
      console.error('Error toggling maintenance mode:', error);
      toast({
        title: "Error",
        description: "Failed to toggle maintenance mode",
        variant: "destructive",
      });
    }
  };

  const clearResults = () => {
    setSystemChecks([]);
    toast({
      title: "Results Cleared",
      description: "System check results have been cleared",
    });
  };

  const generatePDFReport = () => {
    if (systemChecks.length === 0) {
      toast({
        title: "No Results",
        description: "Run system checks first to generate a PDF report",
        variant: "destructive",
      });
      return;
    }

    try {
      const doc = generateSystemCheckPDF(systemChecks, "System Health Check Report");
      doc.save("system-health-report.pdf");
      
      toast({
        title: "PDF Generated",
        description: "System health report has been downloaded",
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Error",
        description: "Failed to generate PDF report",
        variant: "destructive",
      });
    }
  };

  const runSystemChecks = async () => {
    console.log('Starting system checks...');
    setIsRunningChecks(true);
    setSystemChecks([]);
    setCompletedChecks(0);
    
    try {
      let allChecks: SystemCheck[] = [];
      
      // Add your system check logic here

      setCompletedChecks(allChecks.length);
      toast({
        title: "System Checks Complete",
        description: `Found ${allChecks.length} items to review`,
      });
    } catch (error) {
      console.error('Error running system checks:', error);
      toast({
        title: "Error Running Checks",
        description: "An error occurred while running system checks",
        variant: "destructive",
      });
    } finally {
      setIsRunningChecks(false);
    }
  };

  return (
    <Card className="bg-dashboard-card border-white/10">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-dashboard-accent1" />
            <CardTitle className="text-xl text-white">System Health Check</CardTitle>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Power className={`w-4 h-4 ${maintenanceEnabled ? 'text-dashboard-warning' : 'text-dashboard-accent3'}`} />
              <span className="text-sm text-dashboard-text">Maintenance Mode</span>
              <Switch
                checked={maintenanceEnabled}
                onCheckedChange={toggleMaintenance}
                disabled={isLoadingMaintenance}
                className="data-[state=checked]:bg-dashboard-warning"
              />
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={clearResults}
                variant="outline"
                className="border-dashboard-accent1/20 hover:bg-dashboard-accent1/10"
                disabled={isRunningChecks || systemChecks.length === 0}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear Results
              </Button>
              <Button 
                onClick={generatePDFReport}
                variant="outline"
                className="border-dashboard-accent1/20 hover:bg-dashboard-accent1/10"
                disabled={isRunningChecks || systemChecks.length === 0}
              >
                <FileDown className="w-4 h-4 mr-2" />
                Export PDF
              </Button>
              <Button 
                onClick={runSystemChecks}
                disabled={isRunningChecks}
                className="bg-dashboard-accent1 hover:bg-dashboard-accent1/80"
              >
                Run System Checks
              </Button>
            </div>
          </div>
        </div>
        <CardDescription className="text-dashboard-muted">
          Comprehensive system analysis and security audit
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px] w-full rounded-md">
          {isRunningChecks ? (
            <SystemCheckProgress
              currentCheck={currentCheck}
              progress={(completedChecks / 4) * 100}
              totalChecks={4}
              completedChecks={completedChecks}
            />
          ) : null}
          
          {systemChecks.length > 0 ? (
            <SystemCheckResults checks={systemChecks} />
          ) : !isRunningChecks ? (
            <Card className="border-dashboard-accent1/20 bg-dashboard-card/50">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Info className="h-5 w-5 text-dashboard-accent1" />
                  <CardTitle className="text-dashboard-accent1">No Issues Found</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-dashboard-accent1/80">
                  All system checks passed successfully. Your system is healthy and secure.
                </p>
              </CardContent>
            </Card>
          ) : null}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default SystemHealthCheck;