import { Flex, FlexProps, Text, Tooltip } from '@chakra-ui/react';
import { ErrorBoundary } from 'components/wrappers/ErrorBoundary';
import { BsArrowRight } from 'react-icons/bs';
import { ControlStatus, CONTROL_STATUS_TO_TEXT } from 'types/security-controls';
import { StatusBadge } from 'components/ui/Badge/StatusBadge';
import {
  controlsFrameworkHelper,
  getEffectPercentage,
} from '_pages/FinancialQuantification/Mitigation/utils';
import {
  SecControlsFramework,
  SecControlsFrameworkType,
} from 'options/constants';
import { getAGTypeLabel } from 'options/get-label';
import { ExtendedAssetGroupType } from 'types/sphereForm';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

const downwardArrow = '\u2193';

const ellipsisOnSecondLine = {
  display: '-webkit-box',
  ['WebkitLineClamp' as any]: '2', // workaround for console error regarding this css prop
  ['WebkitBoxOrient' as any]: 'vertical', // workaround for console error regarding this css prop
  overflow: 'hidden',
};

export const AssetGroupCell = ({
  name,
  type,
}: {
  name: string;
  type: ExtendedAssetGroupType | '';
}) => {
  return (
    <Flex flexDirection='column'>
      <Text mb='4px' fontSize='13px'>
        {name}
      </Text>
      <Text
        maxHeight='40px'
        maxWidth='152px'
        fontSize='13px'
        fontStyle='italic'
      >
        {getAGTypeLabel(type)}
      </Text>
    </Flex>
  );
};

export const ControlCell = ({
  title,
  secondaryTitle,
  ...props
}: {
  title: string;
  secondaryTitle: string;
} & FlexProps) => {
  return (
    <Flex flexDirection='column' {...props}>
      <Text fontWeight='bold' mb='4px' fontSize='12px'>
        {title}
      </Text>
      <Text
        maxHeight='40px'
        fontSize='14px'
        css={ellipsisOnSecondLine}
        maxWidth='75%'
      >
        {secondaryTitle}
      </Text>
    </Flex>
  );
};

export const ControlCellSpecific = ({
  framework,
  controlName,
}: {
  framework: SecControlsFrameworkType;
  controlName: string;
}) => {
  const { title, secondaryTitle } =
    controlsFrameworkHelper[framework].getText(controlName);
  return <ControlCell title={title} secondaryTitle={secondaryTitle} />;
};

export const ActionCell = ({
  from,
  to,
  framework,
  ...restProps
}: {
  from: ControlStatus;
  to: ControlStatus;
  framework: SecControlsFrameworkType;
} & FlexProps) => {
  const { t } = useTranslation();
  const isoBatteryOptions = useMemo(() => {
    const options = t('sphere.securityProfiles.iso27001.batteryOptions', {
      returnObjects: true,
    });
    const returnOptions: Partial<Record<ControlStatus, string>> =
      Object.fromEntries(
        Object.entries(options).map(([key, value]) => [
          key.replace('.', '') as ControlStatus,
          value as string,
        ]),
      );

    return returnOptions;
  }, [t]);
  const CONTROL_STATUS_TO_TEXT_REFINED = useMemo(
    () => ({
      ...CONTROL_STATUS_TO_TEXT,
      [SecControlsFramework.ISO27001]: isoBatteryOptions,
    }),
    [isoBatteryOptions],
  );

  const fromStatus = CONTROL_STATUS_TO_TEXT_REFINED[framework][from];
  const toStatus = CONTROL_STATUS_TO_TEXT_REFINED[framework][to];

  return (
    <Flex
      direction='row'
      justifyContent='start'
      alignItems='center'
      gap='5px'
      {...restProps}
    >
      <StatusBadge status={fromStatus ?? ''} />
      <BsArrowRight />
      <StatusBadge status={toStatus ?? ''} />
    </Flex>
  );
};

export const EffectCell = ({
  currencySignFormatter,
  value,
  originalValue,
  isLong = false,
  width,
}: {
  currencySignFormatter: (value: number) => string;
  value: number;
  originalValue: number;
  isLong?: boolean;
  width?: string;
}) => {
  const valueText = useMemo(() => {
    const [positiveOfZero, sign] = value > 0 ? [value, '- '] : [0, ''];
    return `${sign}${currencySignFormatter(positiveOfZero)}`;
  }, [currencySignFormatter, value]);
  const effectText = useMemo(() => {
    const [percentage, sign] =
      value > 0
        ? [getEffectPercentage(value, originalValue), ` ${downwardArrow}`]
        : [0, ''];
    return `(${percentage}%${sign})`;
  }, [originalValue, value]);
  return (
    <Flex gap='2px' width={width}>
      <Tooltip label={`- ${currencySignFormatter(value)}`}>
        <Text
          whiteSpace='nowrap'
          maxWidth={isLong ? '130px' : '80px'}
          overflow='hidden'
          textOverflow='ellipsis'
          fontSize='14px'
        >
          {valueText}
        </Text>
      </Tooltip>
      <Text
        as='span'
        fontSize='10px'
        color='brand.misc.6'
        display='inline-block'
        whiteSpace='nowrap'
      >
        <ErrorBoundary>{effectText}</ErrorBoundary>
      </Text>
    </Flex>
  );
};
