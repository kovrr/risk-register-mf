import { Flex, SkeletonText } from '@chakra-ui/react';
import Card from 'components/containers/cards/Card';
import {
  SecControlsFramework,
  SecControlsFrameworkType,
} from 'options/constants';
import { FC } from 'react';
import { ByControlToMinimal } from 'types/security-controls';
import { EmptyTable } from './EmptyTable';
import MitigationTable from './MitigationTable';
import { useWhatIfScenariosTable } from './useWhatIfScenarioTable';

type TopActionsProps = {
  controlsFramework?: SecControlsFrameworkType;
  byControlToMinimal: ByControlToMinimal;
  title?: string;
  description?: string;
  currency: string;
  aal: number;
};

export const TopActions: FC<TopActionsProps> = ({
  controlsFramework,
  byControlToMinimal,
  title: _title,
  description: _description,
  currency,
  aal,
}) => {
  const { table, isLoading } = useWhatIfScenariosTable({
    currency,
    secControlsFramework: controlsFramework || SecControlsFramework.NIST,
    options: {
      disableSubRows: true,
      disableRowSelection: true,
      disableSorting: true,
      limitResults: 3,
      disabledColumns: ['controlFunction'],
    },
    byControlToMinimal,
    minimized: true,
    aal,
  });
  const averageEffectColumn = table.getColumn('averageEffect');
  const isAverageEffectColumnAllZeroes = averageEffectColumn
    ? table.getRowModel().rows.every((row) => {
        const value = row.original['averageEffect'];
        return value === 0 || Math.round(value) === 0;
      })
    : false;

  return (
    <Card
      minHeight='276px'
      height='fit-content'
      maxW='1005px'
      padding='20px'
      data-testid='top-actions'
    >
      <Flex direction='column' gap='28px'>
        <SkeletonText
          noOfLines={8}
          spacing='4'
          height={!controlsFramework || isLoading ? '200px' : undefined}
          isLoaded={!!controlsFramework && !isLoading}
        >
          {table.getRowModel().rows.length === 0 ||
          isAverageEffectColumnAllZeroes ? (
            <EmptyTable />
          ) : (
            <MitigationTable
              table={table}
              containedComponent
              selectedRows={{}}
              disableSorting
            />
          )}
        </SkeletonText>
      </Flex>
    </Card>
  );
};
