export type IntensityParameters = {
  data_scale: IntensityParameterDetails;
  duration: IntensityParameterDetails;
  effect_rate: IntensityParameterDetails;
};

type IntensityParameterDetails = {
  max: number;
  mean: number;
  median: number;
  std: number;
  percentiles: { [key: number]: number };
};

export type ResultsInsights = {
  targeted_intensity_parameter_statistics: any;
  hazard_distribution: any;
  propagation_graph_insights: any;
  cc_average_ratio_per_coverage: {
    bi: { [k: string]: number };
    contingent_bi: { [k: string]: number };
    extortion: { [k: string]: number };
    liability: { [k: string]: number };
    privacy: { [k: string]: number };
    regulatory: { [k: string]: number };
  };
  num_events_that_caused_damage: any;
  mitre_initial_vector_distribution: any;
};
