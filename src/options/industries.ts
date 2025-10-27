import { getLabel } from './get-label';

export const INDUSTRY_LIST = [
  { value: '01', label: 'Agriculture, Forestry And Fishing' },
  { value: '10', label: 'Metal Mining' },
  { value: '12', label: 'Coal Mining' },
  { value: '13', label: 'Oil and Gas Extraction' },
  {
    value: '14',
    label: 'Mining and Quarrying of Nonmetallic Minerals, Except Fuels',
  },
  {
    value: '17',
    label: 'Construction',
  },
  { value: '20', label: 'Food and Kindred Products' },
  { value: '21', label: 'Tobacco Products' },
  { value: '22', label: 'Textile Mill Products' },
  {
    value: '23',
    label: 'Apparel, Finished Products from Fabrics & Similar Materials',
  },
  { value: '24', label: 'Lumber and Wood Products, Except Furniture' },
  { value: '25', label: 'Furniture and Fixtures' },
  { value: '26', label: 'Paper and Allied Products' },
  { value: '27', label: 'Printing, Publishing and Allied Industries' },
  { value: '28', label: 'Chemicals and Allied Products' },
  { value: '29', label: 'Petroleum Refining and Related Industries' },
  { value: '30', label: 'Rubber and Miscellaneous Plastic Products' },
  { value: '31', label: 'Leather and Leather Products' },
  { value: '32', label: 'Stone, Clay, Glass, and Concrete Products' },
  { value: '33', label: 'Primary Metal Industries' },
  { value: '34', label: 'Fabricated Metal Products' },
  {
    value: '35',
    label: 'Industrial and Commercial Machinery and Computer Equipment',
  },
  {
    value: '36',
    label: 'Electronic & Other Electrical Equipment & Components',
  },
  { value: '37', label: 'Transportation Equipment' },
  {
    value: '38',
    label: 'Measuring, Photographic, Medical, & Optical Goods, & Clocks',
  },
  { value: '39', label: 'Miscellaneous Manufacturing Industries' },
  { value: '40', label: 'Railroad Transportation' },
  {
    value: '41',
    label: 'Local & Suburban Transit & Interurban Highway Transportation',
  },
  { value: '42', label: 'Motor Freight Transportation' },
  { value: '43', label: 'United States Postal Service' },
  { value: '44', label: 'Water Transportation' },
  { value: '45', label: 'Transportation by Air' },
  { value: '46', label: 'Pipelines, Except Natural Gas' },
  { value: '47', label: 'Transportation Services' },
  { value: '48', label: 'Communications' },
  { value: '49', label: 'Electric, Gas and Sanitary Services' },
  { value: '50', label: 'Wholesale Trade - Durable Goods' },
  { value: '51', label: 'Wholesale Trade - Nondurable Goods' },
  {
    value: '52',
    label: 'Building Materials, Hardware, Garden Supplies & Mobile Homes',
  },
  { value: '53', label: 'General Merchandise Stores' },
  { value: '54', label: 'Food Stores' },
  { value: '55', label: 'Automotive Dealers and Gasoline Service Stations' },
  { value: '56', label: 'Apparel and Accessory Stores' },
  { value: '57', label: 'Home Furniture, Furnishings and Equipment Stores' },
  { value: '58', label: 'Eating and Drinking Places' },
  { value: '59', label: 'Miscellaneous Retail' },
  { value: '60', label: 'Depository Institutions' },
  { value: '61', label: 'Nondepository Credit Institutions' },
  {
    value: '62',
    label: 'Security & Commodity Brokers, Dealers, Exchanges & Services',
  },
  { value: '63', label: 'Insurance Carriers' },
  { value: '64', label: 'Insurance Agents, Brokers and Service' },
  { value: '65', label: 'Real Estate' },
  { value: '67', label: 'Holding and Other Investment Offices' },
  {
    value: '70',
    label: 'Hotels, Rooming Houses, Camps, and Other Lodging Places',
  },
  { value: '72', label: 'Personal Services' },

  { value: '73', label: 'Business Services' },
  { value: '73-10', label: 'Advertising' },
  { value: '73-20', label: 'Consumer Credit Reporting Agencies, Mercantile' },
  {
    value: '73-30',
    label:
      'Mailing, Reproduction, Commercial Art And Photography, and Stenographic Services',
  },
  { value: '73-40', label: 'Services To Dwellings And Other Buildings' },
  { value: '73-50', label: 'Miscellaneous Equipment Rental And Leasing' },
  { value: '73-60', label: 'Personnel Supply Services' },
  {
    value: '73-70',
    label:
      'Computer Programming, Data Processing, And Other Computer-Related Services',
  },
  { value: '73-80', label: 'Miscellaneous Business Services' },
  { value: '73-71', label: 'Computer Programming Services' },
  { value: '73-72', label: 'Prepackaged Software' },
  { value: '73-73', label: 'Computer Integrated Systems Design' },
  {
    value: '73-74',
    label: 'Computer Processing and Data Preparation and Processing Services',
  },

  { value: '75', label: 'Automotive Repair, Services and Parking' },
  { value: '76', label: 'Miscellaneous Repair Services' },
  { value: '78', label: 'Motion Pictures' },
  { value: '79', label: 'Amusement and Recreation Services' },

  { value: '80', label: 'Health Services' },
  { value: '80-60', label: 'Hospitals' },
  { value: '80-50', label: 'Nursing And Personal Care Facilities' },
  { value: '80-40', label: 'Offices And Clinics' },
  { value: '80-70', label: 'Medical And Dental Laboratories' },

  { value: '81', label: 'Legal Services' },
  { value: '82', label: 'Educational Services' },
  { value: '83', label: 'Social Services' },
  {
    value: '84',
    label: 'Museums, Art Galleries and Botanical and Zoological Gardens',
  },
  { value: '86', label: 'Membership Organizations' },
  {
    value: '87',
    label: 'Engineering, Accounting, Research, and Management Services',
  },
  { value: '88', label: 'Private Households' },
  { value: '89', label: 'Services, Not Elsewhere Classified' },
  {
    value: '91',
    label: 'Executive, Legislative & General Government, Except Finance',
  },
  { value: '92', label: 'Justice, Public Order and Safety' },
  { value: '93', label: 'Public Finance, Taxation and Monetary Policy' },
  { value: '94', label: 'Administration of Human Resource Programs' },
  {
    value: '95',
    label: 'Administration of Environmental Quality and Housing Programs',
  },
  { value: '96', label: 'Administration of Economic Programs' },
  { value: '97', label: 'National Security and International Affairs' },
  { value: '99', label: 'Nonclassifiable Establishments' },
];

export const getIndustryLabel = (industry_code: string) => {
  return getLabel(industry_code, INDUSTRY_LIST);
};

export const getRelevantIndustries = (industries: string[]) => {
  const removedUnknownIndustries = industries.map((industry) => {
    if (['02', '03', '04', '05', '06', '07', '08', '09'].includes(industry)) {
      return '01';
    } else if (['15', '16'].includes(industry)) {
      return '17';
    } else {
      return industry;
    }
  });
  return Array.from(new Set<string>(removedUnknownIndustries));
};
