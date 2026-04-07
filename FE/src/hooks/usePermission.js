import { useAuth } from './useAuth';

/**
 * usePermission – kiểm tra quyền của user hiện tại
 *
 * Usage:
 *   const { can } = usePermission();
 *   if (can(PERMISSIONS.ACCOUNT_MANAGE)) { ... }
 */
export const usePermission = () => {
  const { permissions } = useAuth();

  const can = (permission) => permissions.includes(permission);
  const canAny = (permList) => permList.some((p) => permissions.includes(p));
  const canAll = (permList) => permList.every((p) => permissions.includes(p));

  return { can, canAny, canAll };
};
