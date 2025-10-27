'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/atoms/card';
import InfoPopover from '@/components/molecules/info-popover';

const columns = [
  {
    title: 'Sample Size',
    description: 'Events matching scenario criteria',
    value: 'sampleSize',
  },
  {
    title: 'Coefficient of Variation',
    description: 'Measures result consistency',
    value: 'coefficientOfVariation',
  },
] as const;

export type MethodologyStatsProps = {
  methodologyStats: {
    sampleSize?: number;
    coefficientOfVariation?: number;
  };
};

const formatValue = (value: number | undefined) => {
  if (value === undefined) return 'N/A';
  if (Number.isInteger(value)) return value;
  return value?.toFixed(2);
};

export const CrqMethodologyInsight: React.FC<MethodologyStatsProps> = ({
  methodologyStats,
}) => {
  return (
    <Card>
      <CardHeader className='flex-start flex flex-row gap-[10px]'>
        <CardTitle className='text-[17px] font-[700] text-text-base-primary'>
          Methodology Insights
        </CardTitle>
        <InfoPopover content='These statistics reflect the data used to generate your scenario results. The sample size represents the number of simulation events that matched your scenario criteria. The coefficient of variation indicates how consistent these results are across different simulations.' />
      </CardHeader>
      <CardContent className='mt-[20px]'>
        <div className='grid grid-cols-2 gap-[20px] px-[30px]'>
          {columns.map(({ title, description, value }) => (
            <div
              key={title}
              className='flex w-auto flex-col items-center gap-[10px]'
            >
              <div className='flex flex-col items-center'>
                <p className='text-[16px] font-[400] text-text-base-primary'>
                  {title}
                </p>
                <p className='text-[14px] font-[400] text-text-base-secondary'>
                  {description}
                </p>
              </div>
              <p className='text-[38px] font-[900] text-text-base-primary'>
                {formatValue(methodologyStats[value])}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
