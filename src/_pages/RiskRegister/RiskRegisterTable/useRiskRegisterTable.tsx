import { TableHeaderCell } from '@/components/molecules/TableHeaderCell';
import { useRiskScenarios } from '@/services/hooks';
import {
  type RiskRegisterRow,
  scenarioStatus,
  scenarioTypes,
} from '@/types/riskRegister';
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ResponsePlanDropdownMutate } from '../components/ResponsePlanDropdownMutate';
import { RiskOwnerDropdownMutate } from '../components/RiskOwner';
import { LikelihoodBadge } from '@/components/molecules/LikelihoodBadge';
import { Impact } from './Cells/Impact';
import { ScenarioDetails } from './Cells/ScenarioDetails';
import { StatusBadge } from '@/components/ui/Badge/StatusBadge';
import { TableActions } from './Cells/TableActions';

const columnHelper = createColumnHelper<RiskRegisterRow>();
const useColumns = () => {
  const columns = useMemo(
    () => [
      columnHelper.accessor('customerScenarioId', {
        cell: (info) => info.getValue(),
        header: () => <TableHeaderCell title='ID' />,
        enableSorting: true,
      }),
      columnHelper.accessor('scenario', {
        cell: ({ row }) => (
          <ScenarioDetails
            id={row.original.scenarioId}
            title={row.original.scenarioTitle}
            description={row.original.scenarioDescription}
            disabled={row.original.status !== scenarioStatus.COMPLETED}
          />
        ),
        header: () => <TableHeaderCell title='Scenario Name' />,
        enableSorting: true,
      }),
      columnHelper.accessor((row) => row.category ?? '-', {
        id: 'category',
        cell: (info) => info.getValue(),
        header: () => <TableHeaderCell title='Category' />,
        enableSorting: true,
      }),
      columnHelper.accessor('tags', {
        cell: ({ row }) => <TagsCell tags={row.original.tags || []} />,
        header: () => <TableHeaderCell title='Tags' />,
        enableSorting: false,
      }),
      columnHelper.accessor('priority', {
        cell: (info) =>
          info.getValue() ? (
            // display-only badge; colors come from theme variants if configured
            <span className='font-semibold'>{info.getValue()}</span>
          ) : (
            '-'
          ),
        header: () => <TableHeaderCell title='Priority' />,
        enableSorting: true,
      }),
      columnHelper.accessor('impact', {
        cell: ({ row }) => <Impact value={row.original.impact} />,
        header: () => <TableHeaderCell title='Impact' />,
        enableSorting: true,
      }),
      columnHelper.accessor('likelihood', {
        cell: ({ row }) => <LikelihoodBadge value={row.original.likelihood} />,
        header: () => <TableHeaderCell title='Likelihood' />,
        enableSorting: true,
      }),
      columnHelper.accessor('status', {
        cell: (info) => <StatusBadge status={String(info.getValue())} />,
        header: () => <TableHeaderCell title='Status' />,
        enableSorting: true,
      }),
      columnHelper.accessor('responsePlan', {
        cell: (info) => (
          <ResponsePlanDropdownMutate
            value={info.getValue()}
            rowData={info.row.original}
            key={`${info.row.original.scenarioId}-responsePlan`}
          />
        ),
        header: () => <TableHeaderCell title='Response Plan' />,
        enableSorting: true,
      }),
      columnHelper.accessor('owner', {
        cell: (info) => (
          <RiskOwnerDropdownMutate
            value={info.getValue()}
            rowData={info.row.original}
            key={`${info.row.original.scenarioId}-owner`}
          />
        ),
        header: () => <TableHeaderCell title='Owner' />,
        enableSorting: true,
      }),
      columnHelper.display({
        id: 'actions',
        cell: ({ row }) => <TableActions scenario={row.original} />,
        header: () => <TableHeaderCell title='' />,
        enableSorting: false,
      }),
    ],
    [],
  );
  return columns;
};

const mapColumnToApiField = (columnId: string): string => {
  const mappings: Record<string, string> = {
    customerScenarioId: 'customer_scenario_id',
    scenario: 'name',
    likelihood: 'likelihood', // Combined column uses likelihood for sorting
    annualLikelihood: 'annual_likelihood', // Combined column uses annual_likelihood for sorting
    priority: 'risk_priority',
    responsePlan: 'response_plan',
    lastUpdated: 'updated_at',
    owner: 'risk_owner',
  };
  return mappings[columnId] || columnId;
};

