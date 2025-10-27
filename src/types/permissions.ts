export const HighOrderPermissions = {
  companyCreate: 'company.edit',
  guestUser: 'guest_demo_access',
  riskRegisterLimitedUser: 'risk_register_limited_user',
  selfAssessmentLimitedUser: 'self_assessment_limited_user',
  fqCreate: 'fq.create', // deprecated after company level permissions is enabled
  fqReadAll: 'fq.read_all', // deprecated after company level permissions is enabled
} as const;

export type HighOrderPermission =
  (typeof HighOrderPermissions)[keyof typeof HighOrderPermissions];

export const PermissionTypes = {
  read: 'read',
  write: 'write',
  delete: 'delete',
} as const;
export type PermissionType =
  (typeof PermissionTypes)[keyof typeof PermissionTypes];

export const ExtendedPermissionTypes = {
  ...PermissionTypes,
  all: '*',
} as const;
export type ExtendedPermissionType =
  (typeof ExtendedPermissionTypes)[keyof typeof ExtendedPermissionTypes];

export type CombinedPermissionType =
  | HighOrderPermission
  | ExtendedPermissionType;

export type CompanyLevelPermissionParams = {
  tenantId: string;
  companyId: string;
};
