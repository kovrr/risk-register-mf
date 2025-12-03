import { useMemo } from 'react';
import { useRiskScenarios } from '@/services/hooks';
import { type RiskRegisterImpact } from '@/types/riskRegister';

const likelihoodLabels = ['Expected', 'Likely', 'Possible', 'Unlikely', 'Rare'] as const;
const impactLabels = ['Severe', 'Significant', 'Moderate', 'Minor', 'Negligible'] as const;

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

function RiskRegisterVisualization() {
  // Fetch a large page to aggregate. If backend provides viz endpoints later, we can swap.
  const { data } = useRiskScenarios({
    page: 1,
    size: 250,
  });

  const items = Array.isArray(data?.items) ? data.items : [];

  const matrix = useMemo(() => {
    const byCell: Record<string, { ids: string[]; impact: RiskRegisterImpact }> = {};
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
    <div className='flex items-start gap-6'>
      {/* 5x5 Matrix (left) */}
      <div>
        <h2 className='mb-3 text-[17px] font-bold text-slate-800'>
          Risk Prioritization Matrix (5×5)
        </h2>
        <div
          className='grid gap-1'
          style={{ gridTemplateColumns: '96px repeat(5, 140px)' }}
        >
          {/* Header Row (blank + X-axis labels) */}
          <div />
          {likelihoodLabels.map((lbl) => (
            <div
              key={lbl}
              className='flex h-[30px] items-center justify-center bg-[#F8FAFC] text-[#475569] box-border'
            >
              <span className='text-[14px] font-bold uppercase'>{lbl}</span>
            </div>
          ))}

          {/* Rows */}
          {impactLabels.map((impactLabel) => (
            <div key={impactLabel} className='contents'>
              <div className='flex h-20 items-center bg-[#F1F5F9] pl-2 text-[#475569] box-border'>
                <span className='text-[14px] font-bold uppercase'>
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
                  <div key={key}>
                    <div
                      className='group relative h-20 px-2 py-2'
                      style={{ backgroundColor: bg, boxSizing: 'border-box' }}
                    >
                      {count > 0 && (
                        <>
                          <span className='absolute right-2 top-1 rounded-full bg-[#6366F1] px-2 py-[2px] text-[11px] font-bold text-white'>
                            {count}
                          </span>
                          <div className='pointer-events-none absolute bottom-full right-2 mb-1 hidden max-w-[220px] whitespace-pre-wrap rounded-md bg-slate-900 px-2 py-1 text-[11px] text-white shadow-lg group-hover:block'>
                            {ids.join(', ')}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Metrics sidebar (right) */}
      <div className='flex min-w-[360px] flex-1 flex-col gap-4'>
        <div className='rounded-2xl bg-white p-4 shadow-sm'>
          <h3 className='mb-3 text-[16px] font-bold text-slate-800'>
            Top AI Assets by Risk Count
          </h3>
          <div className='flex flex-col gap-1.5'>
            {metrics.topAssets.map(([asset, n], idx) => {
              const isLast = idx === metrics.topAssets.length - 1;
              return (
                <div
                  key={asset}
                  className={`flex items-center justify-between ${
                    isLast ? '' : 'mb-1.5 border-b border-slate-200 pb-1.5'
                  }`}
                >
                  <span className='text-sm text-slate-800'>{asset}</span>
                  <span className='text-sm font-semibold text-[#2563EB]'>
                    {n} {n === 1 ? 'risk' : 'risks'}
                  </span>
                </div>
              );
            })}
            {metrics.topAssets.length === 0 && (
              <span className='text-sm text-gray-500'>No data</span>
            )}
          </div>
        </div>

        <div className='rounded-2xl bg-white p-4 shadow-sm'>
          <h3 className='mb-3 text-[16px] font-bold text-slate-800'>
            Most Common MITRE ATLAS Tactics
          </h3>
          <div className='flex flex-col gap-1.5'>
            {metrics.commonTactics.map(([tactic, n], idx) => {
              const isLast = idx === metrics.commonTactics.length - 1;
              return (
                <div
                  key={tactic}
                  className={`flex items-center justify-between ${
                    isLast ? '' : 'mb-1.5 border-b border-slate-200 pb-1.5'
                  }`}
                >
                  <span className='text-sm text-slate-800'>{tactic}</span>
                  <span className='text-sm font-semibold text-[#2563EB]'>
                    {n}
                  </span>
                </div>
              );
            })}
            {metrics.commonTactics.length === 0 && (
              <span className='text-sm text-gray-500'>No data</span>
            )}
          </div>
        </div>

        <div className='rounded-2xl bg-white p-4 shadow-sm'>
          <h3 className='mb-3 text-[16px] font-bold text-slate-800'>
            Impact Type Distribution
          </h3>
          <div className='flex flex-col gap-1.5'>
            {metrics.impactTypes.map(([it, n], idx) => {
              const isLast = idx === metrics.impactTypes.length - 1;
              return (
                <div
                  key={it}
                  className={`flex items-center justify-between ${
                    isLast ? '' : 'mb-1.5 border-b border-slate-200 pb-1.5'
                  }`}
                >
                  <span className='text-sm text-slate-800'>{it}</span>
                  <span className='text-sm font-semibold text-[#2563EB]'>
                    {n}
                  </span>
                </div>
              );
            })}
            {metrics.impactTypes.length === 0 && (
              <span className='text-sm text-gray-500'>No data</span>
            )}
          </div>
        </div>

        <div className='rounded-2xl bg-white p-4 shadow-sm'>
          <h3 className='mb-3 text-[16px] font-bold text-slate-800'>
            Controls Mapped to Multiple Scenarios
          </h3>
          <div className='flex flex-col gap-1.5'>
            {metrics.multiScenarioControls.map(([ctrl, n], idx) => {
              const isLast = idx === metrics.multiScenarioControls.length - 1;
              return (
                <div
                  key={ctrl}
                  className={`flex items-center justify-between ${
                    isLast ? '' : 'mb-1.5 border-b border-slate-200 pb-1.5'
                  }`}
                >
                  <span className='text-sm text-slate-800'>{ctrl}</span>
                  <span className='text-sm font-semibold text-[#2563EB]'>
                    {n} {n === 1 ? 'scenario' : 'scenarios'}
                  </span>
                </div>
              );
            })}
            {metrics.multiScenarioControls.length === 0 && (
              <span className='text-sm text-gray-500'>No data</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RiskRegisterVisualization;
