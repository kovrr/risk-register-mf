import { Icon, IconProps } from '@chakra-ui/icons';

export const FirstPartyRiskIcon = (props: IconProps) => (
  <Icon {...props}>
    <svg
      width='18'
      height='18'
      viewBox='0 0 18 18'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      aria-label='first party risk icon'
      role='img'
    >
      <path
        d='M1.2002 0.495728H4.7998C5.1864 0.495728 5.5 0.809323 5.5 1.19592V13.4957H0.5V1.19592C0.5 0.809324 0.813596 0.495728 1.2002 0.495728Z'
        stroke='#A9B4BC'
      />
      <path
        d='M10.4979 7.76489C10.8 7.37551 11.4175 7.40314 11.6747 7.8479L16.7128 16.5725L16.7557 16.6604C16.9316 17.0871 16.6522 17.5695 16.1952 17.6321V17.6409H16.0985L15.995 17.6438V17.6409H6.12097V17.6438L6.01843 17.6409H5.92175V17.6321C5.4492 17.5674 5.16686 17.0542 5.38074 16.6174L5.38171 16.6135L5.46863 16.6604L5.38269 16.6135L5.4032 16.5754L5.40417 16.5725L10.4413 7.8479L10.4979 7.76489ZM6.19519 16.8284H15.9218L11.0585 8.40454L6.19519 16.8284Z'
        fill='#A9B4BC'
        stroke='#A9B4BC'
        stroke-width='0.2'
      />
      <circle cx='11' cy='15.0001' r='0.5' fill='#A9B4BC' />
      <rect x='10.5' y='10.5001' width='1' height='3.5' fill='#A9B4BC' />
      <path
        d='M7 1.99573H10C10.5523 1.99573 11 2.44344 11 2.99573V6.50012'
        stroke='currentColor'
      />
    </svg>
  </Icon>
);

export default FirstPartyRiskIcon;
