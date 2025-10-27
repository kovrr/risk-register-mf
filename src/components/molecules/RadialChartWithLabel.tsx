import { FC, ReactNode } from 'react';
import InfoPopover from './info-popover';
import { ChartRadialText, RadialChartProps } from './RadialChart';

type Props = {
  label: string;
  info?: string | ReactNode;
  chartProps: RadialChartProps;
};
export const RadialChartWithLabel: FC<Props> = ({
  label,
  info,
  chartProps,
}) => {
  return (
    <div className='gap- flex'>
      <div>
        <div className='flex items-center gap-[5px]'>
          <span className='min-w-[75px] text-[13px] font-semibold text-text-information-info'>
            {label}
          </span>
          {info && <InfoPopover content={info} />}
        </div>
      </div>
      <ChartRadialText {...chartProps} />
    </div>
  );
};
