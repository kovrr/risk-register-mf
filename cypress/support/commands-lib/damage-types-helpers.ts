import { partitionByCondition } from 'helpers/objectHelpers';
import { QuantificationData } from 'types/quantificationData';

export const prepareDamageTypes = (quantification: QuantificationData) => {
  // Get damage types from cost_components_breakdown
  const damageTypes =
    quantification.results_narrative?.cost_components_breakdown ?? {};
  const attritionalCosts = Object.entries(damageTypes).filter(([key]) =>
    key.includes('attritional')
  );
  const attritionalCostsSum = attritionalCosts.reduce(
    (prev, curr) => prev + curr[1],
    0
  );
  const damageTypesWithoutOriginalAttritional = Object.fromEntries(
    Object.entries(damageTypes).filter(([key]) => !key.includes('attritional'))
  );
  const damageTypesWithSummedAttritional = {
    ...damageTypesWithoutOriginalAttritional,
    attritional: attritionalCostsSum,
  };
  // Sort damage types by AAL (Annual Average Loss)
  const damageTypesSorted = Object.fromEntries(
    Object.entries(damageTypesWithSummedAttritional).sort(
      (dt1, dt2) => dt2[1] - dt1[1]
    ) // Simple numeric sort since values are numbers
  );

  // Partition into clickable (>= 0.01) and non-clickable (< 0.01) damage types
  const [clickableDamageTypes, notClickableDamageTypes] = partitionByCondition({
    objectToPartition: damageTypesSorted,
    condition: (value) => value >= 0.01,
  });

  // Calculate total AAL
  const SUM_AAL = Object.values(damageTypesSorted).reduce(
    (prev, curr) => prev + curr,
    0
  );

  return {
    damageTypesSorted,
    clickableDamageTypes,
    notClickableDamageTypes,
    SUM_AAL,
  };
};
