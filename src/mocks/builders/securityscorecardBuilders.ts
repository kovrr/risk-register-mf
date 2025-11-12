// @ts-nocheck
import type {
  SecurityScorecardApiResponse,
  SecurityScorecardCompany,
  SecurityScorecardGrade,
  SecurityScorecardPortfolio,
} from '@/services/securityscorecardHooks';
import { chance } from '../../mocks/builders/buildingUtils';

export const buildSecurityScorecardPortfolios = (
  overrides?: Partial<SecurityScorecardPortfolio>,
): SecurityScorecardPortfolio => {
  return {
    id: chance.guid(),
    name: chance.word(),
    created_at: chance.date().toISOString(),
    description: chance.sentence(),
    is_public: chance.bool(),
    privacy: chance.pickone(['shared', 'private']),
    read_only: chance.bool(),
    ...overrides,
  };
};

const getScoreGrade = (score: number): SecurityScorecardGrade => {
  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  if (score >= 70) return 'C';
  if (score > 60) return 'D';
  return 'F';
};

export const buildSecurityScorecardCompany = (
  overrides?: Partial<SecurityScorecardCompany>,
): SecurityScorecardCompany => {
  const products = Array.from({
    length: chance.integer({ min: 1, max: 5 }),
  }).map(() => chance.word());
  const { score, score_v3, ...restOverrides } = overrides || {
    score: chance.integer({ min: 0, max: 100 }),
    score_v3: chance.integer({ min: 0, max: 100 }),
  };
  const diff_score_v3 = score_v3! - score!;
  return {
    uuid: chance.guid(),
    domain: chance.domain(),
    name: chance.word(),
    score,
    score_v3,
    added_date: chance.date().toISOString(),
    grade: getScoreGrade(score!),
    grade_url: chance.url(),
    last30days_score_change: chance.floating(),
    diff_score_v3,
    industry: chance.pickone([
      'manufacturing',
      'energy',
      'construction',
      'transportation',
      'technology',
      'information_services',
      'financial_services',
    ]),
    size: chance.pickone([
      'size_1_to_10',
      'size_11_to_50',
      'size_51_to_200',
      'size_201_to_500',
      'size_501_to_1000',
      'size_1001_to_5000',
      'size_5001_to_10000',
      'size_more_than_10000',
    ]),
    is_custom_vendor: chance.bool(),
    is_unpublished: chance.bool(),
    base: Array.from({ length: chance.integer({ min: 1, max: 5 }) }).map(() =>
      chance.word(),
    ),
    products,
    products_count: products.length,
    ...restOverrides,
  };
};

export const buildSecurityScorecardPortfoliosApiResponse = (
  total = 5,
): SecurityScorecardApiResponse<SecurityScorecardPortfolio> => {
  const portfolios = Array.from({ length: total }).map(() =>
    buildSecurityScorecardPortfolios(),
  );
  return {
    total,
    entries: portfolios,
  };
};

export const buildSecurityScorecardCompanyApiResponse = (
  total = 5,
): SecurityScorecardApiResponse<SecurityScorecardCompany> => {
  const companies = Array.from({ length: total }).map(() =>
    buildSecurityScorecardCompany(),
  );
  return {
    total,
    entries: companies,
  };
};
