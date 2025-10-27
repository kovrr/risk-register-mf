import { Badge, Box, type BoxProps, Flex, Link, Text } from '@chakra-ui/react';
import type React from 'react';

// Replaced next/image with regular img tag

type TitleCardProps = BoxProps & {
  icon: string;
  title: string;
  content: React.ReactNode;
  topLink?: {
    text: string | null;
    href: string | null;
  };
  bottomLink?: {
    text: string | null;
    href: string | null;
  };
  badges?: string[];
};

export const TitleCard: React.FC<TitleCardProps> = ({
  icon,
  title,
  content,
  topLink,
  bottomLink,
  badges,
  ...props
}) => {
  return (
    <Box
      p='15px'
      display='flex'
      flexDirection='row'
      gap='20px'
      backgroundColor='brand.ghostWhite'
      borderRadius='4px'
      width='66.666%'
      minWidth='0'
      flexShrink={0}
      alignItems='stretch'
      {...props}
    >
      <Flex direction='column' justifyContent='start'>
        <Flex width='50px' height='50px'>
          <img src={icon} alt='' />
        </Flex>
      </Flex>
      <Flex
        direction='column'
        gap='2px'
        flex={badges && badges.length > 0 ? '2' : '1'}
        minWidth='0'
      >
        <Flex direction='row' justifyContent='start' fontSize='14px' gap='8px'>
          <Text fontWeight='700'>{title}</Text>
          {topLink?.text && (
            <Link
              fontWeight='600'
              textDecoration='underline'
              color='brand.red_2'
              href={topLink.href ?? undefined}
              isExternal
            >
              {topLink.text}
            </Link>
          )}
        </Flex>
        <Flex
          direction='column'
          gap='2px'
          fontSize='13px'
          fontWeight='400'
          lineHeight='normal'
        >
          <Text css={{ li: { marginLeft: '15px' } }} fontWeight='inherit'>
            {content}
          </Text>
          {bottomLink?.href && (
            <Link
              href={bottomLink.href ?? undefined}
              fontWeight='inherit'
              isExternal
            >
              {bottomLink.text}
            </Link>
          )}
        </Flex>
      </Flex>
      {badges && badges.length > 0 && (
        <Flex
          direction='column'
          gap='10px'
          justifyContent='flex-start'
          alignItems='flex-start'
          flex='1'
          minWidth='0'
          alignSelf='stretch'
          flexGrow={1}
          width='100%'
        >
          <Text fontWeight='600' fontSize='14px' mb='4px'>
            Damage Types
          </Text>
          <Flex direction='column' gap='8px' alignItems='flex-start'>
            {badges.map((badge, idx) => (
              <Badge
                key={badge}
                variant='scenarioDamageType'
                fontSize='12px'
                color='white'
                display='flex'
                padding='4px 9px'
                alignItems='center'
                borderRadius='full'
              >
                {badge.split('_').join(' ')}
              </Badge>
            ))}
          </Flex>
        </Flex>
      )}
    </Box>
  );
};
