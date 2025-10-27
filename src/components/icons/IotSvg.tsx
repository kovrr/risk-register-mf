import React from 'react';
import { Icon, IconProps } from '@chakra-ui/react';

type IotSvgProps = {
  color: string;
} & IconProps;

const IotSvg: React.FC<IotSvgProps> = ({
  color,
  width = '20px',
  height = '20px',
  ...props
}) => {
  return (
    <Icon viewBox='0 0 20 20' width={width} height={height} {...props}>
      <svg
        width='20'
        height='20'
        viewBox='0 0 20 20'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          d='M13.4004 9C13.2004 8.6 12.9004 8.2 12.5004 7.9C12.1004 7.6 11.6004 7.5 11.2004 7.5C10.7004 7.5 10.2004 7.6 9.80039 7.8C9.40039 8 9.00039 8.4 8.80039 8.8C8.50039 9.3 8.40039 9.8 8.50039 10.3C8.60039 10.8 8.80039 11.3 9.10039 11.7C9.40039 12.1 9.90039 12.4 10.4004 12.5C10.9004 12.6 11.5004 12.6 11.9004 12.4C12.4004 12.2 12.8004 11.9 13.1004 11.5C13.4004 11.1 13.6004 10.6 13.6004 10C13.6004 9.7 13.5004 9.3 13.4004 9Z'
          stroke={color}
          stroke-miterlimit='10'
        />
        <path d='M11.0996 7.5V3.5' stroke={color} stroke-miterlimit='10' />
        <path
          d='M11.0996 16.3997V12.6997'
          stroke={color}
          stroke-miterlimit='10'
        />
        <path
          d='M15.9996 14.0997L13.0996 11.6997'
          stroke={color}
          stroke-miterlimit='10'
        />
        <path
          d='M16.7004 7.1001L13.4004 9.0001'
          stroke={color}
          stroke-miterlimit='10'
        />
        <path
          d='M9.0998 11.7998L6.2998 14.0998'
          stroke={color}
          stroke-miterlimit='10'
        />
        <path
          d='M8.8002 8.9001L5.7002 7.1001'
          stroke={color}
          stroke-miterlimit='10'
        />
        <path
          d='M11.0999 3.8999C11.5999 3.8999 12.0999 3.4999 12.0999 2.8999C12.0999 2.3999 11.6999 1.8999 11.0999 1.8999C10.4999 1.8999 10.1999 2.2999 10.1999 2.8999C10.0999 3.4999 10.4999 3.8999 11.0999 3.8999Z'
          stroke={color}
          stroke-miterlimit='10'
        />
        <path
          d='M11.0996 17.3999C11.3996 17.3999 11.5996 17.1999 11.5996 16.8999C11.5996 16.5999 11.3996 16.3999 11.0996 16.3999C10.7996 16.3999 10.5996 16.5999 10.5996 16.8999C10.5996 17.1999 10.7996 17.3999 11.0996 17.3999Z'
          stroke={color}
          stroke-miterlimit='10'
        />
        <path
          d='M16.7002 7.5C17.0002 7.5 17.2002 7.3 17.2002 7C17.2002 6.7 17.0002 6.5 16.7002 6.5C16.4002 6.5 16.2002 6.7 16.2002 7C16.2002 7.3 16.4002 7.5 16.7002 7.5Z'
          stroke={color}
          stroke-miterlimit='10'
        />
        <path
          d='M5.70039 16.1C6.40039 16.1 7.00039 15.5 7.00039 14.8C7.00039 14.1 6.40039 13.5 5.70039 13.5C5.00039 13.5 4.40039 14.1 4.40039 14.8C4.40039 15.5 5.00039 16.1 5.70039 16.1Z'
          stroke={color}
          stroke-miterlimit='10'
        />
        <path
          d='M4.9 7.5001C5.4 7.5001 5.9 7.1001 5.9 6.6001C5.9 6.1001 5.5 5.6001 4.9 5.6001C4.4 5.6001 4 6.0001 4 6.6001C4 7.2001 4.4 7.5001 4.9 7.5001Z'
          stroke={color}
          stroke-miterlimit='10'
        />
        <path
          d='M16.7002 15.7999C17.4002 15.7999 17.9002 15.1999 17.9002 14.5999C17.9002 13.8999 17.3002 13.3999 16.7002 13.3999C16.0002 13.3999 15.5002 13.9999 15.5002 14.5999C15.4002 15.2999 16.0002 15.7999 16.7002 15.7999Z'
          stroke={color}
          stroke-miterlimit='10'
        />
      </svg>
    </Icon>
  );
};

export default IotSvg;
