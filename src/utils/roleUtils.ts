import { Database } from "@/integrations/supabase/types";

type UserRole = Database['public']['Enums']['app_role'];

export const isValidRole = (role: UserRole): boolean => {
  return ['admin', 'collector', 'member'].includes(role);
};

export const hasRole = (userRoles: UserRole[] | null, role: UserRole): boolean => {
  if (!userRoles) return false;
  console.log('[RoleUtils] Checking role:', {
    role,
    userRoles,
    timestamp: new Date().toISOString()
  });
  return userRoles.includes(role);
};

export const hasAnyRole = (userRoles: UserRole[] | null, roles: UserRole[]): boolean => {
  if (!userRoles) return false;
  console.log('[RoleUtils] Checking multiple roles:', {
    roles,
    userRoles,
    timestamp: new Date().toISOString()
  });
  return roles.some(role => hasRole(userRoles, role));
};

type TabAccessConfig = {
  [key: string]: UserRole[];
};

const tabAccessMap: TabAccessConfig = {
  dashboard: ['admin', 'collector', 'member'],
  users: ['admin', 'collector'],
  financials: ['admin', 'collector'],
  system: ['admin'],
  audit: ['admin']
};

export const canAccessTab = (tab: string, userRoles: UserRole[] | null): boolean => {
  if (!userRoles) {
    console.log('[RoleUtils] No user roles available');
    return false;
  }

  const allowedRoles = tabAccessMap[tab];
  if (!allowedRoles) {
    console.log('[RoleUtils] No allowed roles defined for tab:', tab);
    return false;
  }

  const result = hasAnyRole(userRoles, allowedRoles);

  console.log('[RoleUtils] Tab access check:', {
    tab,
    allowedRoles,
    hasAccess: result,
    userRoles,
    timestamp: new Date().toISOString()
  });

  return result;
};

export const getDefaultRoute = (userRoles: UserRole[] | null): string => {
  if (!userRoles?.length) {
    console.log('[RoleUtils] No roles available, redirecting to login');
    return '/login';
  }
  
  if (hasRole(userRoles, 'admin')) {
    console.log('[RoleUtils] Admin role detected, redirecting to system');
    return '/system';
  }
  
  if (hasRole(userRoles, 'collector')) {
    console.log('[RoleUtils] Collector role detected, redirecting to users');
    return '/users';
  }
  
  console.log('[RoleUtils] Default member role, redirecting to dashboard');
  return '/dashboard';
};