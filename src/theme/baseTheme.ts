import { extendTheme } from '@chakra-ui/react';
import { skeletonTheme } from './skeleton-styles';

const colors = {
  purple: {
    b200: '#BBBAFC',
    a400: '#8B9FF8',
    a500: '#5551f7',
  },
  blue: {
    a200: '#F5F7FF',
    a300: '#EAF1FC',
    b300: '#EAF4FF',
    a400: '#DCE5F2',
    a800: '#154DAB',
    a900: '#202993',
  },
  gray: {
    a200: '#F8F8F8',
    a300: '#F1F1F1',
    b400: '#8A8DA9',
    a500: '#CED7DE',
    a600: '#A9B4BC',
    a700: '#7A7F86',
    a900: '#303045',
  },
  black: '#1C1C2D',
  white: '#FFFFFF',
  green: {
    a200: '#7CD011',
    b500: '#0DC783',
    b900: '#397858',
  },
  brown: '#9F3C00',
  red: {
    b300: '#DE5B58',
    a500: '#EB491F',
  },
  orange: {
    a300: '#FF9900',
    a400: '#FF802E',
  },
  yellow: '#FBBC09',
  sand: '#FCD4A4',
  alpha: {
    blacka90: 'rgba(28, 28, 30, 0.9)',
  },
};

