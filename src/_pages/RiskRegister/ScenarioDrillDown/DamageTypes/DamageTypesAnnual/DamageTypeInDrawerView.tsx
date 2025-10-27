import { useCurrentRiskRegisterScenario } from '@/services/hooks';
import type { CurrencyCode } from '@/helpers/converters';
import { Flex, type FlexProps } from '@chakra-ui/react';
import { type FC, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { CostComponents } from 'types/riskDrivers/damageTypes';
import { DamageTypeExposureContext } from '../context';
import {
  ProgressItem,
  type ProgressStyleProps,
} from '../ProgressItem/ProgressItem';
import { useDamageTypesProgressData } from '../use-damage-types-progress-data';
import { getDamageTypeDetails, getTestId } from './helpers';

type Props = {
  withoutGroupLow?: boolean;
  progressStyles?: ProgressStyleProps;
  aal: number;
} & FlexProps;

export const DamageTypeInDrawerView: FC<Props> = ({
  withoutGroupLow,
  progressStyles,
  aal,
  ...restProps
}) => {
  const { exposure } = useContext(DamageTypeExposureContext)!;
  const {
    MAX_ITEMS,
    metricSum: aalSum,
    damageTypesSorted,
  } = useDamageTypesProgressData({
    exposure,
    inDrawer: true,
    metricType: 'aal',
  });
  const { t } = useTranslation('resultsNarrative', {
    keyPrefix: 'riskDrivers',
  });
  const { data: scenario } = useCurrentRiskRegisterScenario();

  const currency = (scenario?.scenario_data.average_loss_currency ||
    'USD') as CurrencyCode;

  const nonGroupedDamageTypes = damageTypesSorted;

  return (
    <Flex mt='16px' direction='column' height='90%' gap='15px' {...restProps}>
      {Object.entries(nonGroupedDamageTypes)
        .sort(([, vector1], [, vector2]) => vector2 - vector1)
        .slice(0, MAX_ITEMS)
        .map(([damageType, exposure]) => {
          const isCustomDamageType = !(damageType in CostComponents);
          const { info, title } = getDamageTypeDetails(
            damageType,
            isCustomDamageType,
            t,
          );

          return (
            <ProgressItem
              title={title}
              percentage={exposure / aalSum}
              amount={exposure * aal}
              key={damageType}
              data-testid={getTestId(damageType)}
              minHeight='50px'
              maxHeight='50px'
              titleWidth='120px'
              info={info}
              bulletListTitle={t('damageTypes.tooltips.bulletListTitle')}
              hoverable={true}
              currency={currency}
              {...progressStyles}
            />
          );
        })}
    </Flex>
  );
};
