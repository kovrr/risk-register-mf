import { useRiskScenarios } from '@/services/hooks';
import type { RiskRegisterImpact } from '@/types/riskRegister';
import { useMemo } from 'react';

const likelihoodLabels = [
  'Expected',
  'Likely',
  'Possible',
  'Unlikely',
  'Rare',
] as const;
const impactLabels = [
  'Severe',
  'Significant',
  'Moderate',
  'Minor',
  'Negligible',
] as const;

const cellColorMap: Record<string, Record<string, string>> = {
  Severe: {
    Expected: 'rgba(255, 77, 79, 0.65)',
    Likely: 'rgba(255, 99, 97, 0.6)',
    Possible: 'rgba(255, 99, 97, 0.6)',
    Unlikely: 'rgba(255, 171, 145, 0.45)',
    Rare: 'rgba(255, 171, 145, 0.4)',
  },
  Significant: {
    Expected: 'rgba(255, 120, 117, 0.55)',
    Likely: 'rgba(255, 160, 122, 0.5)',
    Possible: 'rgba(255, 178, 132, 0.45)',
    Unlikely: 'rgba(255, 193, 158, 0.4)',
    Rare: 'rgba(144, 238, 144, 0.35)',
  },
  Moderate: {
    Expected: 'rgba(255, 160, 122, 0.45)',
    Likely: 'rgba(255, 178, 132, 0.4)',
    Possible: 'rgba(255, 193, 158, 0.4)',
    Unlikely: 'rgba(255, 235, 156, 0.5)',
    Rare: 'rgba(144, 238, 144, 0.45)',
  },
  Minor: {
    Expected: 'rgba(255, 193, 158, 0.35)',
    Likely: 'rgba(255, 220, 130, 0.45)',
    Possible: 'rgba(255, 235, 156, 0.55)',
    Unlikely: 'rgba(255, 235, 156, 0.6)',
    Rare: 'rgba(144, 238, 144, 0.55)',
  },
  Negligible: {
    Expected: 'rgba(144, 238, 144, 0.55)',
    Likely: 'rgba(144, 238, 144, 0.45)',
    Possible: 'rgba(144, 238, 144, 0.55)',
    Unlikely: 'rgba(144, 238, 144, 0.65)',
    Rare: 'rgba(144, 238, 144, 0.75)',
  },
};

type RiskRegisterVisualizationProps = {
  groupId?: string | null;
};

