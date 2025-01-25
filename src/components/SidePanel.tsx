import { useCallback, useMemo, memo, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useRoleAccess } from "@/hooks/useRoleAccess";
import { useAuthSession } from "@/hooks/useAuthSession";
import NavItem from "./navigation/NavItem";

interface SidePanelProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
}

const SidePanel = memo(({ currentTab, onTabChange }: SidePanelProps) => {
  const { session, handleSignOut } = useAuthSession();
  const { userRole, userRoles, roleLoading } = useRoleAccess();
  const { toast } = useToast();
  const prevTabRef = useRef(currentTab);
  const hasSession = !!session;

  // Memoize navigation items to prevent recreation
  const navigationItems = useMemo(() => [
    {
      name: 'Overview',
      tab: 'dashboard',
      alwaysShow: true
    },
    {
      name: 'Users',
      tab: 'users',
      requiresRole: ['admin', 'collector'] as const
    },
    {
      name: 'Financials',
      tab: 'financials',
      requiresRole: ['admin', 'collector'] as const
    },
    {
      name: 'System',
      tab: 'system',
      requiresRole: ['admin'] as const
    }
  ], []);

  // Memoize visible items calculation
  const visibleNavigationItems = useMemo(() => {
    if (!hasSession || roleLoading) {
      return navigationItems.filter(item => item.alwaysShow);
    }

    return navigationItems.filter(item => {
      if (item.alwaysShow) return true;
      if (!item.requiresRole) return true;
      return item.requiresRole.some(role => userRoles?.includes(role));
    });
  }, [navigationItems, roleLoading, userRoles, hasSession]);

  // Use useCallback with minimal dependencies
  const handleTabChange = useCallback((tab: string) => {
    if (!userRoles?.length) {
      toast({
        title: "Access Denied",
        description: "Please wait while your permissions are being loaded.",
        variant: "destructive",
      });
      return;
    }

    if (tab !== prevTabRef.current) {
      prevTabRef.current = tab;
      onTabChange(tab);
    }
  }, [onTabChange, userRoles, toast]);

  const handleLogoutClick = useCallback(async () => {
    try {
      await handleSignOut(false);
      toast({
        title: "Signed Out",
        description: "You have been successfully signed out.",
      });
    } catch (error) {
      console.error('[SidePanel] Logout error:', error);
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive"
      });
    }
  }, [handleSignOut, toast]);

  // Only log when tab actually changes
  useEffect(() => {
    if (prevTabRef.current !== currentTab) {
      console.log('[SidePanel] Tab changed:', {
        from: prevTabRef.current,
        to: currentTab,
        timestamp: new Date().toISOString()
      });
      prevTabRef.current = currentTab;
    }
  }, [currentTab]);

  return (
    <div className="flex flex-col h-full bg-dashboard-card border-r border-dashboard-cardBorder">
      <ScrollArea className="flex-1">
        <div className="space-y-4 py-4">
          <div className="px-3 py-2">
            <h2 className="mb-2 px-4 text-lg font-semibold text-dashboard-highlight">
              Navigation
            </h2>
            <div className="space-y-1">
              {visibleNavigationItems.map((item) => (
                <NavItem
                  key={item.tab}
                  name={item.name}
                  tab={item.tab}
                  isActive={currentTab === item.tab}
                  onClick={() => handleTabChange(item.tab)}
                />
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>
      <div className="p-4 border-t border-dashboard-cardBorder space-y-4">
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start",
            "bg-[#9b87f5] hover:bg-[#7E69AB]",
            "text-white transition-colors"
          )}
          onClick={handleLogoutClick}
        >
          Sign Out
        </Button>
      </div>
    </div>
  );
});

SidePanel.displayName = "SidePanel";

export default SidePanel;