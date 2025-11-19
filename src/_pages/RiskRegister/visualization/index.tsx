import { Badge, Box, Flex, Grid, GridItem, Text } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useRiskScenarios } from '@/services/hooks';
import { type RiskRegisterImpact } from '@/types/riskRegister';

const likelihoodLabels = ['Expected', 'Possible', 'Unlikely', 'Rare', 'Very Rare'];
const impactLabels = ['Severe', 'Significant', 'Moderate', 'Minor', 'Negligible'];

const impactBgMap: Record<string, string> = {
  Severe: 'bg-viz-impact-tags-severe',
  Significant: 'bg-viz-impact-tags-significant',
  Moderate: 'bg-viz-impact-tags-moderate',
  Minor: 'bg-viz-impact-tags-minor',
  Negligible: 'bg-viz-impact-tags-negligible',
};

function RiskRegisterVisualization() {
  // Fetch a large page to aggregate. If backend provides viz endpoints later, we can swap.
  const { data } = useRiskScenarios({
    page: 1,
    size: 250,
  });

  const items = data?.items ?? [];

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
    <Flex gap='24px' alignItems='flex-start'>
      {/* 5x5 Matrix (left) */}
      <Box>
        <Text fontSize='17px' fontWeight='700' mb='12px'>
          Risk Prioritization Matrix (5×5)
        </Text>
        <Grid templateColumns='80px repeat(5, 120px)' gap='8px'>
          {/* Header Row (blank + X-axis labels) */}
          <GridItem />
          {likelihoodLabels.map((lbl) => (
            <GridItem key={lbl}>
              <Text fontWeight='700' fontSize='14px'>
                {lbl}
              </Text>
            </GridItem>
          ))}

          {/* Rows */}
          {impactLabels.map((impactLabel) => (
            <GridItem key={impactLabel} colSpan={6} display='contents'>
              <GridItem alignSelf='center'>
                <Text fontWeight='700' fontSize='14px'>
                  {impactLabel}
                </Text>
              </GridItem>
              {likelihoodLabels.map((likelihoodLabel) => {
                const key = `${likelihoodLabel}|${impactLabel}`;
                const cell = matrix[key];
                const count = cell?.ids.length ?? 0;
                const bg =
                  impactBgMap[impactLabel] || 'bg-fill-specific-secondary-02';
                return (
                  <GridItem key={key}>
                    <Box
                      className={`${bg}`}
                      borderRadius='6px'
                      height='72px'
                      position='relative'
                    >
                      {count > 0 ? (
                        <Text
                          position='absolute'
                          top='6px'
                          left='8px'
                          fontWeight='700'
                          fontSize='12px'
                        >
                          {count}
                        </Text>
                      ) : null}
                    </Box>
                  </GridItem>
                );
              })}
            </GridItem>
          ))}
        </Grid>
      </Box>

      {/* Metrics sidebar (right) */}
      <Flex direction='column' gap='16px' minW='360px' flex='1'>
        <Box className='p-4 rounded-md bg-background'>
          <Text fontSize='16px' fontWeight='700' mb='8px'>
            Top AI Assets by Risk Count
          </Text>
          <Flex direction='column' gap='6px'>
            {metrics.topAssets.map(([asset, n]) => (
              <Flex key={asset} alignItems='center' justifyContent='space-between'>
                <Text>{asset}</Text>
                <Badge>{n}</Badge>
              </Flex>
            ))}
            {metrics.topAssets.length === 0 && (
              <Text color='gray.500'>No data</Text>
            )}
          </Flex>
        </Box>

        <Box className='p-4 rounded-md bg-background'>
          <Text fontSize='16px' fontWeight='700' mb='8px'>
            Most Common MITRE ATLAS Tactics
          </Text>
          <Flex direction='column' gap='6px'>
            {metrics.commonTactics.map(([tactic, n]) => (
              <Flex
                key={tactic}
                alignItems='center'
                justifyContent='space-between'
              >
                <Text>{tactic}</Text>
                <Badge>{n}</Badge>
              </Flex>
            ))}
            {metrics.commonTactics.length === 0 && (
              <Text color='gray.500'>No data</Text>
            )}
          </Flex>
        </Box>

        <Box className='p-4 rounded-md bg-background'>
          <Text fontSize='16px' fontWeight='700' mb='8px'>
            Impact Type Distribution
          </Text>
          <Flex direction='column' gap='6px'>
            {metrics.impactTypes.map(([it, n]) => (
              <Flex key={it} alignItems='center' justifyContent='space-between'>
                <Text>{it}</Text>
                <Badge>{n}</Badge>
              </Flex>
            ))}
            {metrics.impactTypes.length === 0 && (
              <Text color='gray.500'>No data</Text>
            )}
          </Flex>
        </Box>

        <Box className='p-4 rounded-md bg-background'>
          <Text fontSize='16px' fontWeight='700' mb='8px'>
            Controls Mapped to Multiple Scenarios
          </Text>
          <Flex direction='column' gap='6px'>
            {metrics.multiScenarioControls.map(([ctrl, n]) => (
              <Flex key={ctrl} alignItems='center' justifyContent='space-between'>
                <Text>{ctrl}</Text>
                <Badge>{n}</Badge>
              </Flex>
            ))}
            {metrics.multiScenarioControls.length === 0 && (
              <Text color='gray.500'>No data</Text>
            )}
          </Flex>
        </Box>
      </Flex>
    </Flex>
  );
}

export default RiskRegisterVisualization;


