import { MAP_TEXT_CIS } from '@/types/quantificationForm';
import type { FilterFn, Row } from '@tanstack/react-table';
import {
  CONTROL_CODE_MAP_DESC as ASB_CONTROL_CODE_MAP_DESC,
  type AsbCode,
} from 'options/asbControls';
import {
  BASIC_CIS_CONTROLS,
  CONTROL_CODE_MAP_DESC as CIS_CODE_MAP_DESC,
  type CisAbbreviation,
  cisAbbrToCode,
  FOUNDATIONAL_CIS_CONTROLS,
  ORGANIZATIONAL_CIS_CONTROLS,
} from 'options/cisControls';
import {
  CONTROL_CODE_MAP_DESC as CIS_V8_CONTROL_CODE_MAP_DESC,
  type CisV8Abbreviation,
  cisV8AbbrToCode,
} from 'options/cisV8Controls';
import {
  SecControlsFramework,
  type SecControlsFrameworkType,
} from 'options/constants';
import {
  CONTROL_CODE_MAP_DESC as NIST_CODE_MAP_DESC,
  type NistCode,
  NistNameToCode,
} from 'options/nistControls';
import {
  BATTERY_OPTIONS,
  CONTROL_CODE_MAP_DESC as NIST_V2_CONTROL_CODE_MAP_DESC,
  type NistV2Code,
} from 'options/nistV2Controls';
import {
  cisControlsByOrder,
  type ControlStatus,
  type OrderedCisControl,
} from 'types/security-controls';
import {
  type ISO27001ControlNumbersType,
  ISO27001ControlsToNumbers,
  type ISO27001ImplementationLevel,
  type ISOCategoryType,
  type SphereSecurityProfileForm,
} from 'types/sphereForm';
import { CISNameToCode } from '@/utils/financialQuantificationUtils';
import type { AssetGroupRow } from '@/types/assetGroup';

const cmmiValues = BATTERY_OPTIONS.map((option) => Number(option.value));
const convertSphereValueToDisplay = (
  sphereValue: number,
  scale?: string,
  isTarget = false,
): number => {
  if (sphereValue >= 1 && sphereValue <= 5 && !isTarget) {
    if (scale === '0_4') {
      return sphereValue - 1;
    } else if (scale === '1_5') {
      sphereValue = (sphereValue - 1) / 4;
    }
  }

  // Handle CMMI scale values (0, 0.16, 0.41, 0.75, 1)
  if (scale === 'CMMI') {
    const closestValue = cmmiValues.reduce((prev, curr) =>
      Math.abs(curr - sphereValue) < Math.abs(prev - sphereValue) ? curr : prev,
    );
    return cmmiValues.indexOf(closestValue);
  }
  // Here we are converting the sphere (decimal 0-1) value to be displayed according to the relevant scale.
  // The target value always rounds up because we display only one decimal place, and we want the user to be able
  // to surpass the boundary to the next CMMI level. We multiply by 10 before rounding and then divide by 10
  // to ensure the rounding happens after all calculations, keeping one decimal precision.
  const result =
    scale === '0_4'
      ? isTarget
        ? Math.ceil(sphereValue * 4 * 10) / 10
        : Math.round(sphereValue * 4 * 10) / 10
      : scale === '1_5'
        ? isTarget
          ? Math.ceil((sphereValue * 4 + 1) * 10) / 10
          : Math.round((sphereValue * 4 + 1) * 10) / 10
        : isTarget
          ? Math.ceil(sphereValue * 100)
          : Math.round(sphereValue * 100);

  return result;
};

export const getDesc = {
  [SecControlsFramework.NIST]: (key: any) => {
    const reformattedKey = key.replace('_', '.');
    if (reformattedKey in NIST_CODE_MAP_DESC) {
      return NIST_CODE_MAP_DESC[reformattedKey as NistCode].function;
    } else {
      return '';
    }
  },
  [SecControlsFramework.CIS]: (key: any) =>
    getCisText(key).classifications[0].classification,
  [SecControlsFramework.ASB]: (key: any) =>
    ASB_CONTROL_CODE_MAP_DESC[key as AsbCode].abbr, // From what i understood from Product, this is irrelevant
  [SecControlsFramework.ISO27001]: (key: string) => {
    return key.split('-')[0];
  },
  [SecControlsFramework.CISv8]: (key: any) => '',
  [SecControlsFramework.NIST_CSF_v2]: (key: any) => {
    const controlData = NIST_V2_CONTROL_CODE_MAP_DESC[key as NistV2Code];
    return controlData ? controlData.function : '';
  },
};

