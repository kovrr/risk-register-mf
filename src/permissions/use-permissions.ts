const useHasPermissions = (requiredPermissions: string[]) => {
  const permissions: { key: string }[] = [];
  const permissionKeys = permissions.map((permission: { key: string }) => permission.key);
  return requiredPermissions.every((permission) =>
    permissionKeys.includes(permission),
  );
};

export const useIsGuestUser = () =>
  useHasPermissions(['guestUser']);

export const useIsSelfAssessmentLimitedUser = () =>
  useHasPermissions(['selfAssessmentLimitedUser']);

export const useIsRiskRegisterLimitedUser = () =>
  useHasPermissions(['riskRegisterLimitedUser']);

