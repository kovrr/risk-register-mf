import React, { CSSProperties } from 'react';
import InfoIcon from '../icons/info.svg';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverArrow,
  Flex,
} from '@chakra-ui/react';

interface Props {
  description: string;
  iconStyles?: CSSProperties;
  iconSrc?: string;
  trigger?: 'click' | 'hover';
}

const popoverStyle = {
  backgroundColor: '#464646',
  fontWeight: '400',
  color: '#fff',
  fontSize: '13px',
};

const PopoverComponent: React.FC<Props> = ({
  description,
  iconStyles,
  iconSrc = InfoIcon,
  trigger,
}) => {
  return (
    <Popover trigger={trigger || 'click'}>
      <PopoverTrigger>
        {/* using a Flex to catch the entire square */}
        <Flex h='100%' alignItems='center'>
          <img alt='' src={iconSrc} style={iconStyles || {}} />
        </Flex>
      </PopoverTrigger>
      {description && (
        <PopoverContent>
          <PopoverArrow backgroundColor='brand.tooltip' />
          <PopoverBody {...popoverStyle} textTransform='none'>
            {description}
          </PopoverBody>
        </PopoverContent>
      )}
    </Popover>
  );
};

export default PopoverComponent;
