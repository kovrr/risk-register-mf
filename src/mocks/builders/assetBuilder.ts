import type { CompanyAsset } from 'types/companyAsset';
import { chance } from './buildingUtils';

export const buildAsset = (
  overrides: Partial<CompanyAsset> = {},
): CompanyAsset => {
  return {
    id: chance.integer({ min: 10, max: 100000 }).toString(),
    name: chance.name(),
    tags: chance.pickset(
      ['tag1', 'tag2', 'tag3', 'tag4', 'tag5'],
      chance.integer({ min: 0, max: 5 }),
    ),
    criticality: chance.pickone(['high', 'medium', 'low']),
    asset_group_type: chance.pickone([
      'AssetGroupType.Cloud',
      'AssetGroupType.Infrastructure',
      'AssetGroupType.EndPoints',
    ]),
    risk_score: chance.natural({ max: 10 }),
    group_name: chance.animal(),
    operating_system: chance.pickone(['Mac', 'Windows', 'AviOS']),
    technologies: Array(chance.integer({ min: 2, max: 30 }))
      .fill(null)
      .map(
        () => chance.pickone(['cms:example:one', 'web:dugma:shtaim']), //
      ),
    //cis_score: undefined, // TODO add to backend somehow
    integration: chance.pickone([
      'microsoft_security',
      'tanium',
      'servicenow',
      'tenable',
      'bitsight',
      'qualys',
      'crowdstrike',
      'axonius',
    ]),
    ...overrides,
  };
};
