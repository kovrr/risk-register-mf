import { toChicagoTitleCase } from 'helpers/string';
import { MSProductBundle } from 'types/msBundles';
import { QuantificationData } from 'types/quantificationData';
import { EVENT_TYPE_TO_TEXT } from 'types/riskDrivers/eventTypes';
import {
  EventTypesToUse,
  eventTypesToUse,
  InitialVectorsToUse,
  initialVectorsToUse,
  Reduction,
} from '_pages/ROCI/Report/Pages/ReturnOnCyberRiskAssessment/RiskScenariosReduction/hooks/types';

export const getRiskReductionData = (
  fq: QuantificationData,
  msBundle: MSProductBundle
): Reduction => {
  const eventTypeReductionData = Object.fromEntries(
    Object.entries(fq?.results_narrative?.by_event_type_detailed_exposure || {})
      .filter(([key]) => eventTypesToUse.includes(key as EventTypesToUse))
      .map(([eventType, exposure]) => [
        eventType,
        {
          title: EVENT_TYPE_TO_TEXT[eventType as EventTypesToUse],
          currentRisk: {
            aal: exposure.simulation_exposure.aal,
            highExposureLoss: exposure.simulation_exposure.high_exposure_loss,
          },
          withBundle: {
            aal: exposure.by_ms_bundle_to_minimal?.[msBundle]?.aal_damage,
            aalEffect: exposure.by_ms_bundle_to_minimal?.[msBundle]?.aal_effect,
            highExposureLoss:
              exposure.by_ms_bundle_to_minimal?.[msBundle]?.pml_damage,
            highExposureLossEffect:
              exposure.by_ms_bundle_to_minimal?.[msBundle]?.pml_effect,
          },
        },
      ])
  );

  const initialVectorReductionData = Object.fromEntries(
    Object.entries(
      fq?.results_narrative?.by_initial_vector_detailed_exposure || {}
    )
      .filter(([key]) =>
        initialVectorsToUse.includes(key as InitialVectorsToUse)
      )
      .map(([initialVector, exposure]) => [
        initialVector,
        {
          title: toChicagoTitleCase(initialVector),
          currentRisk: {
            aal: exposure.simulation_exposure.aal,
            highExposureLoss: exposure.simulation_exposure.high_exposure_loss,
          },
          withBundle: {
            aal: exposure.by_ms_bundle_to_minimal?.[msBundle]?.aal_damage,
            aalEffect: exposure.by_ms_bundle_to_minimal?.[msBundle]?.aal_effect,
            highExposureLoss:
              exposure.by_ms_bundle_to_minimal?.[msBundle]?.pml_damage,
            highExposureLossEffect:
              exposure.by_ms_bundle_to_minimal?.[msBundle]?.pml_effect,
          },
        },
      ])
  );
  return { eventTypeReductionData, initialVectorReductionData } as Reduction;
};
