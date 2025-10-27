import { ScaleEnum } from "@/options/nistV2Controls";

export interface ControlRow {
  control: string;
  controlFunction: string;
  currentMinimum: string;
  targetMinimum: string;
  averageEffect: number;
  averageDamage: number;
  highEffect: number;
  highDamage: number;
  newAverage?: number;
  subRows?: ControlRow[];
  scale?: ScaleEnum;
  controlScope?: string;
}

export interface AssetGroupRow {
  name: string;
  type: string;
  index?: string;
  title?: string;
}