export type Classification = {
  header: string;
  classification: string;
};
export interface ControlText {
  title: string;
  secondaryTitle: string;
  desc: string;
  classifications: Classification[];
}

const nistNameToCode = (name: string): string => name.replace('_', '.') || '';

export const getCisText = (id: string, trans?: any): ControlText => {
  const controlCode = cisAbbrToCode(id as CisAbbreviation);
  const controlTitle = `CIS Control ${controlCode}`;
  const isBasic = controlCode in BASIC_CIS_CONTROLS;
  const isFoundational = controlCode in FOUNDATIONAL_CIS_CONTROLS;
  const isOrganizational = controlCode in ORGANIZATIONAL_CIS_CONTROLS;
  const category = isBasic
    ? 'Basic'
    : isFoundational
      ? 'Foundational'
      : isOrganizational
        ? 'Organizational'
        : '';
  const { title, desc } = CIS_CODE_MAP_DESC[controlCode];
  return {
    title: controlTitle,
    secondaryTitle: title || '',
    desc,
    classifications: [
      {
        header: 'Control Category',
        classification: category,
      },
    ],
  };
};

export const getCisV8Text = (id: string, trans?: any): ControlText => {
  const controlCode = cisV8AbbrToCode(id as CisV8Abbreviation);
  const controlTitle = `CIS Control ${controlCode}`;

  const { title, desc } = CIS_V8_CONTROL_CODE_MAP_DESC[controlCode];
  return {
    title: controlTitle,
    secondaryTitle: title || '',
    desc,
    classifications: [],
  };
};

const nistInitValue: ControlText = {
  title: '',
  secondaryTitle: '',
  desc: '',
  classifications: [],
};
export const getNistText = (id: string, trans?: any): ControlText => {
  const controlCode = nistNameToCode(id) as NistCode;
  if (!(controlCode in NIST_CODE_MAP_DESC)) {
    return nistInitValue;
  }
  const {
    title = '',
    desc = '',
    function: nistFunction = '',
  } = NIST_CODE_MAP_DESC[controlCode];
  return {
    title: controlCode,
    secondaryTitle: title || '',
    desc,
    classifications: [
      {
        header: 'Function',
        classification: nistFunction,
      },
    ],
  };
};

export const getNistV2Text = (id: string, trans?: any): ControlText => {
  const controlData = NIST_V2_CONTROL_CODE_MAP_DESC[id as NistV2Code];
  if (!controlData) {
    return {
      title: id,
      secondaryTitle: '',
      desc: '',
      classifications: [],
    };
  }

  return {
    title: `${controlData.abbr} - ${controlData.title}`,
    secondaryTitle: controlData.function,
    desc: controlData.desc,
    classifications: [
      {
        header: 'Function',
        classification: controlData.function,
      },
    ],
  };
};

export const getISOText = (
  key: string,
  trans?: ISOControlsType,
): ControlText => {
  const id = key as ISO27001ControlNumbersType;
  const category = key.split('-')[0] as ISOCategoryType;
  const number = key.split('-')[1];

  // Create fallback title using the control structure
  const fallbackTitle = `${ISO27001ControlsToNumbers[category] || category}.${number}`;
  const fallbackSecondaryTitle = `ISO 27001 Control ${fallbackTitle}`;

  if (trans === undefined) {
    return {
      title: fallbackTitle,
      secondaryTitle: fallbackSecondaryTitle,
      desc: '',
      classifications: [
        {
          header: 'Control Category',
          classification: category.toUpperCase(),
        },
      ],
    };
  }

  return {
    title: fallbackTitle,
    secondaryTitle: trans[id]?.title || fallbackSecondaryTitle,
    desc: trans[id]?.description || '',
    classifications: [
      {
        header: 'Control Theme',
        classification: trans[id]?.theme || '',
      },
      {
        header: 'Control Type',
        classification: trans[id]?.type || '',
      },
      {
        header: 'Cybersecurity Concept',
        classification: trans[id]?.concept || '',
      },
    ],
  };
};

