import {
  CisCategory,
  CIS_CATEGORY_LEN,
  isCisCategory,
  isIso27001Category,
  ISO27001CategoryType,
  ISO27001_CATEGORY_LEN,
} from './cisControls';
import {
  isNistCategory,
  NistCategory,
  NIST_CATEGORY_LEN,
} from './nistControls';

export type ControlCategory = NistCategory | CisCategory | ISO27001CategoryType;
export type CategoryAggregator = { [cat in ControlCategory]?: number };
export const isCategory = (c: any): c is ControlCategory =>
  isCisCategory(c) || isNistCategory(c) || isIso27001Category(c);

export const CATEGORY_LENGTHS = {
  ...CIS_CATEGORY_LEN,
  ...NIST_CATEGORY_LEN,
  ...ISO27001_CATEGORY_LEN,
};
