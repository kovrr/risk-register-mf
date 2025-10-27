import TableHeader from '@/components/molecules/TableHeader';
import {
  controlsFrameworkHelper,
  genericFilter,
  getDesc,
  type ISOControlsType,
  sortControls,
  sortIfNotSubRow,
  sortStatuses,
  sortStatusesByValues,
} from '@/utils/mitigationUtils';
import { Flex, IconButton, Text } from '@chakra-ui/react';
import {
  createColumnHelper,
  type ExpandedState,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type OnChangeFn,
  type PaginationState,
  type RowSelectionState,
  type SortingState,
  type Updater,
  useReactTable,
} from '@tanstack/react-table';
import { StatusBadge } from 'components/ui/Badge/StatusBadge';
import { ControlCell, EffectCell } from 'components/ui/tables/cells';
import {
  toChicagoTitleCaseWithCustomSplit,
  useCurrencySignAdderPredefinedCurrency,
} from 'helpers/string';
import {
  mapSecControlsType,
  SecControlsFramework,
  type SecControlsFrameworkType,
} from 'options/constants';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GoChevronDown, GoChevronUp } from 'react-icons/go';
import { useLocation, useNavigate } from 'react-router-dom';
import type { AssetGroupRow, ControlRow } from 'types/assetGroup';
import type { SecControlsType } from 'types/companyForm';
import {
  type ByControlToMinimal,
  CONTROL_STATUS_TO_TEXT,
  type ControlStatus,
  ignoredCurrentMinimums,
} from 'types/security-controls';
import { SphereKeysByAssetGroupType } from 'types/sphereForm';

const controlColumnHelper = createColumnHelper<ControlRow>();

const controlFrameworksTitles = {
  [SecControlsFramework.NIST]: 'Control Function',
  [SecControlsFramework.NIST_CSF_v2]: 'Control Function',
  [SecControlsFramework.CIS]: 'Control Category',
  [SecControlsFramework.ASB]: 'Control Function',
  [SecControlsFramework.ISO27001]: 'Control Theme',
  [SecControlsFramework.CISv8]: 'Control Theme',
};

