import React from 'react';
import { Icon, IconProps } from '@chakra-ui/react';

type MailSvgProps = {
  color: string;
} & IconProps;

const MailSvg: React.FC<MailSvgProps> = ({
  color,
  width = '21px',
  height = '21px',
  ...props
}) => {
  return (
    <Icon viewBox='0 0 21 21' width={width} height={height} {...props}>
      <svg
        width='21'
        height='21'
        viewBox='0 0 21 21'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <g id='Tech &#38; Services Icon'>
          <path
            id='Union'
            fill-rule='evenodd'
            clip-rule='evenodd'
            d='M3.5 3.5H17.5C18.0523 3.5 18.5 3.94772 18.5 4.5V4.77512C18.4616 4.84605 18.4399 4.92677 18.4399 5.01238V7.37299L10.4948 12.376L2.56013 7.37318V5.01238C2.56013 4.92677 2.53841 4.84606 2.5 4.77512V4.5C2.5 3.94772 2.94772 3.5 3.5 3.5ZM1.5 7.65072V5.01238V4.5C1.5 3.39543 2.39543 2.5 3.5 2.5H17.5C18.6046 2.5 19.5 3.39543 19.5 4.5V5.01238V7.65072V15.5C19.5 16.6046 18.6046 17.5 17.5 17.5H3.5C2.39543 17.5 1.5 16.6046 1.5 15.5V7.65072ZM18.5 8.55814V15.5C18.5 16.0523 18.0523 16.5 17.5 16.5H3.5C2.94772 16.5 2.5 16.0523 2.5 15.5V8.55875L10.205 13.4168C10.3809 13.5277 10.608 13.5277 10.7839 13.4169L18.5 8.55814Z'
            fill={color}
          />
        </g>
      </svg>
    </Icon>
  );
};

export default MailSvg;
