import { useQuantificationByCostComponents } from 'service/fq';
import { DamageTypesExposure } from './common/ExposureParameter';

type Props = {
  exposure: DamageTypesExposure;
  inDrawer: boolean;
  metricType: 'aal' | 'targeted_annual_rate';
};

export const useDamageTypesProgressData = ({ exposure, inDrawer }: Props) => {
  // unite all attritional costs and add them to the exposure and remove the original attritional costs
  const attritionalCosts = Object.entries(exposure).filter(([key]) =>
    key.includes('attritional'),
  );
  const attritionalCostsSum = attritionalCosts.reduce(
    (prev, curr) => prev + curr[1],
    0,
  );
  const exposureWithoutOriginalAttritional = Object.fromEntries(
    Object.entries(exposure).filter(([key]) => !key.includes('attritional')),
  );
  const exposureWithSummedAttritional = {
    ...exposureWithoutOriginalAttritional,
    attritional: attritionalCostsSum,
  };
  const damageTypesSorted = Object.fromEntries(
    Object.entries(exposureWithSummedAttritional).sort(
      (exposure1, exposure2) => exposure2[1] - exposure1[1],
    ),
  );
  const metricSum =
    Object.values(damageTypesSorted).reduce((prev, curr) => prev + curr, 0) ||
    1;
  const MAX_ITEMS = inDrawer ? Object.entries(damageTypesSorted).length : 5;

  return {
    metricSum,
    MAX_ITEMS,
    damageTypesSorted,
  };
};

export const useIsDamageTypesDataAvailable = () => {
  const { cost_components_breakdown } = useQuantificationByCostComponents();

  return !!cost_components_breakdown;
};
