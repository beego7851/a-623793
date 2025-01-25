import { useEffect, useMemo, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEnhancedRoleAccess } from '@/hooks/useEnhancedRoleAccess';
import { useAuthSession } from '@/hooks/useAuthSession';
import { Toaster } from "@/components/ui/toaster";
import { supabase } from "@/integrations/supabase/client";
import { AlertCircle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import Login from '@/pages/Login';
import ResetPassword from '@/pages/ResetPassword';
import DashboardView from '@/components/DashboardView';
import UsersView from '@/components/UsersView';
import FinancialsView from '@/components/FinancialsView';
import SystemToolsView from '@/components/SystemToolsView';
import ProtectedRoutes from '@/components/routing/ProtectedRoutes';

function App() {
  const { session, loading: sessionLoading } = useAuthSession();
  const { isLoading: rolesLoading, hasRole } = useEnhancedRoleAccess();
  const [maintenanceMode, setMaintenanceMode] = useState<{ enabled: boolean; message: string } | null>(null);
  const [maintenanceLoading, setMaintenanceLoading] = useState(true);

  const appState = useMemo(() => ({
    sessionLoading,
    rolesLoading,
    hasSession: !!session,
    currentPath: window.location.pathname,
    timestamp: new Date().toISOString()
  }), [sessionLoading, rolesLoading, session]);

  useEffect(() => {
    console.log('App render state:', appState);
  }, [appState]);

  useEffect(() => {
    const checkMaintenanceMode = async () => {
      try {
        const { data, error } = await supabase
          .from('maintenance_settings')
          .select('is_enabled, message')
          .eq('id', '00000000-0000-0000-0000-000000000001')
          .maybeSingle();

        if (error) {
          console.error('Error checking maintenance mode:', error);
          return;
        }

        setMaintenanceMode(data ? {
          enabled: data.is_enabled,
          message: data.message
        } : null);
      } catch (error) {
        console.error('Failed to check maintenance mode:', error);
      } finally {
        setMaintenanceLoading(false);
      }
    };

    checkMaintenanceMode();
  }, []);

  // Only show loading during initial session check
  if (sessionLoading && !session) {
    return null;
  }

  // Show maintenance mode screen for non-admin users, except for reset password page
  const currentPath = window.location.pathname;
  if (!maintenanceLoading && 
      maintenanceMode?.enabled && 
      session && 
      !hasRole('admin') && 
      !currentPath.startsWith('/reset-password')) {
    return (
      <div className="min-h-screen bg-dashboard-dark flex items-center justify-center p-4">
        <Alert className="max-w-2xl w-full bg-dashboard-card border-dashboard-error/50">
          <AlertCircle className="h-6 w-6 text-dashboard-error" />
          <AlertTitle className="text-2xl font-semibold text-white mb-4">
            System Maintenance
          </AlertTitle>
          <AlertDescription className="text-lg text-dashboard-text">
            {maintenanceMode.message || 'The system is currently undergoing maintenance. Please try again later.'}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={!session ? <Login /> : <Navigate to="/" replace />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/*" element={<ProtectedRoutes session={session} />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardView />} />
          <Route path="users" element={<UsersView />} />
          <Route path="financials" element={<FinancialsView />} />
          <Route path="system" element={<SystemToolsView />} />
        </Route>
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;