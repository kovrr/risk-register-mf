import { Icon, type IconProps } from '@chakra-ui/icons';

const ReportsIcon = (props: IconProps) => (
  <Icon {...props}>
    <svg
      width={20}
      height={20}
      fill='currentColor'
      xmlns='http://www.w3.org/2000/svg'
      aria-label='reports icon'
      role='img'
    >
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M16.896 1.552H3.276v16.896h13.62V1.552ZM3.276.517C2.704.517 2.24.98 2.24 1.552v16.896c0 .572.463 1.035 1.035 1.035h13.62c.572 0 1.035-.463 1.035-1.035V1.552c0-.572-.463-1.035-1.035-1.035H3.276Z'
        fill='currentColor'
      />
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M13.62 3.88H4.742V2.844h8.88v1.034ZM13.707 17.414h-8.88v-1.035h8.88v1.035ZM13.707 15.517h-8.88v-1.034h8.88v1.034ZM15.517 17.414H14.31v-1.035h1.207v1.035ZM15.517 15.517H14.31v-1.034h1.207v1.034ZM6.896 6.38H5.862v5.689h1.034v-5.69ZM5.862 5.344c-.571 0-1.034.463-1.034 1.034v5.69c0 .571.463 1.034 1.034 1.034h1.034c.572 0 1.035-.463 1.035-1.034v-5.69c0-.571-.463-1.034-1.035-1.034H5.862ZM10.69 10.517H9.655v1.552h1.035v-1.552ZM9.655 9.483c-.571 0-1.034.463-1.034 1.034v1.552c0 .571.463 1.034 1.034 1.034h1.035c.57 0 1.034-.463 1.034-1.034v-1.552c0-.571-.463-1.034-1.034-1.034H9.655Z'
        fill='currentColor'
      />
    </svg>
  </Icon>
);

export default ReportsIcon;
