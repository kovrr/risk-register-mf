import React from 'react';
import { Icon, IconProps } from '@chakra-ui/react';

type EmailVendorSvgProps = {
  color: string;
} & IconProps;

const EmailVendorSvg: React.FC<EmailVendorSvgProps> = ({
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
        <g clip-path='url(#clip0_1719_1138)'>
          <path
            d='M1.77998 15.1898V5.4698C1.77101 4.96514 1.9532 4.47575 2.28998 4.0998C2.44405 3.92184 2.63441 3.7789 2.84829 3.68059C3.06216 3.58228 3.29459 3.53086 3.52998 3.5298H15.75C15.9872 3.52877 16.2217 3.5792 16.4375 3.6776C16.6533 3.77601 16.8452 3.92005 17 4.0998C17.3368 4.47575 17.5189 4.96514 17.51 5.4698V15.1898C17.5156 15.6969 17.334 16.1883 17 16.5698C16.8458 16.745 16.6568 16.8862 16.445 16.9844C16.2333 17.0825 16.0033 17.1354 15.77 17.1398H3.52998C3.29491 17.1368 3.06309 17.0846 2.84949 16.9864C2.6359 16.8882 2.44528 16.7463 2.28998 16.5698C1.95591 16.1883 1.77432 15.6969 1.77998 15.1898V15.1898Z'
            stroke={color}
          />
          <path
            d='M17.49 5.47021V7.66021L9.63003 12.0902L1.78003 7.66021V5.47021'
            stroke={color}
            stroke-linecap='round'
            stroke-linejoin='round'
          />
        </g>
        <defs>
          <clipPath id='clip0_1719_1138'>
            <rect width='18.85' height='19.97' fill='#ffffff' />
          </clipPath>
        </defs>
      </svg>
    </Icon>
  );
};

export default EmailVendorSvg;
