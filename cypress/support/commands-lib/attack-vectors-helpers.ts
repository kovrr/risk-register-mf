import { partitionByCondition } from 'helpers/objectHelpers';
import { QuantificationData } from 'types/quantificationData';

export const prepareAttackVectors = (quantification: QuantificationData) => {
  const byInitialAttackVector =
    quantification.results_narrative?.by_initial_vector_exposure ?? {};

  const attackVectorsSorted = Object.fromEntries(
    Object.entries({
      ...byInitialAttackVector,
    }).sort(
      (likelihood1, likelihood2) => likelihood2[1].aal - likelihood1[1].aal
    )
  );

  const [clickableAttackVectors, notClickableAttackVectors] =
    partitionByCondition({
      objectToPartition: attackVectorsSorted,
      condition: (value) => value.targeted_annual_rate >= 0.01,
    });

  const SUM_AAL = Object.values(attackVectorsSorted).reduce(
    (prev, curr) => prev + curr.aal,
    0
  );

  const attackVectorsLikelihoodSorted = Object.fromEntries(
    Object.entries({
      ...byInitialAttackVector,
    }).sort(
      (likelihood1, likelihood2) =>
        likelihood2[1].targeted_annual_rate -
        likelihood1[1].targeted_annual_rate
    )
  );

  const [
    clickableAttackVectorsLikelihood,
    notClickableAttackVectorsLikelihood,
  ] = partitionByCondition({
    objectToPartition: attackVectorsLikelihoodSorted,
    condition: (value) => value.targeted_annual_rate >= 0.01,
  });

  const sumLikelihood = Object.values(attackVectorsLikelihoodSorted).reduce(
    (accumulator, currentValue) =>
      accumulator + currentValue.targeted_annual_rate,
    0
  );

  return {
    byInitialAttackVector,
    attackVectorsSorted,
    clickableAttackVectors,
    notClickableAttackVectors,
    SUM_AAL,
    attackVectorsLikelihoodSorted,
    sumLikelihood,
    clickableAttackVectorsLikelihood,
    notClickableAttackVectorsLikelihood,
  };
};
