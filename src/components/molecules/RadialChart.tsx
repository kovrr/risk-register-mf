import { type ChartConfig, ChartContainer } from '@/components/atoms/chart';
import { type FC } from 'react';
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from 'recharts';

const chartConfig = {} satisfies ChartConfig;

export type RadialChartProps = {
  size?: number;
  value?: number;
  counterClockwise?: boolean;
  suffix?: string;
  innerLabel?: string;
  fill?: string;
};

export const ChartRadialText: FC<RadialChartProps> = ({
  size = 60,
  value = 75,
  counterClockwise = true,
  suffix = '%',
  innerLabel: label,
  fill,
}) => {
  const chartData = [{ value, fill: fill || 'var(--fill-brand-primary)' }];
  // Calculate radii as percentages of the size
  const innerRadius = size * 0.4; // 40%
  const outerRadius = size * 0.55; // 55%
  const polarRadius = [size * 0.43, size * 0.37]; // 43%, 37%
  const labelYOffset = size * 0.17; // 17% of size, for label spacing

  // Calculate endAngle based on value (percentage of full circle)
  const startAngle = 90;
  const endAngle = counterClockwise
    ? 90 - (value / 100) * 360
    : 90 + (value / 100) * 360;

  return (
    <ChartContainer
      config={chartConfig}
      className='h-full w-full'
      style={{ width: size, height: size }}
    >
      <RadialBarChart
        data={chartData}
        width={size}
        height={size}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
      >
        <PolarGrid
          gridType='circle'
          radialLines={false}
          stroke='none'
          className='first:fill-muted last:fill-background'
          polarRadius={polarRadius}
        />
        <RadialBar dataKey='value' background cornerRadius={10} />
        <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
          <Label
            content={({ viewBox }) => {
              if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                return (
                  <text
                    x={viewBox.cx}
                    y={viewBox.cy}
                    textAnchor='middle'
                    dominantBaseline='middle'
                  >
                    <tspan
                      x={viewBox.cx}
                      y={viewBox.cy}
                      className='fill-foreground font-bold'
                      style={{ fontSize: `${size * 0.24}px` }}
                    >
                      {chartData[0].value.toLocaleString()}
                      {suffix}
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) + labelYOffset}
                      className='fill-muted-foreground'
                      style={{ fontSize: `${size * 0.11}px` }}
                    >
                      {label}
                    </tspan>
                  </text>
                );
              }
            }}
          />
        </PolarRadiusAxis>
      </RadialBarChart>
    </ChartContainer>
  );
};
