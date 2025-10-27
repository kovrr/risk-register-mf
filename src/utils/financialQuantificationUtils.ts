// exposure is the x parameter of the graph, probability is the y parameter of the graph

import { CisAbbreviation } from 'options/cisControls';
import { useCurrentQuantification } from '@/services/hooks';
import { EpPoint } from 'types/quantificationData';

const getSlope = (point1: EpPoint, point2: EpPoint) => {
  const slope =
    (point1.probability - point2.probability) /
    (point1.exposure - point2.exposure);
  return slope;
};

const getInterpolatedValue = (
  point1: EpPoint,
  newPointX: number,
  slope: number,
) => {
  const interpolatedValue =
    point1.probability + (newPointX - point1.exposure) * slope;
  return interpolatedValue;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const addPointsToGraph = (curveArrayData: EpPoint[], newPointX: any) => {
  const curveArray = [...curveArrayData];

  let start = 0;
  let end = curveArray.length - 1;
  while (start <= end) {
    // this function is using binary search to insert new value in the correct place
    const middle = Math.floor((start + end) / 2);
    if (curveArray[middle].exposure === newPointX) {
      return curveArray;
    }
    if (curveArray[middle - 1]) {
      if (
        curveArray[middle].exposure < newPointX &&
        curveArray[middle - 1].exposure > newPointX
      ) {
        const slope = getSlope(curveArray[middle - 1], curveArray[middle]);
        const interpolatedValue = getInterpolatedValue(
          curveArray[middle - 1],
          newPointX,
          slope,
        );
        curveArray.splice(middle, 0, {
          exposure: newPointX,
          probability: interpolatedValue,
        });
        return curveArray;
      } else if (curveArray[middle].exposure > newPointX) {
        start = middle + 1;
      } else {
        end = middle - 1;
      }
    } else {
      return curveArray;
    }
  }
  return curveArray;
};

export const CISNameToCode: Record<CisAbbreviation, number> = {
  ICSA: 2,
  ICHA: 1,
  CVM: 3,
  CUAP: 4,
  SCHS: 5,
  MMAAL: 6,
  EWBP: 7,
  MD: 8,
  LCNPPS: 9,
  DRC: 10,
  SCND: 11,
  BD: 12,
  DP: 13,
  CAB: 14,
  WAC: 15,
  AMC: 16,
  ISA: 17,
  ASS: 18,
  IRM: 19,
  PTRT: 20,
};

export const useTabsMapper = () => {
  const { data: quantification } = useCurrentQuantification();
  const shouldShowTab = {
    'risk-overview': true,
    'financial-exposure': true,
    recommendations:
      quantification?.results?.cis_recommendation &&
      !quantification.results.control_scenarios,
    mitigation:
      quantification?.results?.control_scenarios &&
      quantification.input_data?.sphere,
    'risk-transfer': true,
    'third-party-risk': true,
    transparency: true,
  };
  const visibleTabs = Object.entries(shouldShowTab)
    .filter(([_, condition]) => condition)
    .map(([tab, _]) => tab);
  const locationToIndex = Object.fromEntries(
    visibleTabs.map((tab, index) => [tab, index]),
  );

  return { shouldShowTab, locationToIndex, tabIndexToLocation: visibleTabs };
};
