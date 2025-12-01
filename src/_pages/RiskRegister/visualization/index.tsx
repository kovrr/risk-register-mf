import { Box, Flex, Grid, GridItem, Text, Tooltip } from '@chakra-ui/react';
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
    <Flex gap='24px' alignItems='flex-start'>
      {/* 5x5 Matrix (left) */}
      <Box>
        <Text fontSize='17px' fontWeight='700' mb='12px'>
          Risk Prioritization Matrix (5×5)
        </Text>
        <Grid templateColumns='96px repeat(5, 140px)' gap='4px'> {/* padding between cells */}
          {/* Header Row (blank + X-axis labels) */}
          <GridItem />
          {likelihoodLabels.map((lbl) => (
            <GridItem key={lbl}>
              <Box
                bg='#F8FAFC'
                color='#475569'
                height='30px'
                display='flex'
                alignItems='center'
                justifyContent='center'
                sx={{ boxSizing: 'border-box' }}
              >
                <Text
                  fontWeight='700'
                  fontSize='14px'
                  textTransform='uppercase'
                >
                  {lbl}
                </Text>
              </Box>
            </GridItem>
          ))}

          {/* Rows */}
          {impactLabels.map((impactLabel) => (
            <GridItem key={impactLabel} colSpan={6} display='contents'>
              <GridItem>
                <Box
                  bg='#F1F5F9'
                  color='#475569'
                  height='80px'
                  display='flex'
                  alignItems='center'
                  justifyContent='flex-start'
                  pl='8px'
                  sx={{ boxSizing: 'border-box' }}
                >
                  <Text
                    fontWeight='700'
                    fontSize='14px'
                    textTransform='uppercase'
                  >
                    {impactLabel}
                  </Text>
                </Box>
              </GridItem>
              {likelihoodLabels.map((likelihoodLabel) => {
                const key = `${likelihoodLabel}|${impactLabel}`;
                const cell = matrix[key];
                const ids = cell?.ids ?? [];
                const count = ids.length;
                const bg = cellColorMap[impactLabel]?.[likelihoodLabel] || '#F8FAFC';
                return (
                  <GridItem key={key}>
                    <Box
                      bg={bg}
                      height='80px'
                      position='relative'
                      padding='8px 10px'
                      sx={{ boxSizing: 'border-box' }}
                    >
                      {count > 0 && (
                        <Tooltip
                          label={ids.join(', ')}
                          bg="#1E293B"
                          color="white"
                          fontSize="12px"
                          borderRadius="8px"
                          px="10px"
                          py="6px"
                          hasArrow
                          placement="top-end"
                        >
                          <Text
                            position='absolute'
                            top='6px'
                            right='8px'
                            fontWeight='700'
                            fontSize='11px'
                            bg='#6366F1'
                            color='white'
                            borderRadius='999px'
                            px='6px'
                            py='2px'
                            cursor="pointer"
                          >
                            {count}
                          </Text>
                        </Tooltip>
                      )}
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
        <Box className='p-4 rounded-2xl bg-white shadow-sm'>
          <Text fontSize='16px' fontWeight='700' mb='12px'>
            Top AI Assets by Risk Count
          </Text>
          <Flex direction='column' gap='6px'>
            {metrics.topAssets.map(([asset, n], idx) => {
              const isLast = idx === metrics.topAssets.length - 1;
              return (
                <Flex
                  key={asset}
                  alignItems='center'
                  justifyContent='space-between'
                  pb={isLast ? 0 : '6px'}
                  mb={isLast ? 0 : '6px'}
                  borderBottom={isLast ? 'none' : '1px solid #E2E8F0'}
                >
                  <Text>{asset}</Text>
                  <Text color='#2563EB' fontWeight='600'>
                    {n} {n === 1 ? 'risk' : 'risks'}
                  </Text>
                </Flex>
              );
            })}
            {metrics.topAssets.length === 0 && (
              <Text color='gray.500'>No data</Text>
            )}
          </Flex>
        </Box>

        <Box className='p-4 rounded-2xl bg-white shadow-sm'>
          <Text fontSize='16px' fontWeight='700' mb='12px'>
            Most Common MITRE ATLAS Tactics
          </Text>
          <Flex direction='column' gap='6px'>
            {metrics.commonTactics.map(([tactic, n], idx) => {
              const isLast = idx === metrics.commonTactics.length - 1;
              return (
                <Flex
                  key={tactic}
                  alignItems='center'
                  justifyContent='space-between'
                  pb={isLast ? 0 : '6px'}
                  mb={isLast ? 0 : '6px'}
                  borderBottom={isLast ? 'none' : '1px solid #E2E8F0'}
                >
                  <Text>{tactic}</Text>
                  <Text color='#2563EB' fontWeight='600'>
                    {n}
                  </Text>
                </Flex>
              );
            })}
            {metrics.commonTactics.length === 0 && (
              <Text color='gray.500'>No data</Text>
            )}
          </Flex>
        </Box>

        <Box className='p-4 rounded-2xl bg-white shadow-sm'>
          <Text fontSize='16px' fontWeight='700' mb='12px'>
            Impact Type Distribution
          </Text>
          <Flex direction='column' gap='6px'>
            {metrics.impactTypes.map(([it, n], idx) => {
              const isLast = idx === metrics.impactTypes.length - 1;
              return (
                <Flex
                  key={it}
                  alignItems='center'
                  justifyContent='space-between'
                  pb={isLast ? 0 : '6px'}
                  mb={isLast ? 0 : '6px'}
                  borderBottom={isLast ? 'none' : '1px solid #E2E8F0'}
                >
                  <Text>{it}</Text>
                  <Text color='#2563EB' fontWeight='600'>
                    {n}
                  </Text>
                </Flex>
              );
            })}
            {metrics.impactTypes.length === 0 && (
              <Text color='gray.500'>No data</Text>
            )}
          </Flex>
        </Box>

        <Box className='p-4 rounded-2xl bg-white shadow-sm'>
          <Text fontSize='16px' fontWeight='700' mb='12px'>
            Controls Mapped to Multiple Scenarios
          </Text>
          <Flex direction='column' gap='6px'>
            {metrics.multiScenarioControls.map(([ctrl, n], idx) => {
              const isLast = idx === metrics.multiScenarioControls.length - 1;
              return (
                <Flex
                  key={ctrl}
                  alignItems='center'
                  justifyContent='space-between'
                  pb={isLast ? 0 : '6px'}
                  mb={isLast ? 0 : '6px'}
                  borderBottom={isLast ? 'none' : '1px solid #E2E8F0'}
                >
                  <Text>{ctrl}</Text>
                  <Text color='#2563EB' fontWeight='600'>
                    {n} {n === 1 ? 'scenario' : 'scenarios'}
                  </Text>
                </Flex>
              );
            })}
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
