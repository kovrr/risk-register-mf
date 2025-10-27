import { ArrowForwardIcon } from '@chakra-ui/icons';
import { Flex, FlexProps, Progress } from '@chakra-ui/react';
import React from 'react';
import { ArrowIcon } from '_pages/ResultsNarrative/icons';
import { normalizeDecimal } from './ProgressItem';

type BenchmarkHorizontalProgressProps = Omit<FlexProps, 'color'> & {
  benchmark?: number;
  showBorder?: boolean;
  normalizedPercentage: number;
  footer?: React.ReactNode;
  progressHeight?: string;
  stopLine?: boolean;
  variant?: string;
};

export const BenchmarkHorizontalProgress: React.FC<
  BenchmarkHorizontalProgressProps
> = ({
  benchmark,
  showBorder,
  normalizedPercentage,
  footer,
  progressHeight = '10px',
  stopLine = false,
  variant = 'primary',
  ...props
}) => {
  const normalizedBenchmark = normalizeDecimal(benchmark);

  return (
    <Flex
      width='100%'
      direction='column'
      gap='0px'
      position='relative'
      {...props}
    >
      {benchmark !== undefined && (
        <ArrowIcon
          marginLeft={`min(calc(${normalizedBenchmark}% - 10px), calc(100% - 10px))`}
        />
      )}
      {normalizedBenchmark > 100 && (
        <ArrowForwardIcon
          color='red'
          position='absolute'
          right='-15px'
          top='-14px'
        />
      )}
      <Flex
        borderEnd={showBorder ? '1px dashed #7A7F86' : 'none'}
        height='15px'
      >
        <Progress
          flex='1 1 55%'
          height={progressHeight}
          value={normalizedPercentage}
          width='100%'
          alignSelf='center'
          borderRadius='16px'
          variant={variant}
        />
      </Flex>
      {footer}
    </Flex>
  );
};
