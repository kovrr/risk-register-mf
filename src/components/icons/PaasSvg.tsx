import React from 'react';
import { Icon, IconProps } from '@chakra-ui/react';

type PaasSvgProps = {
  color: string;
} & IconProps;

const PaasSvg: React.FC<PaasSvgProps> = ({
  color,
  width = '19px',
  height = '19px',
  ...props
}) => {
  return (
    <Icon viewBox='0 0 19 19' width={width} height={height} {...props}>
      <svg
        width='19'
        height='19'
        viewBox='0 0 19 19'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <g id='Frame'>
          <path
            id='Vector (Stroke)'
            fill-rule='evenodd'
            clip-rule='evenodd'
            d='M10.272 17.811L17.9153 13.0212L17.3843 12.1738L9.73853 16.9652L9.73298 16.9687C9.70112 16.9893 9.66417 17.0001 9.62653 17.0001C9.58888 17.0001 9.55194 16.9893 9.52008 16.9687L2.02555 12.1763L1.48682 13.0187L8.97796 17.809C8.97829 17.8092 8.97862 17.8095 8.97894 17.8097C9.17204 17.934 9.39681 18.0001 9.62653 18.0001C9.8554 18.0001 10.0794 17.9345 10.272 17.811Z'
            fill={color}
          />
          <path
            id='Vector (Stroke)_2'
            fill-rule='evenodd'
            clip-rule='evenodd'
            d='M10.272 15.1978L17.9153 10.4079L17.3843 9.56055L9.73853 14.3519L9.73298 14.3555C9.70112 14.376 9.66417 14.3869 9.62653 14.3869C9.58888 14.3869 9.55194 14.376 9.52008 14.3554L2.02555 9.56299L1.48682 10.4055L8.97796 15.1958C8.97829 15.196 8.97862 15.1962 8.97894 15.1964C9.17204 15.3207 9.39681 15.3869 9.62653 15.3869C9.8554 15.3869 10.0794 15.3212 10.272 15.1978Z'
            fill={color}
          />
          <path
            id='Vector'
            fill-rule='evenodd'
            clip-rule='evenodd'
            d='M8.93347 1.34393C9.27472 1.10932 9.72528 1.10932 10.0665 1.34393L17.184 6.23716C17.7619 6.63451 17.7619 7.4879 17.184 7.88525L10 12.561C9.65875 12.7956 9.34125 12.7956 9 12.561L1.81604 7.88525C1.23808 7.4879 1.23808 6.63451 1.81604 6.23716L8.93347 1.34393ZM16.6174 7.0612L9.5 2.16797L2.38257 7.0612L9.5 11.561L16.6174 7.0612Z'
            fill={color}
          />
        </g>
      </svg>
    </Icon>
  );
};

export default PaasSvg;