type UseRiskRegisterTableParams = {
  search?: string;
  groupId?: string | null;
  tagIds?: string[];
};

const useData = (params: UseRiskRegisterTableParams) => {
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const { search, groupId, tagIds } = params;

  const [sorting, setSortingState] = useState<{ id: string; desc: boolean }[]>([
    { id: 'lastUpdated', desc: true }, // Default sorting
  ]);
  const sortBy = sorting[0]?.id
    ? mapColumnToApiField(sorting[0].id)
    : 'updated_at';
  const sortOrder = sorting[0]?.desc ? 'desc' : 'asc';
  const setSorting = useCallback(
    (updater: any) => {
      setSortingState(updater);
      setPageIndex(0);
    },
    [setPageIndex, setSortingState],
  );

  const {
    data: scenarios,
    isPending,
    isFetching,
  } = useRiskScenarios({
    page: pageIndex + 1,
    size: pageSize,
    name: search && search.length > 0 ? search : undefined,
    sort_by: sortBy,
    sort_order: sortOrder,
    groupId: groupId ?? undefined,
    tag_ids: tagIds && tagIds.length > 0 ? tagIds : undefined,
  });

  useEffect(() => {
    setPageIndex(0);
  }, [groupId, tagIds]);

  const data = useMemo(() => {
    if (!scenarios || !scenarios.items || !Array.isArray(scenarios.items))
      return [];
    return scenarios.items.map((scenario) => ({
      id: scenario.scenario_id,
      customerScenarioId: scenario.customer_scenario_id,
      scenarioTitle: scenario.name,
      scenarioDescription: scenario.description,
      company_id: scenario.scenario_data.company_id,
      company_name: scenario.company_name,
      likelihood: scenario.scenario_data.likelihood,
      impact: scenario.scenario_data.impact,
      annualLikelihood: scenario.scenario_data.annual_likelihood,
      averageLoss: scenario.scenario_data.average_loss,
      averageLossCurrency: scenario.scenario_data.average_loss_currency,
      priority: scenario.scenario_data.risk_priority,
      responsePlan: scenario.scenario_data.response_plan,
      lastUpdated: scenario.updated_at,
      owner: scenario.scenario_data.risk_owner,
      category: Array.isArray(scenario.scenario_data.scenario_category)
        ? scenario.scenario_data.scenario_category[0] ?? null
        : null,
      tags: (scenario as any).tags || [],
      scenario: null,
      tableOptions: null,
      scenarioId: scenario.scenario_id,
      version: scenario.version,
      scenarioType: scenario.scenario_type,
      status: scenario.status,
      crqData: scenario.scenario_data.crq_data,
    }));
  }, [scenarios]);

  return {
    data,
    pageCount: Math.ceil((scenarios?.total || 0) / pageSize),
    pageSize,
    setPageSize,
    pageIndex,
    setPageIndex,
    totalCount: scenarios?.total || 0,
    sorting,
    setSorting,
    isLoading: isPending,
    isFetching,
  };
};

export const useRiskRegisterTable = (params: UseRiskRegisterTableParams) => {
  const columns = useColumns();
  const {
    data,
    pageCount,
    pageSize,
    setPageSize,
    pageIndex,
    setPageIndex,
    totalCount,
    sorting,
    setSorting,
    isLoading,
    isFetching,
  } = useData(params);
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true,
    pageCount,
    state: {
      pagination: {
        pageIndex,
        pageSize,
      },
      sorting,
    },
    onPaginationChange: (updater) => {
      if (typeof updater === 'function') {
        const newState = updater({ pageIndex, pageSize });
        setPageIndex(newState.pageIndex);
        setPageSize(newState.pageSize);
      } else {
        setPageIndex(updater.pageIndex);
        setPageSize(updater.pageSize);
      }
    },
    onSortingChange: setSorting,
  });

  return {
    table,
    pageCount,
    pageSize,
    pageIndex,
    totalCount,
    setPageIndex,
    setPageSize,
    isLoading,
    isFetching,
  };
};