const useWhatIfScenariosColumns = ({
  secControlsFramework,
  disableSorting,
  minimized = false,
  currency,
  aal,
}: {
  secControlsFramework?: SecControlsType;
  disableSorting?: boolean;
  minimized?: boolean;
  currency: string;
  aal: number;
}) => {
  const { t } = useTranslation('riskRegister');
  const { t: tCommon } = useTranslation('common');
  const currencySignFormatter = useCurrencySignAdderPredefinedCurrency({
    currency,
    shorten: true,
  });
  const isoControls: ISOControlsType = useMemo(
    () =>
      tCommon('sphere.securityProfiles.iso27001.drawer.controls', {
        returnObjects: true,
      }),
    [tCommon],
  );
  const isoBatteryOptions = useMemo(() => {
    const options = tCommon('sphere.securityProfiles.iso27001.batteryOptions', {
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
  }, [tCommon]);
  const CONTROL_STATUS_TO_TEXT_REFINED = useMemo(
    () => ({
      ...CONTROL_STATUS_TO_TEXT,
      [SecControlsFramework.ISO27001]: isoBatteryOptions,
    }),
    [isoBatteryOptions],
  );

  const columns = useMemo(() => {
    const baseColumns = [
      controlColumnHelper.accessor('control', {
        cell: (info) => {
          if (info.row.depth !== 0 || !info.getValue() || !secControlsFramework)
            return '';

          const { title, secondaryTitle } = controlsFrameworkHelper[
            secControlsFramework
          ].getText(info.getValue(), isoControls);

          return <ControlCell title={title} secondaryTitle={secondaryTitle} />;
        },

        header: (info) => (
          <TableHeader
            title={'Control'}
            disableSorting={disableSorting}
            columnData={info.column}
          />
        ),

        sortingFn: sortControls,
      }),
      controlColumnHelper.accessor('controlFunction', {
        cell: (info) => {
          if (info.row.depth !== 0 || !info.getValue() || !secControlsFramework)
            return '';
          return (
            <Flex>
              <Text
                padding='4px 9px'
                color='brand.gray.16'
                backgroundColor='brand.disabledBackground'
                fontSize='12px'
                fontWeight='700'
                borderRadius='5px'
              >
                {info.getValue()}
              </Text>
            </Flex>
          );
        },

        header: (info) => {
          return (
            <TableHeader
              title={
                secControlsFramework
                  ? controlFrameworksTitles[
                  mapSecControlsType(secControlsFramework)
                  ]
                  : ''
              }
              disableSorting={disableSorting}
              columnData={info.column}
            />
          );
        },

        sortingFn: sortControls,
      }),
      controlColumnHelper.accessor('currentMinimum', {
        minSize: 142,

        cell: (info) => {
          let value = info.getValue();
          if (value === '0.0' && secControlsFramework === 'ISO27001') {
            value = '0';
          }
          if (info.row.depth !== 0 || value === undefined || value === null)
            return '';

          const controlStatusMapping = secControlsFramework
            ? CONTROL_STATUS_TO_TEXT_REFINED[secControlsFramework]
            : undefined;
          const status =
            secControlsFramework && controlStatusMapping !== undefined
              ? controlStatusMapping[
              value.toString().replace('.', '') as ControlStatus
              ]
              : '';

          return <StatusBadge status={status ?? ''} />;
        },
        header: (info) => (
          <TableHeader
            title={t('controlsTable.currentMinimum.title')}
            info={t('controlsTable.currentMinimum')}
            disableSorting={disableSorting}
            columnData={info.column}
          />
        ),
        sortingFn: sortStatuses,
      }),
      controlColumnHelper.accessor('targetMinimum', {
        minSize: 137,

        cell: (info) => {
          if (!info.getValue()) return '';
          const controlStatusMapping = secControlsFramework
            ? CONTROL_STATUS_TO_TEXT_REFINED[secControlsFramework]
            : undefined;
          const status =
            secControlsFramework && controlStatusMapping !== undefined
              ? controlStatusMapping[
              info.getValue().toString().replace('.', '') as ControlStatus
              ]
              : '';
          return <StatusBadge status={status ?? ''} />;
        },
        header: (info) => (
          <TableHeader
            title={
              secControlsFramework === 'ISO27001'
                ? t('controlsTable.targetMinimumISO.title')
                : t('controlsTable.targetMinimum.title')
            }
            info={t('controlsTable.targetMinimum')}
            disableSorting={disableSorting}
            columnData={info.column}
          />
        ),
        sortingFn: sortStatuses,
      }),

      controlColumnHelper.accessor('averageEffect', {
        minSize: 128,
        cell: (info) => (
          <EffectCell
            currencySignFormatter={currencySignFormatter}
            value={info.getValue()}
            originalValue={aal}
          />
        ),
        header: (info) => (
          <TableHeader
            title={t('controlsTable.averageEffect.title')}
            info={t('controlsTable.averageEffect')}
            disableSorting={disableSorting}
            columnData={info.column}
          />
        ),
        sortingFn: sortIfNotSubRow,
      }),
    ];

    return minimized
      ? baseColumns
      : [
        ...baseColumns,
        controlColumnHelper.accessor('subRows', {
          cell: ({ row }) =>
            row.getCanExpand() && (
              <IconButton
                aria-label='expand-row'
                icon={
                  row.getIsExpanded() ? <GoChevronUp /> : <GoChevronDown />
                }
                onClick={(e) => {
                  e.stopPropagation();
                  row.getToggleExpandedHandler()();
                }}
                backgroundColor='transparent'
              />
            ),
          header: '',
        }),
      ];
  }, [
    minimized,
    secControlsFramework,
    isoControls,
    disableSorting,
    CONTROL_STATUS_TO_TEXT_REFINED,
    t,
    currencySignFormatter,
    aal,
  ]);
  return columns;
};

// In ISO it was wanted that the recommendations wont show actions to partially implemented, and will automatically
// skip to fully implemented
const ignoreRowsMaximums = {
  [SecControlsFramework.NIST]: new Set(['']),
  [SecControlsFramework.NIST_CSF_v2]: new Set(['']),
  [SecControlsFramework.ISO27001]: new Set(['0.5']),
  [SecControlsFramework.CIS]: new Set(['']),
  [SecControlsFramework.ASB]: new Set(['']),
  [SecControlsFramework.CISv8]: new Set(['']),
};

export const extractWhatIfTableData = (
  byControlToMinimal: ByControlToMinimal,
  secControlsFramework: SecControlsFrameworkType,
) => {
  const rowsByControl = Object.entries(byControlToMinimal)
    .map(([control, controlData]) => {
      return Object.entries(controlData)
        .filter(([, { current_status }]) => {
          return !ignoredCurrentMinimums[secControlsFramework].has(
            current_status,
          );
        })
        .map(([targetStatus, controlScenario]) => {
          return {
            control: control,
            controlFunction: getDesc[secControlsFramework](control),
            currentMinimum: controlScenario.current_status,
            targetMinimum: targetStatus,
            averageEffect: controlScenario.average_effect ?? 0,
            averageDamage: controlScenario.average_damage ?? 0,
            highEffect: controlScenario.pml_effect,
            highDamage: controlScenario.pml_damage,
            newAverage: controlScenario.by_minimal_new_average,
          };
        })
        .filter(
          (checkIFNoReduction) =>
            checkIFNoReduction.averageEffect !== 0 ||
            checkIFNoReduction.highEffect !== 0,
        );
    })
    .filter((checkIfEmpty) => checkIfEmpty.length !== 0);

  return rowsByControl
    .map((controlRows) => {
      controlRows = controlRows.filter((row) => {
        return !ignoreRowsMaximums[secControlsFramework].has(row.targetMinimum);
      });

      controlRows.sort((a, b) =>
        sortStatusesByValues(b.targetMinimum, a.targetMinimum),
      );

      const parentRow = { ...controlRows[0] };
      const subRows = controlRows
        .slice(1)
        .filter(
          (row) =>
            !ignoreRowsMaximums[secControlsFramework].has(row.currentMinimum),
        );
      // set the current minimum for each sub row to be like the parent row
      // so that mitigation actions could display all possible actions
      subRows.forEach((row) => {
        row.currentMinimum = parentRow.currentMinimum;
      });
      return subRows.length === 0 ? parentRow : { ...parentRow, subRows };
    })
    .filter((row) => row?.control); // To filter out empty rows
};

type useWhatIfScenariosTableParams = {
  secControlsFramework?: SecControlsType;
  options?: {
    disableSubRows?: boolean;
    disableRowSelection?: boolean;
    disableSorting?: boolean;
    limitResults?: number;
    disabledColumns?: string[];
  };
  byControlToMinimal: ByControlToMinimal;
  currency: string;
  aal: number;
  minimized?: boolean;
  withPagination?: boolean;
};

export const useWhatIfScenariosTable = ({
  secControlsFramework,
  options,
  byControlToMinimal,
  currency,
  aal,
  minimized = false,
  withPagination = false,
}: useWhatIfScenariosTableParams) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [sorting, setSorting] = useState<SortingState>([
    { id: 'averageEffect', desc: true },
  ]);
  const [filterValue, setFilterValue] = useState('');
  const [selectedRows, setSelectedRows] = useState<RowSelectionState>({});
  const [expanded, setExpanded] = useState<ExpandedState>({});

  const handleRowSelection: OnChangeFn<RowSelectionState> = useCallback(
    (getUpdateState: Updater<RowSelectionState>) => {
      // Whenever a top level row is selected, all the sub rows are selected too.
      // To prevent this behavior we check whether a top level row is selected
      // if so - we remove all other selected rows
      // otherwise - we keep the state as is
      // Example for top level row and sub rows: 12 and 12.1
      const currentSelectionState =
        typeof getUpdateState === 'function'
          ? getUpdateState({})
          : getUpdateState;
      const newSelectionState = Object.fromEntries(
        Object.entries(currentSelectionState).filter(([row]) => {
          return !String(row).includes('.');
        }),
      );
      setSelectedRows(
        Object.keys(newSelectionState).length
          ? newSelectionState
          : currentSelectionState,
      );
    },
    [],
  );

  const columns = useWhatIfScenariosColumns({
    currency,
    secControlsFramework,
    disableSorting: options?.disableSorting,
    minimized,
    aal,
  });

  const data: ControlRow[] = useMemo(
    () =>
      extractWhatIfTableData(
        byControlToMinimal || {},
        secControlsFramework
          ? mapSecControlsType(secControlsFramework)
          : SecControlsFramework.NIST,
      ),
    [byControlToMinimal, secControlsFramework],
  );
  const [paginationState, setPaginationState] = React.useState<PaginationState>(
    {
      pageIndex: 0,
      pageSize: 10,
    },
  );

  const showControlFunction =
    secControlsFramework !== SecControlsFramework.CISv8;

  const table = useReactTable({
    columns,
    data,
    onGlobalFilterChange: setFilterValue,
    onSortingChange: setSorting,
    globalFilterFn: genericFilter,
    enableSortingRemoval: false,
    getSubRows: !options?.disableSubRows ? (row) => row?.subRows : undefined,
    onExpandedChange: setExpanded,
    getExpandedRowModel: getExpandedRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onRowSelectionChange: !options?.disableRowSelection
      ? handleRowSelection
      : undefined,
    filterFns: {
      generic: genericFilter,
    },
    state: {
      sorting,
      expanded,
      globalFilter: filterValue,
      rowSelection: selectedRows,
      pagination: !withPagination
        ? {
          pageIndex: 0,
          pageSize: options?.limitResults || Number.MAX_SAFE_INTEGER,
        }
        : paginationState,
      columnVisibility: {
        control: true,
        controlFunction: showControlFunction,
        currentMinimum: true,
        targetMinimum: true,
        averageEffect: true,
        highEffect: true,
        subRows: true,
        ...(options?.disabledColumns
          ? options.disabledColumns.reduce(
            (acc, curr) => {
              acc[curr] = false;
              return acc;
            },
            {} as Record<string, boolean>,
          )
          : {}),
      },
    },
  });

  useEffect(() => {
    // This hook helps us set the selected row based on the path hash
    if (
      location.pathname.includes('risk-management/what-if') &&
      location.hash
    ) {
      const rowId = Number(location.hash.substring(1));
      if (!isNaN(rowId) && data.length > rowId) {
        setSelectedRows({ [Number(rowId)]: true });
      }
      navigate({ ...location, hash: '' }, { replace: true });
    }
  }, [location, navigate, data]);

  const clearTableSelection = useMemo(
    () => () => {
      setSelectedRows({});
    },
    [],
  );

  const isLoading = !byControlToMinimal;
  const hasNoData = !isLoading && !data.length;

  return {
    table,
    selectedRows,
    isLoading,
    hasNoData,
    clearTableSelection,
    paginationState: withPagination ? paginationState : undefined,
    setPaginationState: withPagination ? setPaginationState : undefined,
  };
};

const agTableColumnHelper = createColumnHelper<AssetGroupRow>();
const useAgsToMoveColumns = () => {
  const columns = useMemo(
    () => [
      agTableColumnHelper.accessor('name', {
        header: () => 'Asset Group',
        cell: (info) => info.renderValue(),
      }),
      agTableColumnHelper.accessor('type', {
        header: () => 'Asset Group Type',
        cell: (info) => {
          const cellValue = info.getValue();
          const agType =
            SphereKeysByAssetGroupType[cellValue as 'endpoints' | 'infra'] ??
            cellValue;

          return toChicagoTitleCaseWithCustomSplit(agType, '_');
        },
      }),
    ],
    [],
  );
  return columns;
};

export const useAgsToMoveTable = (assetGroups: AssetGroupRow[]) => {
  const columns = useAgsToMoveColumns();
  const data = useMemo(() => assetGroups, [assetGroups]);

  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
  });

  return { table };
};
