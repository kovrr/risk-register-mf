import { Icon, useTheme } from '@chakra-ui/react';
import { ThemeProperties } from 'theme/baseTheme';

export const RedWarning = () => {
  const { colors } = useTheme<ThemeProperties>();
  return (
    <Icon width='40px' height='40px' viewBox='0 0 41 40' fill='none'>
      <circle
        cx='19'
        cy='19'
        r='19'
        transform='matrix(-1 0 0 1 39.5 1.06445)'
        fill={colors.fill.information.negativeError}
      />
      <path
        d='M16.5183 9.7694L19.1728 25.8882C19.4572 27.4565 21.6376 27.4565 21.922 25.8882L24.4817 9.7694C24.9557 3.49614 16.0443 3.49614 16.5183 9.7694Z'
        fill='white'
      />
      <path
        d='M20.5 35.0645C22.1569 35.0645 23.5 33.7213 23.5 32.0645C23.5 30.4076 22.1569 29.0645 20.5 29.0645C18.8431 29.0645 17.5 30.4076 17.5 32.0645C17.5 33.7213 18.8431 35.0645 20.5 35.0645Z'
        fill='white'
      />
    </Icon>
  );
};
