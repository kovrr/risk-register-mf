import { convertToInternationalCurrencySystemToFixed } from 'components/ui/charts/utils';
import { QuantificationData } from 'types/quantificationData';

export const getLossFromCyberEventsRanges = ({
  quantification,
}: {
  quantification: QuantificationData;
}) => {
  const percentiles =
    quantification?.results_narrative?.simulation_exposure.top_simulation_stats
      .event_loss.percentiles;

  if (!percentiles)
    return {
      mostLikelyHighValue: '',
      mostLikelyHighOrder: '',
      mostLikelyLowValue: '',
      mostLikelyLowOrder: '',
      extremeHighValue: '',
      extremeHighOrder: '',
      extremeLowValue: '',
      extremeLowOrder: '',
      currency: '',
    };

  const {
    40: mostLikelyLow,
    60: mostLikelyHigh,
    95: extremeLow,
    99: extremeHigh,
  } = percentiles;

  const { value: mostLikelyLowValue, suffix: mostLikelyLowOrder } =
    convertToInternationalCurrencySystemToFixed(mostLikelyLow);
  const { value: mostLikelyHighValue, suffix: mostLikelyHighOrder } =
    convertToInternationalCurrencySystemToFixed(mostLikelyHigh);
  const { value: extremeLowValue, suffix: extremeLowOrder } =
    convertToInternationalCurrencySystemToFixed(extremeLow);
  const { value: extremeHighValue, suffix: extremeHighOrder } =
    convertToInternationalCurrencySystemToFixed(extremeHigh);

  return {
    mostLikelyHighValue,
    mostLikelyHighOrder,
    mostLikelyLowValue,
    mostLikelyLowOrder,
    extremeHighValue,
    extremeHighOrder,
    extremeLowValue,
    extremeLowOrder,
    currency: '$',
  };
};
