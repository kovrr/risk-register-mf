import { Flex, SkeletonText } from '@chakra-ui/react';
import React, { FC, useState } from 'react';

import { Legend } from '../legend';
import { DamageTypeInDrawerView } from './DamageTypeInDrawerView';
import { DamageTypeMainView } from './DamageTypeMainView';
import DamageTypeModal from '../DamageTypeModal';
import { RiskDriverDamageTypesProps } from 'types/riskDrivers/damageTypes';

export const DamageTypesAnnual: FC<RiskDriverDamageTypesProps> = ({
  inDrawer,
  aal,
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const openDrawer = () => {
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };
  if (!aal) return null;

  return (
    <SkeletonText isLoaded={true} noOfLines={3} spacing='50px'>
      <Flex
        direction='column'
        data-testid={`DamageTypesAnnual-${inDrawer ? 'drawer' : 'main'}`}
      >
        <Legend gap='12px' justifyContent='start' height='18px'></Legend>
        {inDrawer ? (
          <DamageTypeInDrawerView aal={aal} />
        ) : (
          <DamageTypeMainView openDrawer={openDrawer} aal={aal} />
        )}
        <DamageTypeModal
          onCloseDrawer={closeDrawer}
          isDrawerOpen={isDrawerOpen}
        />
      </Flex>
    </SkeletonText>
  );
};
