import {
  useCurrentQuantification
} from './hooks';

export type SecurityScorecardApiKeyBody = {
  api_key: string;
};

export type SecurityScorecardGrade = 'A' | 'B' | 'C' | 'D' | 'F' | '?';
type SecurityScorecardCompanySize =
  | 'unknown'
  | 'size_1_to_10'
  | 'size_11_to_50'
  | 'size_51_to_200'
  | 'size_201_to_500'
  | 'size_501_to_1000'
  | 'size_1001_to_5000'
  | 'size_5001_to_10000'
  | 'size_more_than_10000';

type SecurityScorecardIndustry =
  | 'manufacturing'
  | 'energy'
  | 'construction'
  | 'transportation'
  | 'technology'
  | 'information_services'
  | 'financial_services'
  | 'healthcare'
  | 'retail'
  | 'education'
  | 'entertainment'
  | 'food'
  | 'government'
  | 'hospitality'
  | 'non_profit'
  | 'legal'
  | 'pharmaceutical';

export type SecurityScorecardPortfolio = {
  id: string;
  name?: string;
  description?: string;
  privacy?: 'team' | 'private' | 'shared';
  read_only?: boolean;
  created_at?: string;
  is_public?: boolean;
};

export type SecurityScorecardCompany = {
  uuid: string;
  domain?: string;
  name?: string;
  score?: number;
  score_v3?: number;
  added_date?: string;
  grade?: SecurityScorecardGrade;
  grade_url?: string;
  last30days_score_change?: number;
  diff_score_v3?: number;
  industry?: SecurityScorecardIndustry;
  size?: SecurityScorecardCompanySize;
  is_custom_vendor?: boolean;
  is_unpublished?: boolean;
  base?: string[];
  products?: string[];
  products_count?: number;
};

export type SecurityScorecardData = {
  data: SecurityScorecardCompany;
};

export type SecurityScorecardApiResponse<T> = {
  total: number;
  entries: T[];
};

export const SECURITY_SCORECARD_PORTFOLIOS_QUERY_KEY = [
  'securityscorecard',
  'portfolios',
];

export const SECURITY_SCORECARD_PORTFOLIO_COMPANIES_QUERY_KEY = [
  ...SECURITY_SCORECARD_PORTFOLIOS_QUERY_KEY,
  'companies',
];

const getScoreGrade = (score: number): SecurityScorecardGrade => {
  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  if (score >= 70) return 'C';
  if (score > 60) return 'D';
  return 'F';
};

type SecurityScorecardCardData = {
  isLoading: boolean;
  score: number;
  grade: SecurityScorecardGrade;
};
export const useSecurityScorecardData = ():
  | SecurityScorecardCardData
  | undefined => {
  const { data: quantification, isLoading } = useCurrentQuantification();
  const score =
    quantification?.input_data?.vendor_data?.security_scores
      ?.security_scorecard_security_rating;

  if (score === undefined || score === null) return undefined;

  return {
    isLoading,
    score,
    grade: getScoreGrade(score),
  };
};
