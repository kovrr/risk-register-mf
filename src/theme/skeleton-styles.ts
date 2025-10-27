import { defineStyle, defineStyleConfig, cssVar } from '@chakra-ui/react';

const $startColor = cssVar('skeleton-start-color');
const $endColor = cssVar('skeleton-end-color');

const purple = defineStyle({
  _light: {
    [$startColor.variable]: 'colors.brand.white', //changing startColor to red.100
    [$endColor.variable]: 'colors.brand.blue.lightBackground', // changing endColor to red.400
  },
  _dark: {
    [$startColor.variable]: 'colors.brand.white', //changing startColor to red.800
    [$endColor.variable]: 'colors.brand.blue.lightBackground', // changing endColor to red.600
  },
});
export const skeletonTheme = defineStyleConfig({
  variants: { purple },
  defaultProps: {
    variant: 'purple',
  },
});
