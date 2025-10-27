import PopoverComponent from '@/components/molecules/PopoverComponent';
import { Box, Flex, type FlexProps, Text } from '@chakra-ui/react';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import type { EventTypes } from 'types/riskDrivers/eventTypes';
import {
  isLegendDescriptionKey,
  LEGEND_DESCRIPTIONS,
  type LegendDescriptionKey,
} from './legendUtils';

export const EventTypeAALLegendItem: FC<
  {
    label: EventTypes;
    color: string;
  } & FlexProps
> = ({ color, children, label, ...restProps }) => {
  const { t } = useTranslation('resultsNarrative');
  const info = isLegendDescriptionKey(label)
    ? t(LEGEND_DESCRIPTIONS[label as LegendDescriptionKey])
    : undefined;

  const [legendStyles, onLegendClick] = [{}, undefined];

  return (
    <Flex gap='12px' {...restProps}>
      <Box
        background={color}
        height='16px'
        width='16px'
        borderRadius='2.4px'
        alignSelf='center'
      />
      <Flex gap='5px'>
        <Text
          fontSize='sm'
          onClick={onLegendClick}
          color='text.base.primary'
          {...legendStyles}
          data-testid={`event-type-chart-link-${label}`}
        >
          {t(`riskDrivers.keysToText.${label}.title`)}
        </Text>
        {info && (
          <Box>
            <PopoverComponent
              description={info}
              iconStyles={{
                height: '14px',
                width: '14px',
                color: 'brand.black',
              }}
              trigger='hover'
            />
          </Box>
        )}
      </Flex>
    </Flex>
  );
};
