import { Tech, ServiceProvider } from 'types/quantificationData';
import { ExtendedAssetGroupType, TechOption } from 'types/sphereForm';
export interface Option {
  label: string;
  value: any;
}

export const getLabel = (key: string | number, options: Option[]): string => {
  const option = options.find((o) => o.value === key);
  return option ? option.label : key.toString();
};

export const getOptions = (
  values: (string | number)[],
  options: Option[]
): Option[] => {
  const result: Option[] = [];
  if (Array.isArray(values)) {
    options.forEach((option) => {
      if (values.includes(option.value)) result.push(option);
    });
  }
  return result;
};

export const getSingleOption = (
  value: string | number | undefined,
  options: Option[]
): Option | undefined => {
  if (!value) {
    return undefined;
  }
  const v = options.find((o) => o.value === value);
  if (!v) {
    console.error(`can't find option with value ${value}`);
    return { value, label: value.toString() };
  }
  return v;
};

const capitalize = (value: string) => {
  const lower = value.toLowerCase();
  return value.charAt(0).toUpperCase() + lower.slice(1);
};

export const getOptionsFromKXEs = (
  kxes: string[],
  type: 'tech' | 'provider'
): TechOption[] => {
  return kxes
    .filter((kxe) => !kxe.startsWith('os'))
    .map((kxe) => ({
      label: capitalize(kxe.replaceAll(/:|_|\*/g, ' ')), // replace (':', '*', '_') with white space
      value: kxe,
      type: type,
    }));
};

export const getOsOptions = (kxes: string[]) => {
  return kxes
    .filter((kxe) => kxe.startsWith('os'))
    .map((kxe) => ({
      label: capitalize(kxe.replaceAll(/:|_|\*/g, ' ')), // replace (':', '*', '_') with white space
      value: kxe,
    }));
};

export const getAllKXEs = (
  hazard: Tech | ServiceProvider | Record<string, unknown>
) => Array.from(new Set(Object.values(hazard).flat()));

export const sortKXEOptions = (options: any[], selectedOptions: any[]) => {
  return options.sort((a, b) => {
    if (selectedOptions.map((o) => o.value).includes(a.value)) {
      return -1;
    }
    if (selectedOptions.map((o) => o.value).includes(b.value)) {
      return 1;
    }
    return 0;
  });
};

export const getAGTypeLabel = (agType: ExtendedAssetGroupType | '') => {
  // remove the first 2 conditions once we finish this task
  // https://kovrr.atlassian.net/browse/KOV-5456
  return agType === 'infra'
    ? 'Infrastructure'
    : agType === 'endpoints'
    ? 'Employee Endpoints'
    : agType === 'employee_endpoints'
    ? 'Employee Endpoints'
    : agType === 'infrastructure'
    ? 'Infrastructure'
    : agType === 'cloud'
    ? 'Cloud'
    : '';
};
