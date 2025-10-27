import React from 'react';
import { Icon, IconProps } from '@chakra-ui/react';

type ClientAppSvgProps = {
  color: string;
} & IconProps;

const ClientAppSvg: React.FC<ClientAppSvgProps> = ({
  color,
  width = '18px',
  height = '18px',
  ...props
}) => {
  return (
    <Icon viewBox='0 0 19 20' width={width} height={height} {...props}>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width='19'
        height='20'
        viewBox='0 0 19 20'
        fill='none'
      >
        <path
          d='M2.43004 14.8502V5.13018C2.42117 4.63275 2.57965 4.14676 2.88004 3.75018C3.01099 3.57615 3.17997 3.43433 3.37407 3.33555C3.56817 3.23677 3.78227 3.18362 4.00004 3.18018H14.87C15.0844 3.18662 15.2946 3.2412 15.485 3.33987C15.6754 3.43853 15.8412 3.57876 15.97 3.75018C16.274 4.14546 16.436 4.63157 16.43 5.13018V14.8502C16.4424 15.3419 16.2912 15.8238 16 16.2202C15.8727 16.3932 15.7073 16.5346 15.5165 16.6335C15.3258 16.7323 15.1148 16.7859 14.9 16.7902H4.00004C3.78524 16.7859 3.57431 16.7323 3.38356 16.6335C3.19281 16.5346 3.02737 16.3932 2.90004 16.2202C2.59393 15.8293 2.42837 15.3467 2.43004 14.8502V14.8502Z'
          stroke={color}
          fill='#f8f8f8'
        />
        <circle cx='5.5' cy='5.5' r='0.5' fill={color} />
        <circle cx='8.5' cy='5.5' r='0.5' fill={color} />
        <circle cx='11.5' cy='5.5' r='0.5' fill={color} />
      </svg>
    </Icon>
  );
};

export default ClientAppSvg;
