import React, { FC, PropsWithChildren } from 'react';
import { ThresholdType, ThresholdTypes } from 'types/quantificationData';
import { getClosestPercentileValue } from '_pages/ResultsNarrative/MaterialityTab/CustomThreshold/helpers';
import { getThresholdValueByCurveType } from './thresholdCardHelpers';
import {
  CardTranslationPrefix,
  ThresholdCardType,
  ThresholdCardTypes,
} from './types';

export type ThresholdCardContextType = {
  threshold: number;
  targetedAnnualRate: number;
  thresholdValue: number;
  currency: string;
  likelihoodPercentage: number;
  translationPrefix: CardTranslationPrefix;
  curveType: ThresholdType;
  cardType?: ThresholdCardType;
};

const contextInitialValue: ThresholdCardContextType = {
  threshold: 0,
  targetedAnnualRate: 0,
  thresholdValue: 0,
  likelihoodPercentage: 0,
  currency: '',
  translationPrefix: 'financialExposure',
  curveType: ThresholdTypes.COST,
  cardType: ThresholdCardTypes.CUSTOM,
};

const ThresholdCardContext =
  React.createContext<ThresholdCardContextType>(contextInitialValue);

export const ThresholdCardContextProvider: FC<
  Omit<ThresholdCardContextType, 'likelihoodPercentage'> & {
    percentiles: Record<number, number>;
  } & PropsWithChildren
> = ({
  children,
  thresholdValue,
  currency,
  curveType,
  targetedAnnualRate,
  threshold,
  translationPrefix,
  cardType,
  percentiles,
}) => {
  const likelihoodPercentage = React.useMemo(() => {
    const value = getThresholdValueByCurveType({ thresholdValue, curveType });
    return percentiles !== undefined
      ? 100 - getClosestPercentileValue(percentiles, value).percentile
      : 0;
  }, [curveType, percentiles, thresholdValue]);

  return (
    <ThresholdCardContext.Provider
      value={{
        thresholdValue,
        currency,
        curveType,
        targetedAnnualRate,
        threshold,
        translationPrefix,
        cardType,
        likelihoodPercentage,
      }}
    >
      {children}
    </ThresholdCardContext.Provider>
  );
};

export const useThresholdCardContext = () => {
  const context = React.useContext(ThresholdCardContext);
  if (!context) {
    throw new Error(
      'useThresholdCardContext must be used within a ThresholdCardContextProvider'
    );
  }
  return context;
};
