import { useCurrentRiskRegisterScenario } from '@/services/hooks';
import type { CurrencyCode } from '@/helpers/converters';
import { Flex, Text } from '@chakra-ui/react';
import { type FC, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { CostComponents } from 'types/riskDrivers/damageTypes';
import { DamageTypeExposureContext, PROGRESS_ITEMS } from '../context';
import { ProgressItem } from '../ProgressItem/ProgressItem';
import { useDamageTypesProgressData } from '../use-damage-types-progress-data';
import { getDamageTypeDetails, getTestId } from './helpers';

export const DamageTypeMainView: FC<{
  openDrawer: () => void;
  aal: number;
}> = ({ openDrawer, aal }) => {
  const { t } = useTranslation('resultsNarrative', {
    keyPrefix: 'riskDrivers',
  });
  const { exposure, showSeeAll = true } = useContext(
    DamageTypeExposureContext,
  )!;
  const { data: scenario } = useCurrentRiskRegisterScenario();
  const currency = (scenario?.scenario_data.average_loss_currency ||
    'USD') as CurrencyCode;

  const {
    MAX_ITEMS,
    metricSum: aalSum,
    damageTypesSorted,
  } = useDamageTypesProgressData({
    exposure,
    inDrawer: false,
    metricType: 'aal',
  });
  return (
    <Flex
      direction='column'
      justifyContent='space-between'
      gap='15px'
      mt='16px'
    >
      {Object.entries(damageTypesSorted)
        .slice(0, MAX_ITEMS)
        .map(([damageType, exposure]) => {
          const isCustomDamageType = !(damageType in CostComponents);
          const { info, lossImpactList, title } = getDamageTypeDetails(
            damageType,
            isCustomDamageType,
            t,
          );

          const lossImpactListWithVariant = lossImpactList?.length
            ? lossImpactList.map((lossImpact) => ({
              title: lossImpact,
              bgColor: PROGRESS_ITEMS[lossImpact].bgColor,
            }))
            : undefined;

          return (
            <ProgressItem
              currency={currency}
              title={title}
              percentage={exposure / aalSum}
              amount={exposure * aal}
              key={damageType}
              data-testid={getTestId(damageType)}
              minHeight='50px'
              maxHeight='50px'
              titleWidth='120px'
              info={info}
              bulletList={lossImpactListWithVariant}
              bulletListTitle={t('damageTypes.tooltips.bulletListTitle')}
              hoverable={true}
            />
          );
        })}

      {showSeeAll && (
        <Text fontSize='14px' align='end' cursor='pointer' onClick={openDrawer}>
          {t('seeAll')}
        </Text>
      )}
    </Flex>
  );
};
