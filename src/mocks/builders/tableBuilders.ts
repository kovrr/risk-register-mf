import { AGLevelRecommendation } from 'components/ui/tables/types';
import { SecControlsFrameworkType } from 'options/constants';
import {
  AssetGroupInformation,
  QuantificationOld,
} from 'types/quantificationData';
import { MAP_TEXT_CIS } from 'types/quantificationForm';
import {
  ByAssetGroup,
  ByControlToMinimal,
  ControlStatus,
  ignoredCurrentMinimums,
} from 'types/security-controls';
import { ControlRow } from '_pages/FinancialQuantification/Mitigation/types';
import { getDesc } from '_pages/FinancialQuantification/Mitigation/utils';

const sortStatusesByValues = (valueA: string, valueB: string): number => {
  // incase we receive nist results, the status will be a number so no need to convert to text.
  const statusA = MAP_TEXT_CIS[valueA] ?? valueA;
  const statusB = MAP_TEXT_CIS[valueB] ?? valueB;
  return statusA < statusB ? 1 : -1;
};

export const extractWhatIfTableData = (
  byControlToMinimal: ByControlToMinimal,
  secControlsFramework: SecControlsFrameworkType,
  resultsLimit?: number
): ControlRow[] => {
  const rowsByControl = Object.entries(byControlToMinimal)
    .map(([control, controlData]) => {
      return Object.entries(controlData)
        .filter(
          ([, { current_status }]) =>
            !ignoredCurrentMinimums[secControlsFramework].has(current_status)
        )
        .map(([targetStatus, controlScenario]) => {
          return {
            control: control,
            controlFunction: getDesc[secControlsFramework](control),
            currentMinimum: controlScenario.current_status,
            targetMinimum: targetStatus,
            averageEffect: controlScenario.aal_effect,
            averageDamage: controlScenario.aal_damage,
            highEffect: controlScenario.pml_effect,
            highDamage: controlScenario.pml_damage,
            newAverage: controlScenario.by_minimal_new_average,
          };
        })
        .filter(
          (checkIFNoReduction) =>
            checkIFNoReduction.averageEffect !== 0 ||
            checkIFNoReduction.highEffect !== 0
        );
    })
    .filter((checkIfEmpty) => checkIfEmpty.length !== 0);
  const rows = rowsByControl.map((controlRows) => {
    controlRows.sort((a, b) =>
      sortStatusesByValues(b.targetMinimum, a.targetMinimum)
    );
    const parentRow = { ...controlRows[0] };
    const subRows = controlRows.slice(1);
    return subRows.length === 0 ? parentRow : { ...parentRow, subRows };
  });
  return rows.slice(0, resultsLimit);
};

export const extractRecommendationDataNewSchema = ({
  byAssetGroup,
  assetGroupInformation,
}: {
  byAssetGroup?: ByAssetGroup;
  assetGroupInformation?: AssetGroupInformation;
}) => {
  const flat: AGLevelRecommendation[] = [];

  Object.entries(byAssetGroup || []).forEach(([agId, byControl]) => {
    Object.entries(byControl).forEach(([controlName, byNewStatus]) => {
      Object.entries(byNewStatus).forEach(([newStatus, recommendation]) => {
        const ag = assetGroupInformation?.[agId] || {
          name: '',
          type: '',
        };
        flat.push({
          assetGroup: ag.name,
          assetGroupType: ag.type,
          controlName,
          action: [recommendation.current_status, newStatus] as [
            ControlStatus,
            ControlStatus
          ],
          averageEffect: recommendation.aal_effect,
          averageDamage: recommendation.aal_damage,
          highDamage: recommendation.pml_damage,
          highEffect: recommendation.pml_effect,
        });
      });
    });
  });
  return flat;
};

export const extractRecommendationData = (raw: QuantificationOld) => {
  const flat: AGLevelRecommendation[] = [];
  Object.entries(raw.control_scenarios?.by_asset_group || []).forEach(
    ([agId, byControl]) => {
      Object.entries(byControl).forEach(([controlName, byNewStatus]) => {
        Object.entries(byNewStatus).forEach(([newStatus, recommendation]) => {
          const ag = raw.asset_group_information?.[agId] || {
            name: '',
            type: '',
          };
          flat.push({
            assetGroup: ag.name,
            assetGroupType: ag.type,
            controlName,
            action: [recommendation.current_status, newStatus] as [
              ControlStatus,
              ControlStatus
            ],
            averageEffect: recommendation.aal_effect,
            averageDamage: recommendation.aal_damage,
            highDamage: recommendation.pml_damage,
            highEffect: recommendation.pml_effect,
          });
        });
      });
    }
  );
  return flat;
};
