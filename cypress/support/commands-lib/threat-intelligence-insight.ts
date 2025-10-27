import { LIKELIHOOD_TO_DETAILS } from '_pages/ResultsNarrative/RiskEvaluationTab/ThreatIntelligenceInsights/insight-rows';
import {
  classifyGroupRankToLikelihood,
  TIInsight,
} from '_pages/ResultsNarrative/RiskEvaluationTab/ThreatIntelligenceInsights/insights';
import { CalibrationHighlights } from 'types/quantificationData';

export const verifyThreatIntelligenceData = (group: TIInsight) => {
  const likelihood = classifyGroupRankToLikelihood(group.group);
  const { text } = LIKELIHOOD_TO_DETAILS[likelihood];
  cy.contains(text);
  cy.contains(Number(Number(group.total_cost_millions_usd_low).toFixed(2)));
  cy.contains(Number(Number(group.total_cost_millions_usd_high).toFixed(2)));
  cy.contains(
    Number(Number(group.total_cost_millions_usd_severe_90).toFixed(2))
  );
  cy.contains(
    Number(Number(group.total_cost_millions_usd_severe_95).toFixed(2))
  );
  cy.contains(group.top_event_type);
};

export const verifyThreatIntelligenceDataWithCalibration = (
  calibrationHighlights: CalibrationHighlights,
  group: TIInsight
) => {
  // ToDo: add calibration highlights values check inside the chart
  cy.get('canvas').should('exist');
};

export const industryInsights: TIInsight[] = [
  {
    group: 'A',
    group_name: 'Agriculture, Forestry, And Fishing',
    grouping: 'industry',
    group_count: '38',
    total_cost_millions_usd_mean: '5.1',
    total_cost_millions_usd_low: '3.9',
    total_cost_millions_usd_high: '7.5',
    total_cost_millions_usd_severe_90: '12.6',
    total_cost_millions_usd_severe_95: '19.3',
    top_event_type: 'Data Breach',
  },
  {
    group: 'B',
    group_name: 'Mining',
    grouping: 'industry',
    group_count: '3',
    total_cost_millions_usd_mean: '5.1',
    total_cost_millions_usd_low: '3.9',
    total_cost_millions_usd_high: '7.5',
    total_cost_millions_usd_severe_90: '12.6',
    total_cost_millions_usd_severe_95: '19.3',
    top_event_type: 'Ransomware',
  },
  {
    group: 'C',
    group_name: 'Construction',
    grouping: 'industry',
    group_count: '12',
    total_cost_millions_usd_mean: '5.6634',
    total_cost_millions_usd_low: '0.196',
    total_cost_millions_usd_high: '14.4',
    total_cost_millions_usd_severe_90: '18.18',
    total_cost_millions_usd_severe_95: '18.6',
    top_event_type: 'Ransomware',
  },
  {
    group: 'D',
    group_name: 'Manufacturing',
    grouping: 'industry',
    group_count: '91',
    total_cost_millions_usd_mean: '17.9380357',
    total_cost_millions_usd_low: '0.28',
    total_cost_millions_usd_high: '16',
    total_cost_millions_usd_severe_90: '53.4078',
    total_cost_millions_usd_severe_95: '104',
    top_event_type: 'Data Breach',
  },
  {
    group: 'E',
    group_name:
      'Transportation, Communications, Electric, Gas, And Sanitary Services',
    grouping: 'industry',
    group_count: '98',
    total_cost_millions_usd_mean: '5.16328815',
    total_cost_millions_usd_low: '0.06',
    total_cost_millions_usd_high: '4.475',
    total_cost_millions_usd_severe_90: '13.284',
    total_cost_millions_usd_severe_95: '24.2826313',
    top_event_type: 'Data Breach',
  },
  {
    group: 'F',
    group_name: 'Wholesale Trade',
    grouping: 'industry',
    group_count: '23',
    total_cost_millions_usd_mean: '15.3874061',
    total_cost_millions_usd_low: '0.2887015',
    total_cost_millions_usd_high: '6.85',
    total_cost_millions_usd_severe_90: '18.2',
    total_cost_millions_usd_severe_95: '130.43',
    top_event_type: 'Data Breach',
  },
  {
    group: 'G',
    group_name: 'Retail Trade',
    grouping: 'industry',
    group_count: '82',
    total_cost_millions_usd_mean: '12.1077643',
    total_cost_millions_usd_low: '0.102344',
    total_cost_millions_usd_high: '5',
    total_cost_millions_usd_severe_90: '10',
    total_cost_millions_usd_severe_95: '27.595',
    top_event_type: 'Data Breach',
  },
  {
    group: 'H',
    group_name: 'Finance, Insurance, And Real Estate',
    grouping: 'industry',
    group_count: '174',
    total_cost_millions_usd_mean: '24.2167832',
    total_cost_millions_usd_low: '0.14864361',
    total_cost_millions_usd_high: '10',
    total_cost_millions_usd_severe_90: '66.005',
    total_cost_millions_usd_severe_95: '107.67795',
    top_event_type: 'Data Breach',
  },
  {
    group: 'I',
    group_name: 'Services',
    grouping: 'industry',
    group_count: '463',
    total_cost_millions_usd_mean: '34.6090147',
    total_cost_millions_usd_low: '0.06035467',
    total_cost_millions_usd_high: '3.8245',
    total_cost_millions_usd_severe_90: '29.1',
    total_cost_millions_usd_severe_95: '67.7686',
    top_event_type: 'Data Breach',
  },
  {
    group: 'J',
    group_name: 'Public Administration',
    grouping: 'industry',
    group_count: '200',
    total_cost_millions_usd_mean: '3.09026462',
    total_cost_millions_usd_low: '0.0994493',
    total_cost_millions_usd_high: '0.74066259',
    total_cost_millions_usd_severe_90: '2.684858',
    total_cost_millions_usd_severe_95: '4.24294',
    top_event_type: 'Data Breach',
  },
];

