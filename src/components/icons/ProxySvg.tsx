import React from 'react';
import { Icon, IconProps } from '@chakra-ui/react';

type ProxySvgProps = {
  color: string;
} & IconProps;

const ProxySvg: React.FC<ProxySvgProps> = ({
  color,
  width = '19px',
  height = '20px',
  ...props
}) => {
  return (
    <Icon viewBox='0 0 19 20' width={width} height={height} {...props}>
      <svg
        width='19'
        height='20'
        viewBox='0 0 19 20'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          d='M13.6894 4.75H5.50938C3.90775 4.75 2.60938 6.04837 2.60938 7.65V8.6C2.60938 10.2016 3.90775 11.5 5.50938 11.5H13.6894C15.291 11.5 16.5894 10.2016 16.5894 8.6V7.65C16.5894 6.04837 15.291 4.75 13.6894 4.75Z'
          stroke={color}
        />
        <path
          d='M10.6895 8.5H5.68945'
          stroke={color}
          stroke-linecap='round'
          stroke-linejoin='round'
        />
        <path
          d='M9.59961 13.98V11.5'
          stroke={color}
          stroke-linecap='round'
          stroke-linejoin='round'
        />
        <path
          d='M16.1902 16.1099H11.7402'
          stroke={color}
          stroke-linecap='round'
          stroke-linejoin='round'
        />
        <path
          d='M7.46953 16.1099H3.01953'
          stroke={color}
          stroke-linecap='round'
          stroke-linejoin='round'
        />
        <path
          d='M7.4707 16.11C7.50775 15.569 7.74879 15.0623 8.1451 14.6922C8.54141 14.3221 9.06345 14.1162 9.6057 14.1162C10.148 14.1162 10.67 14.3221 11.0663 14.6922C11.4626 15.0623 11.7037 15.569 11.7407 16.11'
          stroke={color}
          stroke-linecap='round'
          stroke-linejoin='round'
        />
        <circle cx='13.5' cy='8.5' r='0.5' fill={color} />
      </svg>
    </Icon>
  );
};

export default ProxySvg;
