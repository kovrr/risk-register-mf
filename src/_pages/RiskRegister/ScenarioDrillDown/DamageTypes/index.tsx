import { CardWithDescription } from 'components/containers/cards/CardWithDescription';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { RiskDriverDamageTypesProps } from 'types/riskDrivers/damageTypes';
import { DamageTypesExposure } from './common/ExposureParameter';
import { DamageTypeExposureContext } from './context';
import { DamageTypesAnnual } from './DamageTypesAnnual';

export const RiskDriverDamageTypes: FC<
  RiskDriverDamageTypesProps & {
    exposure: DamageTypesExposure;
    title?: string;
    description?: string;
    isClickable?: boolean;
    showBenchmarks?: boolean;
  }
> = ({
  exposure,
  inDrawer,
  title,
  description,
  isClickable = false,
  showBenchmarks = true,
  aal,
}) => {
  const { t } = useTranslation('riskRegister', {
    keyPrefix: 'damageTypes',
  });

  const drawerStyles = inDrawer
    ? {
        width: '100%',
      }
    : {};

  return (
    <DamageTypeExposureContext.Provider
      value={{
        exposure,
        isClickable,
        showBenchmarks,
        customCostComponents: exposure,
      }}
    >
      <CardWithDescription
        data-testid='DamageTypes'
        title={title ?? t('title')}
        description={description ?? t('description')}
        moreInfo={t('moreInfo')}
        moreInfoLink={t('moreInfoLink')}
        mb='auto'
        maxWidth={undefined}
        width={undefined}
        panel={<DamageTypesAnnual inDrawer={inDrawer} aal={aal} />}
        {...drawerStyles}
      />
    </DamageTypeExposureContext.Provider>
  );
};
