import TextWithPopover from '@/components/molecules/TextWithPopover';
import {
  type CurrencyCode,
  convertCurrencyLettersToSign,
} from '@/helpers/converters';
import { AccordionIcon, Flex, type FlexProps, Text } from '@chakra-ui/react';
import { shortenNumberWithSuffix } from 'components/ui/charts/utils';
import { type FC, useMemo } from 'react';
import { BenchmarkHorizontalProgress } from './BenchmarkHorizontalProgress';
import {
  clickableLegendItemStyles,
  hoverLegendItemStyles,
} from './legends/consts';

export const normalizeDecimal = (value?: number) =>
  Number(((value || 0) * 100).toFixed(2));

export type ProgressStyleProps = { titleWidth?: string } & FlexProps;

type Props = {
  title: string;
  percentage: number;
  // benchmark is used in order to show the benchmark value above the progress bar
  benchmark?: number;
  // amount is used in order to show the amount (money) besides the percentage value
  amount?: number;
  // showBorder is used in when we want to add dotted border at the end of the progress bar
  showBorder?: boolean;
  // percentageTextValue is used incase we want to show a different value than the percentage in the progress bar label
  percentageTextValue?: number;
  // amountTextValue is used incase we want to show a different value than the amount in the progress bar label
  amountTextValue?: number;
  // expandable is used in order to show the arrow icon for the progress bar
  // enable this only when in an accordion context
  expandable?: boolean;
  // path is used in order to navigate to a specific page when the progress bar is clicked
  path?: string;
  // hoverable is used in order to show the hover styles for the progress bar
  hoverable?: boolean;
  // color is used to customize the progress bar color
  variant?: string;
  // info is used for dotted underline and  popover when hovering over the progress bar
  info?: string;
  // bulletList is used to show a list of bullet points when hovering over the progress bar
  bulletList?: { title: string; bgColor: string }[];
  // bulletListTitle is used to show a title for the bullet list
  bulletListTitle?: string;
  // currency is used to show the currency symbol
  currency: CurrencyCode;
} & Omit<ProgressStyleProps, 'variant'>;

export const ProgressItem: FC<Props> = ({
  title,
  percentage,
  benchmark,
  amount,
  showBorder,
  percentageTextValue,
  amountTextValue,
  expandable,
  path,
  titleWidth,
  minHeight = '58px',
  variant,
  hoverable,
  info,
  bulletList,
  bulletListTitle,
  currency,
  ...props
}) => {
  const normalizedPercentage = normalizeDecimal(percentage);
  const normalizedPercentageTextValue = normalizeDecimal(percentageTextValue);

  const [titleStyle, onTitleClick] = path
    ? [clickableLegendItemStyles, undefined]
    : [{}, undefined];

  const footer = useMemo(() => {
    const percentageText = percentageTextValue
      ? normalizedPercentageTextValue
      : normalizedPercentage;
    if (typeof amount === 'undefined') {
      return (
        <Text fontSize='13px' fontWeight='600' textAlign='start'>
          {`${percentageText} %`}
        </Text>
      );
    }
    const currencySymbol = convertCurrencyLettersToSign(currency);
    const amountText = `${currencySymbol}${shortenNumberWithSuffix(
      amountTextValue || amount,
      2,
    )}`;
    return (
      <Flex fontSize='13px' gap='6px'>
        <Text fontWeight='600'>{amountText}</Text>
        <Text>/</Text>
        <Text>{`${percentageText} %`}</Text>
      </Flex>
    );
  }, [
    amount,
    amountTextValue,
    currency,
    normalizedPercentage,
    normalizedPercentageTextValue,
    percentageTextValue,
  ]);

  return (
    <Flex
      justifyContent='space-between'
      flex-wrap='wrap'
      minHeight={minHeight}
      flexGrow='1'
      gap='20px'
      data-classid='progressItem'
      {...props}
    >
      <Flex
        flex='1 1 45%'
        textAlign='left'
        minWidth={titleWidth}
        maxWidth={titleWidth}
      >
        <Text
          alignSelf={benchmark !== undefined ? 'center' : 'start'}
          fontSize='14px'
          textTransform='capitalize'
          {...titleStyle}
          onClick={onTitleClick}
          data-testid='progress-item-title'
          {...(hoverable && hoverLegendItemStyles)}
        >
          {info || bulletList ? (
            <TextWithPopover
              text={title.replace('_', ' ')}
              description={info}
              bulletList={bulletList}
              bulletListTitle={bulletListTitle}
            />
          ) : (
            title.replace('_', ' ')
          )}
        </Text>
        {expandable && <AccordionIcon />}
      </Flex>
      <BenchmarkHorizontalProgress
        benchmark={benchmark}
        normalizedPercentage={normalizedPercentage}
        showBorder={showBorder}
        footer={footer}
        variant={variant}
      />
    </Flex>
  );
};
