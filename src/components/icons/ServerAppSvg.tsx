import React from 'react';
import { Icon, IconProps } from '@chakra-ui/react';

type ServerAppSvgProps = {
  color: string;
} & IconProps;

const ServerAppSvg: React.FC<ServerAppSvgProps> = ({
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
        <g clip-path='url(#clip0_1503_62269)'>
          <path
            d='M14.8602 11.3999H4.71016C3.16376 11.3999 1.91016 12.6535 1.91016 14.1999C1.91016 15.7463 3.16376 16.9999 4.71016 16.9999H14.8602C16.4066 16.9999 17.6602 15.7463 17.6602 14.1999C17.6602 12.6535 16.4066 11.3999 14.8602 11.3999Z'
            stroke={color}
          />
          <circle cx='5.5' cy='13.5' r='0.5' fill={color} />
          <circle cx='8.5' cy='13.5' r='0.5' fill={color} />
          <circle cx='11.5' cy='13.5' r='0.5' fill={color} />
          <path
            d='M14.8602 2.87012H4.71016C3.16376 2.87012 1.91016 4.12372 1.91016 5.67012C1.91016 7.21651 3.16376 8.47012 4.71016 8.47012H14.8602C16.4066 8.47012 17.6602 7.21651 17.6602 5.67012C17.6602 4.12372 16.4066 2.87012 14.8602 2.87012Z'
            stroke={color}
          />
          <circle cx='5.5' cy='5.5' r='0.5' fill={color} />
          <circle cx='8.5' cy='5.5' r='0.5' fill={color} />
          <circle cx='11.5' cy='5.5' r='0.5' fill={color} />
        </g>
        <defs>
          <clipPath id='clip0_1503_62269'>
            <rect width='18.85' height='19.97' fill='white' />
          </clipPath>
        </defs>
      </svg>
    </Icon>
  );
};

export default ServerAppSvg;