export type ISOControlsType = Record<
  ISO27001ControlNumbersType,
  {
    title: string;
    description: string;
    theme: string;
    type: string;
    concept: string;
  }
>;

export const getEffectPercentage = (effect: number, damage: number) =>
  effect !== damage || effect !== 0
    ? ((effect / (effect + damage)) * 100).toFixed(2)
    : 0;

const getAssetGroupsByCis = (
  securityProfiles: SphereSecurityProfileForm[] | null | undefined,
  rowData: {
    control: string;
    currentMinimum: string;
    targetMinimum?: string;
    scale?: string;
    controlScope?: string;
  },
  allAgIds: (string | undefined)[],
) => {
  return (
    securityProfiles
      ?.filter((securityProfile) => {
        return (
          securityProfile.cis_implementation_level &&
          rowData.control in securityProfile.cis_implementation_level &&
          securityProfile.cis_implementation_level[rowData.control] ==
          MAP_TEXT_CIS[rowData.currentMinimum]
        );
      })
      .flatMap((securityProfile) => {
        const existingAgs = securityProfile.asset_groups.filter((ag) =>
          allAgIds.includes(ag.id || ''),
        );
        return existingAgs;
      }) || []
  );
};
const getAssetGroupsByCisV8 = (
  securityProfiles: SphereSecurityProfileForm[] | null | undefined,
  rowData: {
    control: string;
    currentMinimum: string;
    targetMinimum?: string;
    scale?: string;
    controlScope?: string;
  },
  allAgIds: (string | undefined)[],
) => {
  return (
    securityProfiles
      ?.filter((securityProfile) => {
        const isSafeguards =
          rowData.controlScope === 'category' ||
          securityProfile.control_scope === 'category';

        if (isSafeguards) {
          const hasSafeguards =
            securityProfile.cis_v8_implementation_level_safeguards &&
            rowData.control in
            (securityProfile.cis_v8_implementation_level_safeguards as any);
          return hasSafeguards;
        }
        const hasIGs =
          securityProfile.cis_v8_implementation_level_igs &&
          rowData.control in securityProfile.cis_v8_implementation_level_igs &&
          securityProfile.cis_v8_implementation_level_igs[rowData.control] ==
          MAP_TEXT_CIS[rowData.currentMinimum];
        return hasIGs;
      })
      .flatMap((securityProfile) => {
        const isSafeguards =
          rowData.controlScope === 'category' ||
          securityProfile.control_scope === 'category';

        if (isSafeguards) {
          const safeguardsData =
            (securityProfile.cis_v8_implementation_level_safeguards as any)?.[
            rowData.control
            ] || {};

          const controlCode = cisV8AbbrToCode(
            rowData.control as CisV8Abbreviation,
          );
          const controlData = CIS_V8_CONTROL_CODE_MAP_DESC[controlCode];

          if (!controlData) {
            return [];
          }

          // Get safeguards that need to be updated to 1.0 for the target IG
          const safeguards = [...controlData.safeguards];

          return safeguards
            .filter((safeguard) => {
              const safeguardNumber = parseInt(
                safeguard.index.split('.')[1] || '0',
              );
              const safeguardKey = `${rowData.control}-${safeguardNumber}`;
              const currentValue = safeguardsData[safeguardKey] || 0;

              if (currentValue >= 1.0) return false;

              // Filter based on target IG level
              const targetLevel = rowData.targetMinimum || 'ig1';

              const includeRules: Record<string, boolean> = {
                ig1: safeguard.ig[0] === 1,
                ig2: safeguard.ig[0] === 1 || safeguard.ig[1] === 1,
                ig3: true,
              };

              return includeRules[targetLevel] ?? false;
            })
            .map((safeguard) => {
              const safeguardNumber = parseInt(
                safeguard.index.split('.')[1] || '0',
              );
              const safeguardKey = `${rowData.control}-${safeguardNumber}`;
              const currentValue = safeguardsData[safeguardKey] || 0;

              return {
                name: safeguard.title,
                type: `${Math.round(currentValue * 100)} → 100`,
                index: safeguard.index,
                title: safeguard.title,
              };
            });
        } else {
          const existingAgs = securityProfile.asset_groups.filter((ag) =>
            allAgIds.includes(ag.id || ''),
          );
          return existingAgs;
        }
      }) || []
  );
};

