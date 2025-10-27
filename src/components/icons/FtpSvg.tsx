import React from 'react';
import { Icon, IconProps } from '@chakra-ui/react';

type FtpSvgProps = {
  color: string;
} & IconProps;

const FtpSvg: React.FC<FtpSvgProps> = ({
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
          d='M4.72949 6.25022L6.24949 4.22021V15.5102'
          stroke={color}
          stroke-linecap='round'
          stroke-linejoin='round'
        />
        <path
          d='M7.77 6.25022L6.25 4.22021'
          stroke={color}
          stroke-linecap='round'
          stroke-linejoin='round'
        />
        <path
          d='M13.98 13.73L12.46 15.75V4.45999'
          stroke={color}
          stroke-linecap='round'
          stroke-linejoin='round'
        />
        <path
          d='M10.9404 13.73L12.4604 15.75'
          stroke={color}
          stroke-linecap='round'
          stroke-linejoin='round'
        />
      </svg>
    </Icon>
  );
};

export default FtpSvg;
