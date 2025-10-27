import { ControlStatus } from 'types/security-controls';
import { ExtendedAssetGroupType } from 'types/sphereForm';

export type AGLevelRecommendation = {
  assetGroup: string;
  assetGroupType: ExtendedAssetGroupType | '';
  controlName: string;
  action: [ControlStatus, ControlStatus]; //From IG to IG
  averageEffect: number;
  averageDamage: number;
  highEffect: number;
  highDamage: number;
};
