import React from 'react';
import { Icon, IconProps } from '@chakra-ui/react';

type CmsSvgProps = {
  color: string;
} & IconProps;

const CmsSvg: React.FC<CmsSvgProps> = ({
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
          d='M8.55005 2.93018H10.55'
          stroke={color}
          stroke-miterlimit='10'
          stroke-linecap='round'
        />
        <path
          d='M8.55005 17.04H10.55'
          stroke={color}
          stroke-miterlimit='10'
          stroke-linecap='round'
        />
        <path
          d='M16.85 8.99023V10.9902'
          stroke={color}
          stroke-miterlimit='10'
          stroke-linecap='round'
        />
        <path
          d='M2.34998 8.99023V10.9902'
          stroke={color}
          stroke-miterlimit='10'
          stroke-linecap='round'
        />
        <path
          d='M15.1801 2.93018H16.6801V4.43018'
          stroke={color}
          stroke-linecap='round'
          stroke-linejoin='round'
        />
        <path
          d='M16.6801 15.54V17.04H15.1801'
          stroke={color}
          stroke-linecap='round'
          stroke-linejoin='round'
        />
        <path
          d='M3.67004 2.93018H2.17004V4.43018'
          stroke={color}
          stroke-linecap='round'
          stroke-linejoin='round'
        />
        <path
          d='M2.17004 15.54V17.04H3.67004'
          stroke={color}
          stroke-linecap='round'
          stroke-linejoin='round'
        />
        <path
          d='M8.03003 8.41016L9.55003 7.16016V12.8202'
          stroke={color}
          stroke-linecap='round'
          stroke-linejoin='round'
        />
        <path
          d='M11.06 8.41016L9.55005 7.16016'
          stroke={color}
          stroke-linecap='round'
          stroke-linejoin='round'
        />
      </svg>
    </Icon>
  );
};

export default CmsSvg;