export const themeProperties = {
  fonts: {
    heading: 'Source Sans Pro',
    body: 'Source Sans Pro',
  },
  colors: {
    // New colors Schema
    fill: {
      base: {
        '-1': colors.gray.a200,
        0: colors.white,
        1: colors.blue.a200,
        2: colors.blue.b300,
        3: colors.blue.a300,
        4: colors.blue.a400,
        5: colors.gray.a500,
      },
      brand: {
        primary: colors.purple.a500,
        secondary: colors.purple.a400,
      },
      specific: {
        tooltip: colors.alpha.blacka90,
        background: colors.blue.a300,
        divider: colors.blue.a400,
        sidebar: {
          primary: colors.gray.a900,
          child: colors.black,
        },
        icon: {
          default: colors.gray.a700,
          hover: colors.gray.a200,
          onPress: colors.gray.a300,
        },
      },
      information: {
        negativeError: colors.red.a500,
        warning: colors.yellow,
        success: colors.green.b500,
        information: colors.blue.a800,
      },
      visualization: {
        base: {
          primary: colors.purple.a500,
          secondary: colors.blue.a300,
          tertiary: colors.black,
          market: colors.red.a500,
        },
        eventTypes: {
          attritional: colors.gray.b400,
          dataBreach: colors.orange.a300,
          interruption: colors.green.b500,
          ransomware: colors.red.b300,
        },
        externalScanScore: {
          notAvailable: colors.gray.a600,
          '0-59': colors.red.a500,
          '60-69': colors.orange.a400,
          '70-79': colors.yellow,
          '80-100': colors.green.b500,
        },
        maturity: {
          0: colors.red.a500,
          1: colors.orange.a400,
          2: colors.yellow,
          3: colors.green.a200,
          4: colors.green.b500,
          na: colors.gray.b400,
        },
        impactScenarios: {
          ransomwareAndExtortion: colors.blue.a800,
          businessInterruption: colors.purple.a500,
          thirdPartyServiceProviderFailure: colors.purple.b200,
          thirdPartyLiability: colors.brown,
          dataBreachAndPrivacy: colors.orange.a400,
          regulationAndGovernance: colors.sand,
        },
        sphere: {
          AG: colors.blue.a800,
          AGType: colors.purple.a500,
          company: colors.purple.a400,
        },
        hazard: {
          tech: colors.purple.a400,
          provider: colors.orange.a400,
        },
        riskPosition: {
          current: colors.purple.a500,
          baseline: colors.blue.a800,
          minimal: colors.purple.a400,
          '0-19': colors.red.a500,
          '20-30': colors.orange.a400,
          '40-69': colors.yellow,
          '70-89': colors.green.a200,
          '90-100': colors.green.b500,
        },
      },
    },
    text: {
      base: {
        primary: colors.gray.a900,
        secondary: colors.gray.a700,
        tertiary: colors.gray.a600,
        invert: colors.white,
      },
      brand: {
        primary: colors.purple.a500,
        secondary: colors.purple.a400,
      },
      specific: {
        sidebar: {
          idle: colors.gray.a600,
          hover: colors.gray.a500,
          active: colors.white,
        },
      },
      information: {
        negativeError: colors.red.a500,
        success: colors.green.b500,
        information: colors.blue.a800,
      },
    },
    stroke: {
      base: {
        0: colors.gray.a500,
        1: colors.gray.a600,
        2: colors.gray.a700,
      },
      brand: {
        primary: colors.purple.a500,
        secondary: colors.purple.a400,
      },
      information: {
        negativeError: colors.red.a500,
      },
      visualization: {
        base: {
          axis: colors.gray.a500,
          misc: colors.gray.a700,
          primary: colors.purple.a500,
          secondary: colors.black,
          marker: colors.red.a500,
        },
        eventTypes: {
          dataBreach: colors.orange.a300,
          interruption: colors.green.b500,
          ransomware: colors.red.b300,
        },
        impactScenarios: {
          ransomwareAndExtortion: colors.blue.a800,
          businessInterruption: colors.purple.a500,
          thirdPartyServiceProviderFailure: colors.purple.b200,
          thirdPartyLiability: colors.brown,
          dataBreachAndPrivacy: colors.orange.a400,
          regulationAndGovernance: colors.sand,
        },
      },
    },
    // Old colors schema
    brand: {
      msAzure: '#0072C6',
      tanium: '#BF1212',
      axonius: '#040404',
      crowdStrike: '#ff0404',
      cyberGRX: '#142c4c',
      panaseer: '#68dc4c',
      serviceNow: '#1FD190',
      tenable: '#081c44',
      bitsight: '#ec5c2c',
      qualys: '#f49494',
      lightOrange: '#FC8639',
      orangeWarning: '#fc6443',
      orangeRed: '#E0502B',
      white: '#fff',
      black: '#464646',
      lightRed: '#F7E3E8',
      disabledBackground: '#F8F8F8',
      gray: {
        1: '#E8EFFD',
        2: '#95A6B3',
        3: '#839BBB',
        4: '#B1C4D2',
        5: '#A3ADB5',
        6: '#71767E',
        7: '#D9D9D9',
        8: '#DCE5F2',
        9: '#F9FBFE',
        10: '#3D3D3D',
        11: '#A9B4BC',
        12: '#303045',
        13: '#1C1C2D',
        14: '#8A8DA9',
        15: '#CED7DE',
        16: '#7A7F86',
        17: '#EAF1FC',
        18: '#D2DADF',
        19: '#0000001a',
        20: '#EFF2F7',
      },
      misc: {
        2: '#e4ecf2',
        3: '#B1C4D2',
        5: '#E2EFFF',
        6: '#71767e', // please use gray.6 instead
        7: '#B1C4D2', // please use gray.4 instead
        8: '#95A6B3', // please use gray.2 instead
        9: '#DCE5F2', // please use gray.8 instead
        10: '#E2EFFF33',
        11: '#839BBB', // please use gray.3 instead
        12: '#F5FAFF',
        14: '#F5faff',
        15: '#95A6B2',
        16: '#FAFCFF',
      },
      misc_new: {
        2: '#F3F7FD',
      },
      green: {
        1: '#0DC783',
        2: '#C4FBDE',
        3: '#157A55',
        4: '#7CD011',
      },
      purple: '#5551f7',
      purple_2: '#A5B8FF',
      purple_3: '#625FEB',
      purple_4: '#BE5DF9',
      background: {
        blue: '#ECF2FC',
        gray: 'rgba(255, 255, 255, .6)',
      },
      blue: {
        dark: '#202993',
        text: '#154DAB',
        background: '#3843D3',
        lightBackground: '#ECF2FC',
        frenchSkyBlue: '#8B9FF8',
        navy: '#072F66',
        slider: '#26A9DD',
      },
      disabled: {
        purple: {
          1: '#8C8AF1',
          2: '#BEBDF8',
          3: '#8C8AFC',
        },
      },
      hover: {
        purple: {
          1: '#7F79FC',
        },
        gray: {
          1: '#F2F2F2',
        },
      },
      lilac: '#BBBAFC',
      brown: '#9F3C00',
      sand: '#FCD4A4',
      red: '#FF2323',
      red_2: '#EB491F',
      orange: '#FF802E',
      yellow: '#FBBC09',
      jellyBean: '#DE5B58',
      mountainMeadow: '#1FD190',
      royalOrange: '#FF9048',
      frenchSkyBlue: '#70A1FF',
      strawberry: '#F95D96',
      ghostWhite: '#F5F7FF',
      lavenderGray: '#A9B4BC',
      rociBlue: '#21409E',
      msProduct: '#2F8056',
      recommendedAction: {
        unknown: '#95A6B2',
        ig1: '#FF802E',
        ig2: '#FBBC09',
        ig3: '#0DC783',
        notImplemented: '#FF2323',
        initial: '#FF2323',
        repeatable: '#FF802E',
        defined: '#FBBC09',
        managed: '#7CD011',
        optimized: '#0DC783',
        partiallyImplemented: '#FBBC09',
        fullyImplemented: '#0DC783',
      },
      ig3Award: {
        text: '#134829',
        background: '#DDFFEB',
      },
      unknownCisWarning: {
        text: '#674209',
        background: '#FFF2DE',
        border: '#DD8706',
      },
      techAndServices: {
        lilac: '#86A0FF',
      },
      events: {
        black: '#3D3E52',
      },
      scores: {
        veryHigh: '#FF2323',
        high: '#FF802E',
        medium: '#FBBC09',
        low: '#96C70D',
        veryLow: '#0DC783',
      },
      v2: {
        purple: '#615EFB',
        lightPurple: '#F7F7FF',
      },
      progress: {
        attackVector: {
          200: '#615EFB',
          500: '#615EFB',
        },
        purple: {
          200: '#615EFB',
          500: '#615EFB',
        },
        text: {
          200: '#154DAB',
          500: '#154DAB',
        },
      },
      slider: {
        thumb: {
          main: '#154DAB',
          shadow: '#154dab33',
        },
      },
      securityscorecard: {
        A: '#0DC783',
        B: '#FBBC09',
        C: '#FF802E',
        D: '#FF2323',
        F: '#B81143',
        '?': '#E8EFFD',
      },
      exceedanceCurve: {
        financialExposure: {
          start: '#5551f7',
          end: '#5551f700',
          mainColor: '#5551f7',
        },
        numberOfRecords: {
          start: '#ff802e',
          end: '#ff802e00',
          mainColor: '#FF802E',
        },
        outageDuration: {
          start: '#0dc783',
          end: '#0dc78300',
          mainColor: '#0DC783',
        },
      },
      layout: {
        sidebar: '#303045',
      },
      basicEpCurve: {
        start: '#5551f7',
        end: '#5551f700',
        mainColor: '#5551f7',
      },
      speedometer: {
        background: '#EAF1FC',
        mainColor: '#615EFB',
      },
      ratePercentageDifference: {
        positive: '#0DC783',
        negative: '#E0502B',
      },
    },
  },
  fontSizes: {
    xxs: '0.625rem', // 10px
    xs: '0.75rem', // 12px
    xss: '0.8125rem', // 13px
    sm: '0.875rem', // 14px
    md: '1rem', // 16px
    lg: '1.125rem', // 18px
    xl: '1.25rem', // 20px
    '1.5xl': '1.375rem', // 22px
    '2xl': '1.5rem', // 24px
    '2.5xl': '1.625rem', // 26px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
    '4.5xl': '2.375rem', // 38px
    '5xl': '3rem', // 48px
    '6xl': '3.75rem', // 60px
    '7xl': '4.5rem', // 72px
    '8xl': '6rem', // 96px
    '9xl': '8rem', // 128px
  },
  space: {
    px: '1px', // 1px
    0.5: '0.125rem', // 2px
    1: '0.25rem', // 4px
    1.5: '0.375rem', // 6px
    2: '0.5rem', // 8px
    2.5: '0.625rem', // 10px
    3: '0.75rem', // 12px
    3.5: '0.875rem', // 14px
    4: '1rem', // 16px
    4.5: '1.125rem', // 18px
    5: '1.25rem', // 20px
    5.5: '1.375rem', // 22px
    6: '1.5rem', // 24px
    7: '1.75rem', // 28px
    8: '2rem', // 32px
    9: '2.25rem', // 36px
    10: '2.5rem', // 40px
    12: '3rem', // 48px
    14: '3.5rem', // 56px
    16: '4rem', // 64px
    20: '5rem', // 80px
    24: '6rem', // 96px
    28: '7rem', // 112px
    32: '8rem', // 128px
    36: '9rem', // 144px
    40: '10rem', // 160px
    44: '11rem', // 176px
    48: '12rem', // 192px
    52: '13rem', // 208px
    56: '14rem', // 224px
    60: '15rem', // 240px
    64: '16rem', // 256px
    72: '18rem', // 288px
    80: '20rem', // 320px
    96: '24rem', // 384px
    integrationForm: {
      gap: '24px',
      inputLeftMargin: '30px',
    },
  },
  sizes: {
    max: 'max-content',
    min: 'min-content',
    full: '100%',
    '3xs': '14rem',
    '2xs': '16rem',
    xs: '20rem',
    sm: '24rem',
    md: '28rem',
    lg: '32rem',
    xl: '36rem',
    '2xl': '42rem',
    '3xl': '48rem',
    '4xl': '56rem',
    '5xl': '64rem',
    '6xl': '72rem',
    '7xl': '80rem',
    '8xl': '90rem',
    container: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      xxl: '1620px',
      xxxl: '1920px',
    },
    integrationForm: {
      inputWidth: '503px',
    },
  },
  shadows: { outline: '0 !important' },
  fontWeights: {
    hairline: 100,
    thin: 200,
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
    black: 900,
  },
  lineHeights: {
    normal: 'normal',
    none: 1,
    shorter: 1.25,
    short: 1.375,
    base: 1.5,
    tall: 1.625,
    taller: '2',
    '3': '.75rem', // 12px
    '4': '1rem', // 16px
    '5': '1.25rem', // 20px
    '6': '1.5rem', // 24px
    '7': '1.75rem', // 28px
    '8': '2rem', // 32px
    '9': '2.25rem', // 36px
    '10': '2.5rem', // 40px
  },
  components: {
    baseStyle: {
      // some props can be applied to all sizes
      // the reason we have "md" as the only size is that
      // fontSize can only be passed by default from there
    },
    FormLabel: {
      baseStyle: {
        textColor: 'brand.gray.6',
        fontSize: '14px',
        lineHeight: '14px',
      },
    },
    Modal: {
      baseStyle: {
        dialog: {
          borderRadius: '15px',
        },
      },
    },
    Button: {
      sizes: {
        md: {
          fontSize: '14px',
          lineHeight: '14px',
          borderRadius: '15px',
          h: '33px',
        },
        lg: {},
      },
      variants: {
        primary: {
          backgroundColor: 'brand.purple',
          color: 'brand.white',
          border: '1px solid',
          borderColor: 'brand.purple',
          _hover: {
            _disabled: {
              backgroundColor: 'brand.purple',
            },
          },
        },
        primaryV2: {
          backgroundColor: 'brand.v2.purple',
          color: 'brand.white',
          border: '1px solid',
          borderColor: 'brand.v2.purple',
          _hover: {
            _disabled: {
              backgroundColor: 'brand.v2.purple',
            },
          },
        },
        secondary: {
          backgroundColor: 'brand.white',
          color: 'brand.purple',
          border: '1px solid',
          borderColor: 'brand.purple',
        },
        secondaryV2: {
          backgroundColor: 'brand.white',
          color: 'brand.v2.purple',
          border: '1px solid',
          borderColor: 'brand.v2.purple',
        },
        warning: {
          backgroundColor: 'brand.white',
          color: 'brand.orangeWarning',
          border: '1px solid',
          borderColor: 'brand.orangeWarning',
        },
        link: {
          border: 'none',
          backgroundColor: 'transparent',
          color: 'brand.purple',
          textDecoration: 'underline',
          fontWeight: 'normal',
          _focus: {
            boxShadow: 'none',
          },
        },
        rociPrimary: {
          backgroundColor: 'brand.blue.text',
          color: 'brand.white',
          border: '1px solid',
          borderColor: 'brand.blue.text',
          borderRadius: '5px',
          fontWeight: '600',
          _hover: {
            _disabled: {
              backgroundColor: 'brand.blue.text',
            },
          },
        },
        rociLink: {
          border: 'none',
          backgroundColor: 'transparent',
          color: 'brand.gray.11',
          fontWeight: '700',
          _focus: {
            boxShadow: 'none',
          },
        },
      },
      defaultProps: {
        size: 'md',
      },
    },
    Badge: {
      baseStyle: {
        fontSize: 'xs',
        borderRadius: '15px',
        fontWeight: 'bold',
        textAlign: 'center',
        lineHeight: '15px',
      },
      variants: {
        primary: {
          backgroundColor: 'brand.purple',
          color: 'brand.white',
          p: '8px 10px',
        },
        secondary: {
          backgroundColor: 'brand.black',
          color: 'brand.white',
        },
        neutral: {
          backgroundColor: 'brand.gray.1',
          color: 'brand.black',
          p: '8px 10px',
          borderRadius: '2xl',
          textTransform: 'normal',
        },
        critical: {
          backgroundColor: 'brand.orangeWarning',
          color: 'brand.white',
          fontSize: 'xs',
          py: '0.5',
          px: '1.5',
          textTransform: 'capitalize',
        },
        high: {
          backgroundColor: 'brand.lightOrange',
          color: 'brand.white',
          fontSize: 'xs',
          py: '0.5',
          px: '1.5',
          textTransform: 'capitalize',
        },
        running_fq: {
          backgroundColor: 'rgba(255, 224, 0, 0.2)',
          color: '#FF9900',
          padding: '6px 10px',
          fontWeight: 'bold',
        },
        completed_fq: {
          backgroundColor: 'rgba(123, 255, 176, 0.4)',
          color: '#157A55',
          padding: '6px 10px',
          fontWeight: 'bold',
        },
        data_collection: {
          backgroundColor: 'rgba(255, 224, 0, 0.2)',
          color: '#FF9900',
          padding: '6px 10px',
          fontWeight: 'bold',
        },
        ready_for_data_collection: {
          backgroundColor: 'rgba(255, 224, 0, 0.2)',
          color: '#FF9900',
          padding: '6px 10px',
          fontWeight: 'bold',
        },
        ready_for_analysis: {
          backgroundColor: 'rgba(207, 206, 255, 0.4)',
          color: '#6E6BFF',
          padding: '6px 10px',
          fontWeight: 'bold',
        },
        ready_for_fq: {
          backgroundColor: 'rgba(207, 206, 255, 0.4)',
          color: '#6E6BFF',
          padding: '6px 10px',
          fontWeight: 'bold',
        },
        error: {
          backgroundColor: 'rgba(255, 35, 35, 0.1)',
          color: '#FF2323',
          padding: '6px 10px',
          fontWeight: 'bold',
        },
        ig1: {
          backgroundColor: 'brand.recommendedAction.ig1',
          padding: '5px 9px',
          color: 'brand.white',
          minW: '36px',
        },
        ig2: {
          backgroundColor: 'brand.recommendedAction.ig2',
          padding: '5px 9px',
          color: 'brand.white',
          minW: '36px',
        },
        ig3: {
          backgroundColor: 'brand.recommendedAction.ig3',
          padding: '5px 9px',
          color: 'brand.white',
          minW: '36px',
        },
        unknown: {
          backgroundColor: 'brand.recommendedAction.unknown',
          padding: '5px 9px',
          color: 'brand.white',
          minW: '36px',
          textTransform: 'capitalize',
        },
        'not implemented': {
          backgroundColor: 'brand.recommendedAction.notImplemented',
          padding: '5px 9px',
          color: 'brand.white',
          minW: '36px',
          textTransform: 'capitalize',
        },
        disabled: {
          backgroundColor: 'brand.recommendedAction.notImplemented',
          padding: '5px 9px',
          color: 'brand.white',
          minW: '36px',
          textTransform: 'capitalize',
        },
        initial: {
          backgroundColor: 'brand.recommendedAction.initial',
          padding: '5px 9px',
          color: 'brand.white',
          minW: '36px',
          textTransform: 'capitalize',
        },
        repeatable: {
          backgroundColor: 'brand.recommendedAction.repeatable',
          padding: '5px 9px',
          color: 'brand.white',
          minW: '36px',
          textTransform: 'capitalize',
        },
        defined: {
          backgroundColor: 'brand.recommendedAction.defined',
          padding: '5px 9px',
          color: 'brand.white',
          minW: '36px',
          textTransform: 'capitalize',
        },
        managed: {
          backgroundColor: 'brand.recommendedAction.managed',
          padding: '5px 9px',
          color: 'brand.white',
          minW: '36px',
          textTransform: 'capitalize',
        },
        optimized: {
          backgroundColor: 'brand.recommendedAction.optimized',
          padding: '5px 9px',
          color: 'brand.white',
          minW: '36px',
          textTransform: 'capitalize',
        },
        'partially implemented': {
          backgroundColor: 'brand.recommendedAction.partiallyImplemented',
          padding: '5px 9px',
          color: 'brand.white',
          minW: '36px',
          textTransform: 'capitalize',
        },
        'fully implemented': {
          backgroundColor: 'brand.recommendedAction.fullyImplemented',
          padding: '5px 9px',
          color: 'brand.white',
          minW: '36px',
          textTransform: 'capitalize',
        },
        targetedEvents: {
          color: 'brand.white',
          height: '20px',
          borderRadius: '4',
          padding: '1px 10px',
        },
        modelUpdate: {
          backgroundColor: 'brand.gray.12',
          color: 'brand.white',
          fontSize: 'xss',
          fontWeight: '600',
          lineHeight: 'normal',
          padding: '5px 9px 5px 9px',
          textTransform: 'capitalize',
        },
        thresholdPercentage: {
          backgroundColor: 'brand.gray.17',
          color: 'brand.black',
          p: '5px 8px',
          borderRadius: '2xl',
          textTransform: 'normal',
          alignContent: 'center',
        },
        customThresholdHeader: {
          backgroundColor: 'brand.gray.12',
          color: 'white',
          p: '0 4px 1px 4px',
          borderRadius: '3px',
          textTransform: 'normal',
          alignContent: 'center',
        },
        outputThreshold: {
          p: '5px 8px',
          backgroundColor: 'brand.gray.12',
          color: 'white',
          borderRadius: '5px',
          fontStyle: 'normal',
          fontWeight: '400',
          lineHeight: 'normal',
          fontSize: '16px',
        },
        defaultRociIntegration: {
          fontSize: 'xs',
          fontWeight: '700',
          fontStyle: 'normal',
          lineHeight: 'inherit',
          color: 'brand.white',
          backgroundColor: 'brand.gray.16',
          px: '5px',
          textTransform: 'capitalize',
          borderRadius: '4px',
        },
        scenarioDamageType: {
          backgroundColor: '#8B9FF8',
          color: 'white',
          px: '5px',
          textTransform: 'capitalize',
          borderRadius: '4px',
        },
      },
      defaultProps: {
        variant: 'primary',
      },
    },
    Skeleton: skeletonTheme,
    Tabs: {
      variants: {
        unstyled: {
          tab: {
            _disabled: {
              cursor: 'default',
              color: 'brand.gray.1',
            },
            fontSize: 'xl',
            fontWeight: 'semibold',
            lineHeight: '4',
            color: 'brand.gray.5',
            p: '2.5 3.5',
            _selected: {
              color: 'brand.purple',
              borderColor: 'brand.purple',
              borderBottom: '2px solid',
            },
          },
        },
        line: {
          tab: {
            fontSize: 'xl',
            fontWeight: 'semibold',
            lineHeight: '4',
            color: 'brand.gray.5',
            p: '2.5 3.5',
            _selected: {
              color: 'brand.purple',
              borderColor: 'brand.purple',
              borderBottom: '2px solid',
            },
          },
        },
      },
      defaultProps: {
        variant: 'unstyled',
      },
    },
    Text: {
      defaultProps: {
        variant: 'primary',
      },
      variants: {
        primary: {
          lineHeight: 'normal',
        },
        formSubheader: {
          fontWeight: 'bold',
          fontSize: '14px',
          lineHight: '18px',
        },
        cardTitle: {
          as: 'h3',
          fontSize: 'xl',
          fontWeight: 'bold',
          lineHeight: '6',
          color: 'brand.black',
        },
        cardTitleDisabled: {
          as: 'h3',
          fontSize: 'xl',
          fontWeight: 'bold',
          lineHeight: '6',
          color: 'brand.black',
          opacity: 0.7,
        },
        cardTitle2: {
          as: 'p',
          fontSize: 'md',
          color: 'brand.misc.6',
          lineHeight: '5',
          fontWeight: 'bold',
        },
        cardTitle3: {
          as: 'p',
          fontSize: '17px',
          lineHeight: '5',
          fontWeight: '700',
        },
        cardAmount: {
          as: 'p',
          color: 'brand.black',
          fontSize: '2.5xl',
          fontWeight: 'bold',
          lineHeight: '8',
        },
        cardDesc: {
          as: 'p',
          color: 'brand.misc.6',
          fontSize: 'sm',
          lineHeight: '4',
          fontWeight: 'normal',
        },
        cardDesc2: {
          as: 'p',
          color: 'brand.black',
          fontSize: 'xl',
          fontWeight: 'semibold',
          lineHeight: '6',
        },
        cardDesc3: {
          as: 'p',
          color: 'brand.gray.16',
          fontSize: 'xs',
          lineHeight: '15px',
          fontWeight: 'normal',
        },
        cardDescBlack: {
          color: 'brand.black',
          fontSize: 'xss',
          lineHeight: '4',
          fontWeight: 'normal',
        },
        rociTextInputCardDesc: {
          as: 'p',
          color: 'brand.gray.16',
          fontSize: 'xs',
          lineHeight: 'normal',
          fontWeight: '400',
        },
        link: {
          color: 'brand.purple',
          textDecoration: 'underline',
          fontSize: '18px',
          lineHeight: '18px',
          cursor: 'pointer',
        },
        fakeLink: {
          color: 'brand.purple',
          fontWeight: 'bold',
          textDecoration: 'underline',
          fontSize: '18px',
          lineHeight: '18px',
        },
        secondary: {
          fontWeight: '400',
          fontSize: '14px',
          lineHeight: '14px',
          color: 'brand.misc.6',
        },
        description: {
          fontSize: '13px',
          lineHeight: '16px',
          fontWeight: '400',
          color: 'brand.gray.6',
        },
        formError: {
          color: 'brand.red',
          fontSize: '12px',
          lineHeight: '12px',
          fontWeight: '600',
        },
        rociPrimary: {
          color: 'brand.blue.navy',
          fontWeight: '700',
          lineHeight: 'normal',
        },
        rociSecondary: {
          color: 'brand.gray.16',
          fontWeight: '400',
          lineHeight: 'normal',
        },
        rociStepperDescription: {
          fontSize: '13px',
          color: 'brand.gray.16',
          fontWeight: '400',
          width: '400px',
        },
        xsBold: {
          fontSize: 'xs',
          fontWeight: '700',
        },
        smBold: {
          fontSize: 'sm',
          fontWeight: '700',
        },
        selectIntegrationTitle: {
          fontSize: 'sm',
          fontStyle: 'normal',
          fontWeight: '700',
          lineHeight: 'normal',
          color: 'brand.blue.text',
        },
        selectIntegrationTitleDisabled: {
          fontSize: 'sm',
          fontStyle: 'normal',
          fontWeight: '700',
          lineHeight: 'normal',
          color: 'brand.gray.16',
        },
        selectIntegrationDescription: {
          fontSize: 'xs',
          fontStyle: 'normal',
          fontWeight: '400',
          lineHeight: 'normal',
          color: 'brand.blue.text',
        },
        selectIntegrationDescriptionDisabled: {
          fontSize: 'xs',
          fontStyle: 'normal',
          fontWeight: '400',
          lineHeight: 'normal',
          color: 'brand.gray.16',
        },
        rociControlsAnswerBy: {
          color: 'brand.blue.text',
          fontSize: 'sm',
          fontWeight: '700',
        },
        rociIntegrationPreviewPaneText: {
          color: 'brand.gray.12',
          fontSize: 'sm',
          fontWeight: '600',
        },
      },
    },
    Link: {
      baseStyle: {
        color: 'brand.purple',
        fontWeight: 'bold',
        textDecoration: 'underline',
        _hover: {
          cursor: 'pointer',
        },
      },
    },
    Input: {
      baseStyle: {
        field: {
          fontSize: 'sm',
          lineHeight: '24px',
          border: '1px solid',
          borderRadius: 'lg',
          py: '1',
          px: '3.5',
        },
      },
      variants: {
        primary: {
          field: {
            borderColor: 'brand.gray.2',
            color: 'brand.black',
          },
        },
        standard: {
          field: {
            borderColor: 'brand.gray.2',
            // color: 'brand.black', ?????
            borderRadius: '9px',
          },
        },
        search: {
          field: {
            borderColor: 'brand.gray.4',
            borderRadius: '10px',
          },
        },
        sphereForm: {
          field: {
            borderRadius: '10px',
            borderColor: 'brand.gray.8',
          },
        },
        newPrimary: {
          field: {
            borderRadius: '10px',
            borderColor: 'brand.gray.8',
          },
        },
        rociTextInput: {
          field: {
            borderRadius: '5px',
            borderColor: 'brand.gray.17',
            fontSize: 'sm',
            fontWeight: '700',
            color: 'brand.blue.text',

            _hover: {
              borderColor: 'brand.gray.11',
            },
            _focus: {
              border: '2px solid',
            },
          },
        },
        rociTextInputError: {
          field: {
            borderRadius: '5px',
            borderColor: 'brand.red',
            fontSize: 'sm',
            fontWeight: '700',
            color: 'brand.blue.text',

            _hover: {
              borderColor: 'brand.red',
            },
            _focus: {
              borderColor: 'brand.red !important', // !important is needed to override the default focus border
              border: '2px solid',
            },
          },
        },
      },
      defaultProps: {
        variant: 'primary',
      },
    },
    Select: {
      baseStyle: {
        field: {
          border: '1px solid',
          outline: 'none',
        },
      },
      variants: {
        primary: {
          field: {
            borderColor: 'brand.gray.2',
            color: 'brand.black',
          },
        },
      },
    },
    Checkbox: {
      variants: {
        purple: {
          control: {
            _checked: {
              backgroundColor: 'brand.purple',
            },
          },
        },
        dark: {
          control: {
            borderColor: 'stroke.base.0',
            _checked: {
              backgroundColor: 'fill.visualization.base.tertiary',
              borderColor: 'stroke.base.0',
              _hover: {
                backgroundColor: 'fill.visualization.base.tertiary',
                borderColor: 'stroke.base.0',
              },
            },
          },
        },
        thresholdCardTitle: {
          control: {
            borderRadius: '4px',
            _checked: {
              backgroundColor: 'brand.gray.12',
              borderColor: 'brand.gray.15',
              _hover: {
                backgroundColor: 'brand.gray.12',
                borderColor: 'brand.gray.15',
              },
              _disabled: {
                backgroundColor: 'brand.gray.14',
                borderColor: 'brand.gray.15',
              },
            },
          },
          icon: {
            color: 'white',
          },
        },
      },
    },
    Drawer: {
      sizes: {
        mdl: {
          dialog: { minWidth: '558px', maxWidth: '558px' },
        },
      },
    },
    Progress: {
      variants: {
        primary: {
          filledTrack: {
            bg: 'fill.brand.primary',
          },
        },
        ransomwareAndExtortion: {
          filledTrack: {
            bg: 'fill.visualization.impactScenarios.ransomwareAndExtortion',
          },
        },
        businessInterruption: {
          filledTrack: {
            bg: 'fill.visualization.impactScenarios.businessInterruption',
          },
        },
        thirdPartyServiceProviderFailure: {
          filledTrack: {
            bg: 'fill.visualization.impactScenarios.thirdPartyServiceProviderFailure',
          },
        },
        thirdPartyLiability: {
          filledTrack: {
            bg: 'fill.visualization.impactScenarios.thirdPartyLiability',
          },
        },
        dataBreachAndPrivacy: {
          filledTrack: {
            bg: 'fill.visualization.impactScenarios.dataBreachAndPrivacy',
          },
        },
        regulationAndGovernance: {
          filledTrack: {
            bg: 'fill.visualization.impactScenarios.regulationAndGovernance',
          },
        },
      },
    },
    Stepper: {
      variants: {
        primary: {
          separator: {
            marginTop: '10px',
            backgroundColor: 'brand.gray.15',
          },
          step: {
            gap: '32px',
          },
        },
        secondary: {
          separator: {
            height: '25px !important', // needed because of weird behavior of the original separator
            maxHeight: '25px !important', // needed because of weird behavior of the original separator
            left: 'calc(1.5rem / 2 - 1px)',
            backgroundColor: 'brand.gray.15',
            marginTop: '10px',
          },
        },
      },
    },
  },
  styles: {
    global: {
      'html, body, #root': {
        height: '100%',
        color: 'brand.black',
        fontFamily: 'Source Sans Pro',
      },
      '.flex-row-center': {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
      },
      '.flex-col-center': {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
      },
      'button:focus': {
        boxShadow: 'none !important',
      },
    },
  },
} as const;

export type ThemeProperties = typeof themeProperties;

const theme = extendTheme(themeProperties);

export { theme };
