import React from 'react';
import { Icon, IconProps } from '@chakra-ui/react';

type DnsSvgProps = {
  color: string;
} & IconProps;

const DnsSvg: React.FC<DnsSvgProps> = ({
  color,
  width = '19px',
  height = '20px',
  ...props
}) => {
  return (
    <Icon viewBox='0 0 19 20' width={width} height={height} {...props}>
      <svg
        width='19px'
        height='20px'
        viewBox='0 0 19 20'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
        transform='rotate(0) scale(1, 1)'
      >
        <path
          d='M7.45996 8.81006L8.73996 10.3301H1.57996'
          stroke={color}
          stroke-linecap='round'
          stroke-linejoin='round'
        />
        <path
          d='M7.44995 11.8501L8.73995 10.3301'
          stroke={color}
          stroke-linecap='round'
          stroke-linejoin='round'
        />
        <path
          d='M10.46 11.8501L11.75 10.3301'
          stroke={color}
          stroke-linecap='round'
          stroke-linejoin='round'
        />
        <path
          d='M10.46 8.81006L11.75 10.3301'
          stroke={color}
          stroke-linecap='round'
          stroke-linejoin='round'
        />
        <path
          d='M17.27 10.3301H11.75'
          stroke={color}
          stroke-linecap='round'
          stroke-linejoin='round'
        />
      </svg>
    </Icon>
  );
};

export default DnsSvg;
