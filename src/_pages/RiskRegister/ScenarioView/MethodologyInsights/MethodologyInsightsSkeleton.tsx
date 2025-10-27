import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/atoms/card';
import { Skeleton } from '@/components/atoms/skeleton';
import { BasicTooltip } from '@/components/molecules/BasicTooltip';
import { useTranslation } from 'react-i18next';

export const MethodologyInsightsSkeleton = () => {
  const { t } = useTranslation('riskRegister', {
    keyPrefix: 'scenarioDrillDown.methodologyInsights',
  });
  return (
    <Card className='rounded-xl border-0 bg-white shadow-sm'>
      <CardHeader className='pb-2'>
        <CardTitle className='flex items-center gap-2 text-2xl font-semibold text-slate-800'>
          {t('title')}
          <BasicTooltip
            content={t('info', {
              returnObjects: true,
            })}
            triggerClassName='cursor-pointer'
            triggerIconClassName='h-5 w-5 text-slate-400'
          />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Skeleton className='h-[180px] w-full' />
      </CardContent>
    </Card>
  );
};