const convertToNistV2Value = (value: number): number => {
  if (value === 2) {
    return 0.16;
  } else if (value === 3) {
    return 0.41;
  } else if (value === 4) {
    return 0.75;
  } else if (value === 5) {
    return 1;
  }
  return value;
};

const getAssetGroupsByNist = (
  securityProfiles: SphereSecurityProfileForm[] | null | undefined,
  rowData: {
    control: string;
    currentMinimum: string;
    targetMinimum?: string;
    scale?: string;
    controlScope?: string;
  },
  allAgIds: string[],
) => {
  return (
    securityProfiles
      ?.filter((securityProfile) => {
        return (
          securityProfile.nist_implementation_level &&
          rowData.control in securityProfile.nist_implementation_level &&
          securityProfile.nist_implementation_level[rowData.control] ==
          Number(rowData.currentMinimum) //when on nist the currentMinimum will be a number
        );
      })
      .flatMap((securityProfile) => {
        const existingAgs = securityProfile.asset_groups.filter((ag) =>
          allAgIds.includes(ag.id || ''),
        );
        return existingAgs;
      }) || []
  );
};

const getAssetGroupsByNistV2 = (
  securityProfiles: SphereSecurityProfileForm[] | null | undefined,
  rowData: {
    control: string;
    currentMinimum: string;
    targetMinimum?: string;
    scale?: string;
    controlScope?: string;
  },
  allAgIds: (string | undefined)[],
) => {
  return (
    securityProfiles
      ?.filter((securityProfile) => {
        const isSafeguards =
          rowData.controlScope === 'category' ||
          securityProfile.control_scope === 'category';

        if (isSafeguards) {
          const hasSafeguards =
            securityProfile.nist_v2_safeguard_implementation &&
            rowData.control in securityProfile.nist_v2_safeguard_implementation;
          return hasSafeguards;
        }
        const hasIGs =
          securityProfile.nist_v2_implementation_level_igs &&
          rowData.control in securityProfile.nist_v2_implementation_level_igs;
        return hasIGs;
      })
      .flatMap((securityProfile) => {
        const isSafeguards =
          rowData.controlScope === 'category' ||
          securityProfile.control_scope === 'category';

        if (isSafeguards) {
          const safeguardsData =
            (securityProfile.nist_v2_safeguard_implementation as any)?.[
            rowData.control
            ] || {};
          const controlData =
            NIST_V2_CONTROL_CODE_MAP_DESC[rowData.control as NistV2Code];

          if (!controlData) {
            return [];
          }

          // Get all subcategories for this control
          const subcategories = Object.entries(controlData.subcategories);

          return subcategories
            .filter(([subcategoryKey, subcategoryTitle]) => {
              const currentValue = safeguardsData[subcategoryKey] || 0;

              // If already at max value, don't include
              if (currentValue >= 1.0) return false;
              const firstTargetValue = parseFloat(
                rowData.targetMinimum || BATTERY_OPTIONS[1].value,
              );
              const actualTargetValue = convertToNistV2Value(firstTargetValue);
              return currentValue < actualTargetValue;
            })
            .map(([subcategoryKey, subcategoryTitle]) => {
              const currentValue = safeguardsData[subcategoryKey] || 0;
              const firsttargetValue = parseFloat(
                rowData.targetMinimum || BATTERY_OPTIONS[1].value,
              );
              const targetValue = convertToNistV2Value(firsttargetValue);

              const scale = rowData.scale || '1_5';
              const actionLabelValue = convertSphereValueToDisplay(
                targetValue,
                scale,
                true,
              );
              const currentLabelValue = convertSphereValueToDisplay(
                currentValue,
                scale,
              );

              return {
                name: subcategoryTitle,
                type: `${String(currentLabelValue)} → ${String(actionLabelValue)}`,
                index: subcategoryKey,
                title: subcategoryTitle,
              };
            });
        } else {
          const controlData =
            NIST_V2_CONTROL_CODE_MAP_DESC[rowData.control as NistV2Code];

          if (!controlData) {
            return [];
          }

          // Get the first subcategory for this control
          const firstSubcategory = Object.entries(controlData.subcategories)[0];
          if (!firstSubcategory) {
            return [];
          }
          const [subcategoryKey, subcategoryTitle] = firstSubcategory;
          const filteredIndex =
            rowData.controlScope === 'control'
              ? subcategoryKey.split('-')[0]
              : subcategoryKey;
          const currentValue = parseFloat(rowData.currentMinimum || '0');
          const firsttargetValue = parseFloat(
            rowData.targetMinimum || BATTERY_OPTIONS[1].value,
          );
          const targetValue = convertToNistV2Value(firsttargetValue);

          const scale = rowData.scale || '1_5';
          const actionLabelValue = convertSphereValueToDisplay(
            targetValue,
            scale,
            true,
          );
          const currentLabelValue = convertSphereValueToDisplay(
            currentValue,
            scale,
          );

          return [
            {
              name: subcategoryTitle,
              type: `${String(currentLabelValue)} → ${String(actionLabelValue)}`,
              index: filteredIndex,
              title: subcategoryTitle,
            },
          ];
        }
      }) || []
  );
};

