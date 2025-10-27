import {
  CIS_V8_CONTROLS_KEY,
  ControlScopes,
  type ROCICompanyCreationFormData,
} from '@/types/companyCreation';
import { ROCIIntegrationTypes } from '@/types/integrationInputsTypes';
import {
  CisV8SafeguardsByAbbr,
  type CisV8SafeguardsImplementation,
  cisV8Abbreviations,
} from 'options/cisV8Controls';

const INITIAL_THEME_CONTROL_LEVEL = 1;
const INITIAL_CONTROL_CONTROL_LEVEL = 0;

export const setCisDefaultValues = (defaultLevel: number) =>
  Object.fromEntries(cisV8Abbreviations.map((id) => [id, defaultLevel]));

export const setCisSafeguardsDefaultValues = (defaultLevel: number) => {
  return Object.fromEntries(
    Object.entries(CisV8SafeguardsByAbbr).map(([abbr, safeguards]) => {
      return [
        abbr,
        Object.fromEntries(safeguards.map((id) => [id, defaultLevel])),
      ];
    }),
  ) as CisV8SafeguardsImplementation;
};

const BY_THEME_TEXT = 'Security Themes';

export const rociInitialValues = {
  integration_source: [ROCIIntegrationTypes.ALLOY],
  security_posture: {
    scope: { value: ControlScopes.THEME, label: BY_THEME_TEXT },
    controls: {
      [CIS_V8_CONTROLS_KEY]: {
        by_theme: setCisDefaultValues(INITIAL_THEME_CONTROL_LEVEL),
        by_control: setCisDefaultValues(INITIAL_CONTROL_CONTROL_LEVEL),
        by_maturity: setCisSafeguardsDefaultValues(
          INITIAL_CONTROL_CONTROL_LEVEL,
        ),
      },
    },
    controls_cloud: {
      [CIS_V8_CONTROLS_KEY]: {
        by_theme: setCisDefaultValues(INITIAL_THEME_CONTROL_LEVEL),
        by_control: setCisDefaultValues(INITIAL_CONTROL_CONTROL_LEVEL),
        by_maturity: setCisSafeguardsDefaultValues(
          INITIAL_CONTROL_CONTROL_LEVEL,
        ),
      },
    },
  },
} satisfies Partial<ROCICompanyCreationFormData>;
