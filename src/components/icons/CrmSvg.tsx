import React from 'react';
import { Icon, IconProps } from '@chakra-ui/react';

type CrmSvgProps = {
  color: string;
} & IconProps;

const CrmSvg: React.FC<CrmSvgProps> = ({
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
        <g clip-path='url(#clip0_1719_1297)'>
          <path
            d='M15.2895 12.5314L17.0249 12.3018C14.8806 17.6238 6.31332 20.9687 2.1344 12.4815'
            stroke={color}
            stroke-linejoin='round'
          />
          <path
            d='M17.7031 13.9692L17.0448 12.3716'
            stroke={color}
            stroke-linejoin='round'
          />
          <path
            d='M3.8997 6.85969L2.16431 7.09933C4.30862 1.77733 12.8759 -1.5976 17.0448 6.90962'
            stroke={color}
            stroke-linejoin='round'
          />
          <path
            d='M1.47607 5.43164L2.13433 7.01926'
            stroke={color}
            stroke-linejoin='round'
          />
          <path
            d='M12.9456 8.34745C13.4028 8.34745 13.7734 7.97641 13.7734 7.5187C13.7734 7.06099 13.4028 6.68994 12.9456 6.68994C12.4884 6.68994 12.1178 7.06099 12.1178 7.5187C12.1178 7.97641 12.4884 8.34745 12.9456 8.34745Z'
            stroke={color}
            stroke-linejoin='round'
          />
          <path
            d='M9.61455 9.34599C10.0717 9.34599 10.4424 8.97494 10.4424 8.51723C10.4424 8.05952 10.0717 7.68848 9.61455 7.68848C9.15736 7.68848 8.78674 8.05952 8.78674 8.51723C8.78674 8.97494 9.15736 9.34599 9.61455 9.34599Z'
            stroke={color}
            stroke-linejoin='round'
          />
          <path
            d='M6.28337 8.34745C6.74055 8.34745 7.11118 7.97641 7.11118 7.5187C7.11118 7.06099 6.74055 6.68994 6.28337 6.68994C5.82619 6.68994 5.45557 7.06099 5.45557 7.5187C5.45557 7.97641 5.82619 8.34745 6.28337 8.34745Z'
            stroke={color}
            stroke-linejoin='round'
          />
          <path
            d='M14.3121 10.8336C14.3121 12.1117 11.5793 12.1117 11.5793 10.8336C11.5793 9.55553 12.1977 8.51709 12.9657 8.51709C13.7336 8.51709 14.3121 9.55553 14.3121 10.8336Z'
            stroke={color}
            stroke-linejoin='round'
          />
          <path
            d='M10.9709 11.8321C10.9709 13.1102 8.23816 13.1102 8.23816 11.8321C8.23816 10.5541 8.84655 9.51562 9.60454 9.51562C10.3625 9.51562 10.9709 10.5541 10.9709 11.8321Z'
            stroke={color}
            stroke-linejoin='round'
          />
          <path
            d='M7.64974 10.8336C7.64974 12.1117 4.91699 12.1117 4.91699 10.8336C4.91699 9.55553 5.53535 8.51709 6.28337 8.51709C7.03138 8.51709 7.64974 9.55553 7.64974 10.8336Z'
            stroke={color}
            stroke-linejoin='round'
          />
        </g>
        <defs>
          <clipPath id='clip0_1719_1297'>
            <rect width='18.85' height='19.97' fill='#ffffff' />
          </clipPath>
        </defs>
      </svg>
    </Icon>
  );
};

export default CrmSvg;
