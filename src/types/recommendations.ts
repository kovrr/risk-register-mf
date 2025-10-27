export interface Effect {
  average_effect: number;
  max_effect: number;
}

export interface EventImpact {
  event_effect: Effect;
  event_impacts: string[];
}

export interface CISRecommendation {
  control_name: string;
  control_code: number;
  overall_effect: Effect;
  ransomware_event_impact?: EventImpact;
  data_breach_event_impact?: EventImpact;
  interruption_event_impact?: EventImpact;
  service_provider_data_breach_event_impact?: EventImpact;
  service_provider_interruption_event_impact?: EventImpact;
  current_ig?: string;
  target_ig?: string;
}
