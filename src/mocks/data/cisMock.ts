import { CISRecommendation } from '../../types/recommendations';

export const CIS_RECOMMENDATIONS_MOCK: CISRecommendation[] = [
  {
    control_name: 'data_recovery_capabilities',
    control_code: 10,
    overall_effect: { average_effect: 9830, max_effect: 12321 },
    current_ig: 'ig1',
    target_ig: 'ig1',
    ransomware_event_impact: {
      event_effect: { average_effect: 7276, max_effect: 9394 },
      event_impacts: ['bi', 'extortion'],
    },
    interruption_event_impact: {
      event_effect: { average_effect: 2170, max_effect: 2540 },
      event_impacts: ['bi'],
    },
    service_provider_interruption_event_impact: {
      event_effect: { average_effect: 384, max_effect: 387 },
      event_impacts: ['contingent_bi'],
    },
  },
  {
    control_name: 'maintenance_monitoring_and_analysis_of_audit_logs',
    control_code: 6,
    overall_effect: { average_effect: 4389, max_effect: 5666 },
    current_ig: 'unknown',
    target_ig: 'ig1',
    ransomware_event_impact: {
      event_effect: { average_effect: 4389, max_effect: 5666 },
      event_impacts: ['bi', 'extortion'],
    },
  },
  {
    control_name: 'email_and_web_browser_protections',
    control_code: 7,
    overall_effect: { average_effect: 2922, max_effect: 3794 },
    current_ig: 'unknown',
    target_ig: 'ig1',
    ransomware_event_impact: {
      event_effect: { average_effect: 2917, max_effect: 3788 },
      event_impacts: ['bi', 'extortion'],
    },
    data_breach_event_impact: {
      event_effect: { average_effect: 5, max_effect: 6 },
      event_impacts: ['privacy', 'liability', 'regulatory'],
    },
  },
  {
    control_name: 'boundary_defense',
    control_code: 12,
    overall_effect: { average_effect: 510, max_effect: 553 },
    current_ig: 'unknown',
    target_ig: 'ig1',
    interruption_event_impact: {
      event_effect: { average_effect: 218, max_effect: 258 },
      event_impacts: ['bi'],
    },
    service_provider_interruption_event_impact: {
      event_effect: { average_effect: 292, max_effect: 295 },
      event_impacts: ['contingent_bi'],
    },
  },
  {
    control_name: 'continuous_vulnerability_management',
    control_code: 3,
    overall_effect: { average_effect: 484, max_effect: 613 },
    current_ig: 'ig1',
    target_ig: 'ig2',
    ransomware_event_impact: {
      event_effect: { average_effect: 418, max_effect: 537 },
      event_impacts: ['bi', 'extortion'],
    },
    data_breach_event_impact: {
      event_effect: { average_effect: 5, max_effect: 6 },
      event_impacts: ['privacy', 'liability', 'regulatory'],
    },
    interruption_event_impact: {
      event_effect: { average_effect: 37, max_effect: 44 },
      event_impacts: ['bi'],
    },
    service_provider_interruption_event_impact: {
      event_effect: { average_effect: 17, max_effect: 17 },
      event_impacts: ['contingent_bi'],
    },
    service_provider_data_breach_event_impact: {
      event_effect: { average_effect: 7, max_effect: 9 },
      event_impacts: ['privacy', 'liability', 'regulatory'],
    },
  },
  {
    control_name: 'incident_response_and_management',
    control_code: 19,
    overall_effect: { average_effect: 292, max_effect: 295 },
    current_ig: 'unknown',
    target_ig: 'ig1',
    service_provider_interruption_event_impact: {
      event_effect: { average_effect: 292, max_effect: 295 },
      event_impacts: ['contingent_bi'],
    },
  },
  {
    control_name: 'incident_response_and_management',
    control_code: 8,
    overall_effect: { average_effect: 292, max_effect: 295 },
    current_ig: 'ig2',
    target_ig: 'ig3',
    service_provider_interruption_event_impact: {
      event_effect: { average_effect: 292, max_effect: 295 },
      event_impacts: ['contingent_bi'],
    },
  },
  {
    control_name: 'controlled_access_based_on_the_need_to_know',
    control_code: 14,
    overall_effect: { average_effect: 137, max_effect: 164 },
    current_ig: 'unknown',
    target_ig: 'ig1',
    data_breach_event_impact: {
      event_effect: { average_effect: 137, max_effect: 164 },
      event_impacts: ['privacy', 'liability', 'regulatory'],
    },
  },
  {
    control_name: 'implement_a_security_awareness_and_training_program',
    control_code: 17,
    overall_effect: { average_effect: 70, max_effect: 84 },
    current_ig: 'unknown',
    target_ig: 'ig1',
    data_breach_event_impact: {
      event_effect: { average_effect: 70, max_effect: 84 },
      event_impacts: ['privacy', 'liability', 'regulatory'],
    },
  },
  {
    control_name: 'data_protection',
    control_code: 13,
    overall_effect: { average_effect: 15, max_effect: 18 },
    current_ig: 'unknown',
    target_ig: 'ig1',
    data_breach_event_impact: {
      event_effect: { average_effect: 15, max_effect: 18 },
      event_impacts: ['privacy', 'liability', 'regulatory'],
    },
  },
  {
    control_name:
      'secure_configuration_for_hardware_and_software_on_mobile_devices_laptops_workstations_and_servers',
    control_code: 5,
    overall_effect: { average_effect: 5, max_effect: 6 },
    current_ig: 'ig2',
    target_ig: 'ig3',
    data_breach_event_impact: {
      event_effect: { average_effect: 5, max_effect: 6 },
      event_impacts: ['privacy', 'liability', 'regulatory'],
    },
  },
];
