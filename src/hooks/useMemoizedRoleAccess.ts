import { useMemo } from 'react';
import { useRoleAccess } from './useRoleAccess';
import type { UserRole } from '@/types/collector-roles';

export const useMemoizedRoleAccess = () => {
  const { userRoles, roleLoading, error } = useRoleAccess();

  const rolePermissions = useMemo(() => ({
    isAdmin: userRoles?.includes('admin'),
    isCollector: userRoles?.includes('collector'),
    isMember: userRoles?.includes('member'),
    hasMultipleRoles: userRoles && userRoles.length > 1
  }), [userRoles]);

  const navigationPermissions = useMemo(() => ({
    canAccessDashboard: true, // Everyone can access dashboard
    canAccessUsers: rolePermissions.isAdmin || rolePermissions.isCollector,
    canAccessFinancials: rolePermissions.isAdmin || rolePermissions.isCollector,
    canAccessSystem: rolePermissions.isAdmin
  }), [rolePermissions]);

  return {
    rolePermissions,
    navigationPermissions,
    roleLoading,
    error,
    userRoles
  };
};