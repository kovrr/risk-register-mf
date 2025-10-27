import React from 'react';
import { Icon, IconProps } from '@chakra-ui/react';

type SslSvgProps = {
  color: string;
} & IconProps;

const SslSvg: React.FC<SslSvgProps> = ({
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
          d='M9.10976 1.76982C7.42994 3.09073 5.53106 4.10617 3.49976 4.76982C3.1086 4.86478 2.76117 5.0895 2.51417 5.40733C2.26717 5.72516 2.13519 6.11733 2.13976 6.51982C2.13976 9.42982 2.95976 15.6198 9.22976 17.8998L9.42976 17.9798L9.61976 17.8998C16.2198 15.4898 16.7698 8.75982 16.7098 6.08982C16.7003 5.79296 16.5886 5.50846 16.3937 5.28437C16.1988 5.06028 15.9325 4.91033 15.6398 4.85982C13.4971 4.21537 11.4978 3.16648 9.74976 1.76982L9.42976 1.56982L9.10976 1.76982Z'
          stroke={color}
          stroke-linejoin='round'
        />
        <path
          d='M6.94043 10.7599L9.39043 13.5099L14.1104 7.35986'
          stroke={color}
          stroke-linecap='round'
          stroke-linejoin='round'
        />
      </svg>
    </Icon>
  );
};

export default SslSvg;
