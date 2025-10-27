import { Flex, FlexProps } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { QuadrupleXLTextBold, SmallText, SmallTextBold } from './CommonTexts';
import { TransWithComponent } from './TransWithComponent';

type ChangeComparisonProps = {
  change: number;
  direction?: 'column' | 'row';
} & FlexProps;

export const ChangeComparison = ({
  change,
  direction = 'column',
  ...restProps
}: ChangeComparisonProps) => {
  const { t } = useTranslation('roci', {
    keyPrefix: 'report.changeComparison',
  });

  return (
    <Flex
      direction={direction === 'column' ? 'column' : 'row-reverse'}
      gap='10px'
      alignItems='center'
      textAlign='center'
      {...restProps}
    >
      <SmallTextBold
        color='text.base.tertiary'
        minWidth='136px'
        maxWidth='136px'
      >
        <TransWithComponent
          components={{
            Positive: <SmallText as='span' color='text.information.success' />,
            Negative: (
              <SmallText as='span' color='text.information.negativeError' />
            ),
          }}
        >
          {change > 0 ? t('increase') : t('decrease')}
        </TransWithComponent>
      </SmallTextBold>

      <QuadrupleXLTextBold color='text.base.primary'>
        {Math.abs(Math.floor(change * 100))}%
      </QuadrupleXLTextBold>
    </Flex>
  );
};