function RiskRegisterVisualization({
  groupId,
}: RiskRegisterVisualizationProps) {
  // Fetch a large page to aggregate. If backend provides viz endpoints later, we can swap.
  const { data } = useRiskScenarios({
    page: 1,
    size: 250,
    groupId: groupId ?? undefined,
  });

  const items = Array.isArray(data?.items) ? data.items : [];

  const matrix = useMemo(() => {
    const byCell: Record<
      string,
      { ids: string[]; impact: RiskRegisterImpact }
    > = {};
    for (const it of items) {
      const likelihood = it.scenario_data.likelihood as string;
      const impact = it.scenario_data.impact as RiskRegisterImpact;
      const key = `${likelihood}|${impact}`;
      if (!byCell[key]) byCell[key] = { ids: [], impact };
      byCell[key].ids.push(it.customer_scenario_id);
    }
    return byCell;
  }, [items]);

  const metrics = useMemo(() => {
    // Top AI Assets by Risk Count
    const aiAssetCounts = new Map<string, number>();
    // Most Common MITRE ATLAS Tactics
    const tacticCounts = new Map<string, number>();
    // Impact Type Distribution
    const impactTypeCounts = new Map<string, number>();
    // Controls Mapped to Multiple Scenarios (aggregate by control id/name across frameworks)
    const controlCounts = new Map<string, number>();

    for (const it of items) {
      const sd = it.scenario_data;
      (sd.ai_assets ?? []).forEach((a) =>
        aiAssetCounts.set(a, (aiAssetCounts.get(a) ?? 0) + 1),
      );
      (sd.tactics ?? []).forEach((t) =>
        tacticCounts.set(t, (tacticCounts.get(t) ?? 0) + 1),
      );
      (sd.impact_types ?? []).forEach((t) =>
        impactTypeCounts.set(t, (impactTypeCounts.get(t) ?? 0) + 1),
      );
      const rc = sd.relevant_controls;
      if (rc) {
        [
          rc.relevant_cis_controls,
          rc.relevant_nist_controls,
          rc.relevant_nist_v2_controls,
          rc.relevant_iso27001_controls,
          rc.relevant_cis_v8_controls,
          rc.relevant_cis_v8_safeguards,
          rc.relevant_cis_v7_safeguards,
          rc.relevant_tisax_controls,
        ]
          .filter(Boolean)
          .forEach((arr: string[] | undefined) => {
            (arr ?? []).forEach((ctrl) =>
              controlCounts.set(ctrl, (controlCounts.get(ctrl) ?? 0) + 1),
            );
          });
      }
    }

    const top = (map: Map<string, number>, limit = 5) =>
      [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, limit);

    return {
      topAssets: top(aiAssetCounts),
      commonTactics: top(tacticCounts),
      impactTypes: top(impactTypeCounts),
      multiScenarioControls: top(
        new Map([...controlCounts.entries()].filter(([_, c]) => c > 1)),
        10,
      ),
    };
  }, [items]);

  return (
    <div className='flex flex-col gap-8 lg:flex-row lg:items-start'>
      {/* 5x5 Matrix (left) */}
      <div className='flex-1'>
        <div className='mb-4'>
          <h2 className='text-2xl font-bold text-gray-900 mb-1'>
            Risk Prioritization Matrix
          </h2>
          <p className='text-sm text-gray-500'>
            Visualize risk distribution across likelihood and impact dimensions
          </p>
        </div>

        <div className='bg-white rounded-xl border border-gray-200 shadow-sm p-6 overflow-x-auto'>
          <div
            className='grid gap-[2px]'
            style={{ gridTemplateColumns: '100px repeat(5, 150px)' }}
          >
            {/* Header Row (blank + X-axis labels) */}
            <div className='bg-transparent' />
            {likelihoodLabels.map((lbl) => (
              <div
                key={lbl}
                className='flex h-12 items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-t-md text-gray-700 transition-all duration-200'
              >
                <span className='text-xs font-bold uppercase tracking-wider'>
                  {lbl}
                </span>
              </div>
            ))}

            {/* Rows */}
            {impactLabels.map((impactLabel) => (
              <div key={impactLabel} className='contents'>
                <div className='flex h-24 items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-l-md px-3 text-gray-700'>
                  <span className='text-xs font-bold uppercase tracking-wider text-center leading-tight'>
                    {impactLabel}
                  </span>
                </div>
                {likelihoodLabels.map((likelihoodLabel) => {
                  const key = `${likelihoodLabel}|${impactLabel}`;
                  const cell = matrix[key];
                  const ids = cell?.ids ?? [];
                  const count = ids.length;
                  const bg =
                    cellColorMap[impactLabel]?.[likelihoodLabel] || '#F8FAFC';
                  return (
                    <div key={key} className='relative'>
                      <div
                        className='group relative h-24 border border-gray-200 rounded-md transition-all duration-200 hover:shadow-md hover:scale-[1.02] hover:z-10 cursor-pointer'
                        style={{ backgroundColor: bg }}
                      >
                        {count > 0 && (
                          <>
                            <div className='absolute -top-2 -right-2 flex items-center justify-center min-w-[28px] h-7 rounded-full bg-gradient-to-r from-indigo-600 to-indigo-700 px-2.5 py-1 shadow-lg border-2 border-white'>
                              <span className='text-xs font-bold text-white'>
                                {count}
                              </span>
                            </div>
                            <div className='pointer-events-none absolute bottom-full right-0 mb-2 hidden max-w-[280px] whitespace-pre-wrap rounded-lg bg-gray-900 px-3 py-2 text-xs text-white shadow-2xl group-hover:block z-20 border border-gray-700'>
                              <div className='absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900'></div>
                              <div className='font-semibold mb-1 text-indigo-300'>
                                Scenarios:
                              </div>
                              <div className='text-gray-200'>
                                {ids.join(', ')}
                              </div>
                            </div>
                          </>
                        )}
                        {count === 0 && (
                          <div className='absolute inset-0 flex items-center justify-center'>
                            <div className='w-1 h-1 rounded-full bg-gray-300 opacity-40'></div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Metrics sidebar (right) */}
      <div className='flex flex-col gap-6 lg:min-w-[400px] lg:max-w-[400px]'>
        {/* Top AI Assets */}
        <div className='bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200'>
          <div className='bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200'>
            <h3 className='text-lg font-bold text-gray-900 flex items-center gap-2'>
              <div className='w-2 h-2 rounded-full bg-blue-500'></div>
              Top AI Assets by Risk Count
            </h3>
            <p className='text-xs text-gray-500 mt-1'>
              Most frequently affected assets
            </p>
          </div>
          <div className='p-6'>
            {metrics.topAssets.length > 0 ? (
              <div className='space-y-4'>
                {metrics.topAssets.map(([asset, n], idx) => (
                  <div
                    key={asset}
                    className='flex items-center justify-between group hover:bg-gray-50 -mx-2 px-2 py-2 rounded-lg transition-colors duration-150'
                  >
                    <div className='flex items-center gap-3 flex-1 min-w-0'>
                      <div className='flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center'>
                        <span className='text-xs font-bold text-blue-600'>
                          {idx + 1}
                        </span>
                      </div>
                      <span className='text-sm font-medium text-gray-800 truncate'>
                        {asset}
                      </span>
                    </div>
                    <div className='flex-shrink-0 ml-4'>
                      <span className='inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-blue-50 text-blue-700 border border-blue-200'>
                        {n} {n === 1 ? 'risk' : 'risks'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className='text-center py-8'>
                <div className='text-gray-400 mb-2'>
                  <svg
                    className='w-12 h-12 mx-auto'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={1.5}
                      d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                    />
                  </svg>
                </div>
                <span className='text-sm text-gray-500'>No data available</span>
              </div>
            )}
          </div>
        </div>

        {/* MITRE ATLAS Tactics */}
        <div className='bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200'>
          <div className='bg-gradient-to-r from-purple-50 to-pink-50 px-6 py-4 border-b border-gray-200'>
            <h3 className='text-lg font-bold text-gray-900 flex items-center gap-2'>
              <div className='w-2 h-2 rounded-full bg-purple-500'></div>
              Most Common MITRE ATLAS Tactics
            </h3>
            <p className='text-xs text-gray-500 mt-1'>
              Frequently observed attack patterns
            </p>
          </div>
          <div className='p-6'>
            {metrics.commonTactics.length > 0 ? (
              <div className='space-y-4'>
                {metrics.commonTactics.map(([tactic, n], idx) => (
                  <div
                    key={tactic}
                    className='flex items-center justify-between group hover:bg-gray-50 -mx-2 px-2 py-2 rounded-lg transition-colors duration-150'
                  >
                    <div className='flex items-center gap-3 flex-1 min-w-0'>
                      <div className='flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center'>
                        <span className='text-xs font-bold text-purple-600'>
                          {idx + 1}
                        </span>
                      </div>
                      <span className='text-sm font-medium text-gray-800 truncate'>
                        {tactic}
                      </span>
                    </div>
                    <div className='flex-shrink-0 ml-4'>
                      <span className='inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-purple-50 text-purple-700 border border-purple-200'>
                        {n}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className='text-center py-8'>
                <div className='text-gray-400 mb-2'>
                  <svg
                    className='w-12 h-12 mx-auto'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={1.5}
                      d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                    />
                  </svg>
                </div>
                <span className='text-sm text-gray-500'>No data available</span>
              </div>
            )}
          </div>
        </div>

        {/* Impact Type Distribution */}
        <div className='bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200'>
          <div className='bg-gradient-to-r from-orange-50 to-amber-50 px-6 py-4 border-b border-gray-200'>
            <h3 className='text-lg font-bold text-gray-900 flex items-center gap-2'>
              <div className='w-2 h-2 rounded-full bg-orange-500'></div>
              Impact Type Distribution
            </h3>
            <p className='text-xs text-gray-500 mt-1'>
              Distribution across impact categories
            </p>
          </div>
          <div className='p-6'>
            {metrics.impactTypes.length > 0 ? (
              <div className='space-y-4'>
                {metrics.impactTypes.map(([it, n], idx) => (
                  <div
                    key={it}
                    className='flex items-center justify-between group hover:bg-gray-50 -mx-2 px-2 py-2 rounded-lg transition-colors duration-150'
                  >
                    <div className='flex items-center gap-3 flex-1 min-w-0'>
                      <div className='flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center'>
                        <span className='text-xs font-bold text-orange-600'>
                          {idx + 1}
                        </span>
                      </div>
                      <span className='text-sm font-medium text-gray-800 truncate'>
                        {it}
                      </span>
                    </div>
                    <div className='flex-shrink-0 ml-4'>
                      <span className='inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-orange-50 text-orange-700 border border-orange-200'>
                        {n}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className='text-center py-8'>
                <div className='text-gray-400 mb-2'>
                  <svg
                    className='w-12 h-12 mx-auto'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={1.5}
                      d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
                    />
                  </svg>
                </div>
                <span className='text-sm text-gray-500'>No data available</span>
              </div>
            )}
          </div>
        </div>

        {/* Controls Mapped to Multiple Scenarios */}
        <div className='bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200'>
          <div className='bg-gradient-to-r from-emerald-50 to-teal-50 px-6 py-4 border-b border-gray-200'>
            <h3 className='text-lg font-bold text-gray-900 flex items-center gap-2'>
              <div className='w-2 h-2 rounded-full bg-emerald-500'></div>
              Controls Mapped to Multiple Scenarios
            </h3>
            <p className='text-xs text-gray-500 mt-1'>
              Controls covering multiple risks
            </p>
          </div>
          <div className='p-6'>
            {metrics.multiScenarioControls.length > 0 ? (
              <div className='space-y-4 max-h-[400px] overflow-y-auto'>
                {metrics.multiScenarioControls.map(([ctrl, n], idx) => (
                  <div
                    key={ctrl}
                    className='flex items-center justify-between group hover:bg-gray-50 -mx-2 px-2 py-2 rounded-lg transition-colors duration-150'
                  >
                    <div className='flex items-center gap-3 flex-1 min-w-0'>
                      <div className='flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center'>
                        <span className='text-xs font-bold text-emerald-600'>
                          {idx + 1}
                        </span>
                      </div>
                      <span
                        className='text-sm font-medium text-gray-800 truncate'
                        title={ctrl}
                      >
                        {ctrl}
                      </span>
                    </div>
                    <div className='flex-shrink-0 ml-4'>
                      <span className='inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200'>
                        {n} {n === 1 ? 'scenario' : 'scenarios'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className='text-center py-8'>
                <div className='text-gray-400 mb-2'>
                  <svg
                    className='w-12 h-12 mx-auto'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={1.5}
                      d='M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z'
                    />
                  </svg>
                </div>
                <span className='text-sm text-gray-500'>No data available</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RiskRegisterVisualization;