const getControlsFromIso27001Implementation = (
  isoImplementation: ISO27001ImplementationLevel,
) => {
  return Object.values(isoImplementation).reduce(
    (acc, val) => ({
      ...acc,
      ...val,
    }),
    {} as Record<ISO27001ControlNumbersType, number>,
  );
};

const getAssetGroupsByISO = (
  securityProfiles: SphereSecurityProfileForm[] | null | undefined,
  rowData: {
    control: string;
    currentMinimum: string;
    targetMinimum?: string;
    scale?: string;
    controlScope?: string;
  },
  allAgIds: string[],
) => {
  return (
    securityProfiles
      ?.filter((securityProfile) => {
        if (!securityProfile.iso27001_implementation_level) {
          return false;
        }
        const controls = getControlsFromIso27001Implementation(
          securityProfile.iso27001_implementation_level,
        );
        return (
          securityProfile.iso27001_implementation_level &&
          rowData.control in controls &&
          controls[rowData.control as ISO27001ControlNumbersType] ==
          Number(rowData.currentMinimum) //when on nist the currentMinimum will be a number
        );
      })
      .flatMap((securityProfile) => {
        const existingAgs = securityProfile.asset_groups.filter((ag) =>
          allAgIds.includes(ag.id || ''),
        );
        return existingAgs;
      }) || []
  );
};

const getCisControlsForMitigationAction = (
  currentMinimum: string,
  targetMinimum: string,
): ControlStatus[] => {
  const startIndex = cisControlsByOrder.indexOf(
    currentMinimum as OrderedCisControl,
  );
  const endIndex = cisControlsByOrder.indexOf(
    targetMinimum as OrderedCisControl,
  );
  if (startIndex === -1 || endIndex === -1 || startIndex > endIndex) {
    return [];
  }
  return cisControlsByOrder.slice(startIndex, endIndex);
};
const getNistControlsForMitigationAction = (
  currentMinimum: string,
  targetMinimum: string,
): number[] => {
  return Array.from(
    {
      length: Number(targetMinimum) - Number(currentMinimum),
    },
    (_, index) => index + Number(currentMinimum),
  );
};

const getNistV2ControlsForMitigationAction = (
  currentMinimum: string,
  targetMinimum: string,
): number[] => {
  const current = parseFloat(currentMinimum);
  const target = parseFloat(targetMinimum);

  if (current >= target) {
    return [];
  }
  const result = [current];
  return result;
};

const getISOControlsForMitigationAction = (
  currentMinimum: string,
  targetMinimum: string,
): number[] => {
  return Array.from(
    {
      length: (Number(targetMinimum) - Number(currentMinimum)) * 2,
    },
    (_, index) => index * 0.5 + Number(currentMinimum),
  );
};

export type ControlsFrameworkHelper = {
  getText: (id: string, trans?: ISOControlsType) => ControlText;
  getAssetGroups: (
    securityProfiles: SphereSecurityProfileForm[] | null | undefined,
    rowData: {
      control: string;
      currentMinimum: string;
      targetMinimum?: string;
      scale?: string;
    },
    allAgIds: string[],
  ) => AssetGroupRow[];
  getControlsForMitigationAction: (
    currentMinimum: string,
    targetMinimum: string,
  ) => any[];
};

