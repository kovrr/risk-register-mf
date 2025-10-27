export const Permission = {
  VISIBLE: 'visible',
  PREMIUM: 'premium',
  HIDDEN: 'hidden',
  DISABLED: 'disabled',
} as const;

export type PermissionType = (typeof Permission)[keyof typeof Permission];

export interface MenuItem {
  id: string;
  mode: PermissionType;
  children?: MenuItem[];
}
