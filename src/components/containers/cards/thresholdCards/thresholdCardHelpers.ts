import { ThresholdType, ThresholdTypes } from 'types/quantificationData';

export const getDurationAmountAndSuffix = (thresholdValue: number) => ({
  value: thresholdValue / 60, // model results are in minutes and we need to convert to hours
  suffix: 'Hours',
});

const thresholdValueByCurveType = {
  [ThresholdTypes.COST]: (thresholdValue: number) => thresholdValue,
  [ThresholdTypes.RECORDS]: (thresholdValue: number) => thresholdValue,
  [ThresholdTypes.DURATION]: (thresholdValue: number) => thresholdValue / 60,
};
export const getThresholdValueByCurveType = ({
  thresholdValue,
  curveType,
}: {
  thresholdValue: number;
  curveType: ThresholdType;
}) => thresholdValueByCurveType[curveType](thresholdValue);
