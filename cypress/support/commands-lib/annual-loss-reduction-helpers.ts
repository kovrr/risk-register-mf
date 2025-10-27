import { MSProductBundle } from 'types/msBundles';
import { QuantificationData } from 'types/quantificationData';
import { AnnualLossReductionInput } from '_pages/ROCI/Report/Pages/ReturnOnCyberRiskAssessment/AnnualLossReduction/types';

export const getAnnualLossReductionDataForMSBundles = ({
  msBundle,
  fq,
}: {
  msBundle: MSProductBundle;
  fq: QuantificationData;
}): AnnualLossReductionInput => {
  const simulationExposure = fq?.results_narrative?.simulation_exposure;
  const controlScenario =
    fq?.results_narrative?.control_scenarios?.by_ms_bundle_to_minimal?.[
      msBundle
    ];

  return {
    simulationExposure,
    controlScenario,
  };
};
