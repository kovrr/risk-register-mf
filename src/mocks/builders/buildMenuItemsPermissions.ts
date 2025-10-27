import { MenuItem } from '@/components/layout/sidebar/sidebarPermissionsType';

export const menuItemsMock: MenuItem = {
  id: 'fq_menu_items',
  mode: 'visible',
  children: [
    {
      id: 'risk_analysis',
      mode: 'visible',
      children: [
        {
          id: 'risk_evaluation',
          mode: 'visible',
        },
        {
          id: 'loss_impact_scenarios',
          mode: 'disabled',
        },
        {
          id: 'risk_progression',
          mode: 'hidden',
        },
        {
          id: 'materiality_analysis',
          mode: 'premium',
        },
      ],
    },
    {
      id: 'risk_management',
      mode: 'disabled',
      children: [
        {
          id: 'security_controls',
          mode: 'visible',
        },
        {
          id: 'asset_groups',
          mode: 'disabled',
        },
        {
          id: 'risk_transfer',
          mode: 'hidden',
        },
      ],
    },
    {
      id: 'reports',
      mode: 'disabled',
      children: [
        {
          id: 'crq_report',
          mode: 'visible',
        },
        {
          id: 'ciso_report',
          mode: 'disabled',
        },
      ],
    },
    {
      id: 'third_party_risk',
      mode: 'disabled',
      children: [
        {
          id: 'financial_exposure',
          mode: 'visible',
        },
        {
          id: 'vendors_analysis',
          mode: 'disabled',
        },
      ],
    },
  ],
};

export const allVisibleMenuItemsMock: MenuItem = {
  id: 'fq_menu_items',
  mode: 'visible',
  children: [
    {
      id: 'risk_analysis',
      mode: 'visible',
      children: [
        {
          id: 'risk_evaluation',
          mode: 'visible',
        },
        {
          id: 'loss_impact_scenarios',
          mode: 'visible',
        },
        {
          id: 'risk_progression',
          mode: 'visible',
        },
        {
          id: 'materiality_analysis',
          mode: 'visible',
        },
      ],
    },
    {
      id: 'risk_management',
      mode: 'disabled',
      children: [
        {
          id: 'security_controls',
          mode: 'visible',
        },
        {
          id: 'asset_groups',
          mode: 'visible',
        },
        {
          id: 'risk_transfer',
          mode: 'visible',
        },
      ],
    },
    {
      id: 'reports',
      mode: 'disabled',
      children: [
        {
          id: 'crq_report',
          mode: 'visible',
        },
        {
          id: 'ciso_report',
          mode: 'visible',
        },
      ],
    },
    {
      id: 'third_party_risk',
      mode: 'disabled',
      children: [
        {
          id: 'financial_exposure',
          mode: 'visible',
        },
        {
          id: 'vendors_analysis',
          mode: 'visible',
        },
      ],
    },
  ],
};

export const allVisibleMenuItemsV1Mock: MenuItem = {
  id: 'fq_menu_items',
  mode: 'visible',
  children: [
    {
      id: 'risk_analysis',
      mode: 'visible',
      children: [
        {
          id: 'risk_evaluation',
          mode: 'visible',
        },
        {
          id: 'risk_progression',
          mode: 'visible',
        },
      ],
    },
    {
      id: 'risk_management',
      mode: 'visible',
      children: [
        {
          id: 'security_controls',
          mode: 'visible',
        },
        {
          id: 'asset_groups',
          mode: 'visible',
        },
      ],
    },
    {
      id: 'first_party_risk',
      mode: 'visible',
    },
    {
      id: 'third_party_risk',
      mode: 'visible',
    },
    {
      id: 'reports',
      mode: 'visible',
      children: [
        {
          id: 'crq_report',
          mode: 'visible',
        },
        {
          id: 'materiality_analysis',
          mode: 'visible',
        },
        {
          id: 'risk_transfer',
          mode: 'visible',
        },
      ],
    },
  ],
};