export const SizeInsights: Record<string, TIInsight> = {
  XXL: {
    group: 'XXL',
    group_name: 'Revenue above $100B',
    grouping: 'revenue',
    group_count: '121',
    total_cost_millions_usd_mean: '27.4563245',
    total_cost_millions_usd_low: '0.7',
    total_cost_millions_usd_high: '18',
    total_cost_millions_usd_severe_90: '80.54005',
    total_cost_millions_usd_severe_95: '115.509',
    top_event_type: 'Data Breach',
  },
  XL: {
    group: 'XL',
    group_name: 'Revenue between $10B and $100B',
    grouping: 'revenue',
    group_count: '121',
    total_cost_millions_usd_mean: '27.4563245',
    total_cost_millions_usd_low: '0.7',
    total_cost_millions_usd_high: '18',
    total_cost_millions_usd_severe_90: '80.54005',
    total_cost_millions_usd_severe_95: '115.509',
    top_event_type: 'Data Breach',
  },
  L: {
    group: 'L',
    group_name: 'Revenue between $2B and $10B',
    grouping: 'revenue',
    group_count: '121',
    total_cost_millions_usd_mean: '27.4563245',
    total_cost_millions_usd_low: '0.7',
    total_cost_millions_usd_high: '18',
    total_cost_millions_usd_severe_90: '80.54005',
    total_cost_millions_usd_severe_95: '115.509',
    top_event_type: 'Data Breach',
  },
  M: {
    group: 'M',
    group_name: 'Revenue between $300M and $2B',
    grouping: 'revenue',
    group_count: '99',
    total_cost_millions_usd_mean: '10.7941858',
    total_cost_millions_usd_low: '0.04561025',
    total_cost_millions_usd_high: '2.83',
    total_cost_millions_usd_severe_90: '49.1',
    total_cost_millions_usd_severe_95: '69',
    top_event_type: 'Data Breach',
  },
  S: {
    group: 'S',
    group_name: 'Revenue between $50M and $300M',
    grouping: 'revenue',
    group_count: '258',
    total_cost_millions_usd_mean: '3.25877398',
    total_cost_millions_usd_low: '0.11607725',
    total_cost_millions_usd_high: '2.1525',
    total_cost_millions_usd_severe_90: '8.2978221',
    total_cost_millions_usd_severe_95: '14.4',
    top_event_type: 'Data Breach',
  },
  XS: {
    group: 'XS',
    group_name: 'Revenue below $50M',
    grouping: 'revenue',
    group_count: '191',
    total_cost_millions_usd_mean: '5.61659611',
    total_cost_millions_usd_low: '0.05835683',
    total_cost_millions_usd_high: '2.375',
    total_cost_millions_usd_severe_90: '11',
    total_cost_millions_usd_severe_95: '40.5',
    top_event_type: 'Data Breach',
  },
};
