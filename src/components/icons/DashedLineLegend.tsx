import { FC } from 'react';

type DashedLineLegendsProps = {
  stroke?: string;
};

export const DashedLineLegend: FC<DashedLineLegendsProps> = ({ stroke }) => {
  return (
    <svg
      width='19'
      height='20'
      version='1.1'
      xmlns='http://www.w3.org/2000/svg'
    >
      <line
        strokeDasharray='4, 1'
        x1='0'
        y1='10'
        x2='205'
        y2='10'
        strokeWidth='1px'
        stroke={stroke}
      ></line>
    </svg>
  );
};