export const controlsFrameworkHelper: Record<
  SecControlsFrameworkType,
  ControlsFrameworkHelper
> = {
  [SecControlsFramework.CIS]: {
    getText: getCisText,
    getAssetGroups: getAssetGroupsByCis,
    getControlsForMitigationAction: getCisControlsForMitigationAction,
  },
  [SecControlsFramework.CISv8]: {
    getText: getCisV8Text,
    getAssetGroups: getAssetGroupsByCisV8,
    getControlsForMitigationAction: getCisControlsForMitigationAction,
  },
  [SecControlsFramework.NIST]: {
    getText: getNistText,
    getAssetGroups: getAssetGroupsByNist,
    getControlsForMitigationAction: getNistControlsForMitigationAction,
  },
  [SecControlsFramework.NIST_CSF_v2]: {
    getText: getNistV2Text,
    getAssetGroups: getAssetGroupsByNistV2,
    getControlsForMitigationAction: getNistV2ControlsForMitigationAction,
  },
  [SecControlsFramework.ASB]: {
    getText: (id: string, trans?: any) => ({
      title: '',
      secondaryTitle: '',
      desc: '',
      classifications: [],
    }),
    getAssetGroups: (
      securityProfiles: SphereSecurityProfileForm[] | null | undefined,
      rowData: { control: string; currentMinimum: string },
      allAgIds: string[],
    ) => [],
    getControlsForMitigationAction: (
      currentMinimum: string,
      targetMinimum: string,
    ) => [],
  },
  [SecControlsFramework.ISO27001]: {
    getText: getISOText,
    getAssetGroups: getAssetGroupsByISO,
    getControlsForMitigationAction: getISOControlsForMitigationAction,
  },
};

const ControlToCode = { ...CISNameToCode, ...NistNameToCode };

export const sortControls = <T = any>(
  rowA: Row<T>,
  rowB: Row<T>,
  columnId: string,
): number => {
  const controlA = rowA.getValue(columnId);
  const controlB = rowB.getValue(columnId);
  if (typeof controlA !== 'string' || typeof controlB !== 'string') {
    return 0;
  }
  return ControlToCode[controlA as CisAbbreviation] <
    ControlToCode[controlB as CisAbbreviation] // also add Nist
    ? 1
    : -1;
};

export const sortControlActions = <T = any>(
  rowA: Row<T>,
  rowB: Row<T>,
  columnId: string,
): number => {
  const [rowAValue, _1] = rowA.getValue(columnId) as [string, string];
  const [rowBValue, _2] = rowB.getValue(columnId) as [string, string];
  // incase we receive nist results, the status will be a number so no need to convert to text.
  const statusA = MAP_TEXT_CIS[rowAValue] ?? rowAValue;
  const statusB = MAP_TEXT_CIS[rowBValue] ?? rowBValue;
  return statusA < statusB ? 1 : -1;
};

export const sortStatuses = <T = any>(
  rowA: Row<T>,
  rowB: Row<T>,
  columnId: string,
): number => {
  const rowAValue = rowA.getValue(columnId);
  const rowBValue = rowB.getValue(columnId);
  return sortStatusesByValues(rowAValue as string, rowBValue as string);
};
export const sortStatusesByValues = (
  valueA: string,
  valueB: string,
): number => {
  // incase we receive nist results, the status will be a number so no need to convert to text.
  const statusA = MAP_TEXT_CIS[valueA] ?? valueA;
  const statusB = MAP_TEXT_CIS[valueB] ?? valueB;
  return statusA < statusB ? 1 : -1;
};

export const sortIfNotSubRow = <T = any>(
  rowA: Row<T>,
  rowB: Row<T>,
  columnId: string,
): number => {
  const rowAValue = Number(rowA.getValue(columnId));
  const rowBValue = Number(rowB.getValue(columnId));
  return rowA.depth === 0 && rowB.depth === 0 ? rowAValue - rowBValue : 0;
};

export const genericFilter: FilterFn<any> = (
  row: Row<any>,
  columnId: string,
  value: string,
  _,
) => {
  const rowValue = String(row.getValue(columnId)).toLocaleLowerCase();
  return rowValue.includes(value);
};
