import { ENISTControl } from 'types/quantificationForm';

interface NISTv2Subcategories {
  [key: string]: string;
}

export enum ScaleEnum {
  ONE_TO_FIVE = "1_5",
  ZERO_TO_FOUR = "0_4",
  CMMI = "CMMI",
}

interface NISTv2Details {
  function: string;
  title: string;
  desc: string;
  abbr: string;
  subcategories: NISTv2Subcategories;
}

export interface NISTv2DetailsMap {
  [key: string]: NISTv2Details;
}

export const MAX_NIST_V2_GRADE = 1;

export const NistV2NameToCode: { [key: string]: number } = {
  DE_AE: 1,
  DE_CM: 2,
  GV_OC: 3,
  GV_OV: 4,
  GV_PO: 5,
  GV_RM: 6,
  GV_RR: 7,
  GV_SC: 8,
  ID_AM: 9,
  ID_IM: 10,
  ID_RA: 11,
  PR_AA: 12,
  PR_AT: 13,
  PR_DS: 14,
  PR_IR: 15,
  PR_PS: 16,
  RC_CO: 17,
  RC_RP: 18,
  RS_AN: 19,
  RS_CO: 20,
  RS_MA: 21,
  RS_MI: 22,
};

export const CONTROL_CODE_MAP_DESC = {
  'DE_AE': {
    function: 'Detect',
    title: 'Adverse Event Analysis',
    desc: 'Anomalies, indicators of compromise, and other potentially adverse events are analyzed to characterize the events and detect cybersecurity incidents.',
    abbr: 'DE_AE',
    subcategories: {
      'DE_AE-02': 'Potentially adverse events are analyzed to better understand associated activities',
      'DE_AE-03': 'Information is correlated from multiple sources',
      'DE_AE-04': 'The estimated impact and scope of adverse events are understood',
      'DE_AE-06': 'Information on adverse events is provided to authorized staff and tools',
      'DE_AE-07': 'Cyber threat intelligence and other contextual information are integrated into the analysis',
      'DE_AE-08': 'Incidents are declared when adverse events meet the defined incident criteria',
    },
  },
  'DE_CM': {
    function: 'Detect',
    title: 'Continuous Monitoring',
    desc: 'Assets are monitored to find anomalies, indicators of compromise, and other potentially adverse events.',
    abbr: 'DE_CM',
    subcategories: {
      'DE_CM-01': 'Networks and network services are monitored to find potentially adverse events',
      'DE_CM-02': 'The physical environment is monitored to find potentially adverse events',
      'DE_CM-03': 'Personnel activity and technology usage are monitored to find potentially adverse events',
      'DE_CM-06': 'External service provider activities and services are monitored to find potentially adverse events',
      'DE_CM-09': 'Computing hardware and software, runtime environments, and their data are monitored to find potentially adverse events',
    },
  },
  'GV_OC': {
    function: 'Govern',
    title: 'Organizational Context',
    desc: 'The circumstances — mission, stakeholder expectations, dependencies, and legal, regulatory, and contractual requirements — surrounding the organization\'s cybersecurity risk management decisions are understood.',
    abbr: 'GV_OC',
    subcategories: {
      'GV_OC-01': 'The organizational mission is understood and informs cybersecurity risk management',
      'GV_OC-02': 'Internal and external stakeholders are understood, and their needs and expectations regarding cybersecurity risk management are understood and considered',
      'GV_OC-03': 'Legal, regulatory, and contractual requirements regarding cybersecurity — including privacy and civil liberties obligations — are understood and managed',
      'GV_OC-04': 'Critical objectives, capabilities, and services that external stakeholders depend on or expect from the organization are understood and communicated',
      'GV_OC-05': 'Outcomes, capabilities, and services that the organization depends on are understood and communicated',
    },
  },
  'GV_OV': {
    function: 'Govern',
    title: 'Oversight',
    desc: 'Results of organization-wide cybersecurity risk management activities and performance are used to inform, improve, and adjust the risk management strategy.',
    abbr: 'GV_OV',
    subcategories: {
      'GV_OV-01': 'Cybersecurity risk management strategy outcomes are reviewed to inform and adjust strategy and direction',
      'GV_OV-02': 'The cybersecurity risk management strategy is reviewed and adjusted to ensure coverage of organizational requirements and risks',
      'GV_OV-03': 'Organizational cybersecurity risk management performance is evaluated and reviewed for adjustments needed',
    },
  },
  'GV_PO': {
    function: 'Govern',
    title: 'Policy',
    desc: 'Organizational cybersecurity policy is established, communicated, and enforced.',
    abbr: 'GV_PO',
    subcategories: {
      'GV_PO-01': 'Policy for managing cybersecurity risks is established based on organizational context, cybersecurity strategy, and priorities and is communicated and enforced',
      'GV_PO-02': 'Policy for managing cybersecurity risks is reviewed, updated, communicated, and enforced to reflect changes in requirements, threats, technology, and organizational mission',
    },
  },
  'GV_RM': {
    function: 'Govern',
    title: 'Risk Management Strategy',
    desc: 'The organization\'s priorities, constraints, risk tolerance and appetite statements, and assumptions are established, communicated, and used to support operational risk decisions.',
    abbr: 'GV_RM',
    subcategories: {
      'GV_RM-01': 'Risk management objectives are established and agreed to by organizational stakeholders',
      'GV_RM-02': 'Risk appetite and risk tolerance statements are established, communicated, and maintained',
      'GV_RM-03': 'Cybersecurity risk management activities and outcomes are included in enterprise risk management processes',
      'GV_RM-04': 'Strategic direction that describes appropriate risk response options is established and communicated',
      'GV_RM-05': 'Lines of communication across the organization are established for cybersecurity risks, including risks from suppliers and other third parties',
      'GV_RM-06': 'A standardized method for calculating, documenting, categorizing, and prioritizing cybersecurity risks is established and communicated',
      'GV_RM-07': 'Strategic opportunities (i.e., positive risks) are characterized and are included in organizational cybersecurity risk discussions',
    },
  },
  'GV_RR': {
    function: 'Govern',
    title: 'Roles, Responsibilities, and Authorities',
    desc: 'Cybersecurity roles, responsibilities, and authorities to foster accountability, performance assessment, and continuous improvement are established and communicated.',
    abbr: 'GV_RR',
    subcategories: {
      'GV_RR-01': 'Organizational leadership is responsible and accountable for cybersecurity risk and fosters a culture that is risk-aware, ethical, and continually improving',
      'GV_RR-02': 'Roles, responsibilities, and authorities related to cybersecurity risk management are established, communicated, understood, and enforced',
      'GV_RR-03': 'Adequate resources are allocated commensurate with the cybersecurity risk strategy, roles, responsibilities, and policies',
      'GV_RR-04': 'Cybersecurity is included in human resources practices',
    },
  },
  'GV_SC': {
    function: 'Govern',
    title: 'Cybersecurity Supply Chain Risk Management',
    desc: 'Cyber supply chain risk management processes are identified, established, managed, monitored, and improved by organizational stakeholders.',
    abbr: 'GV_SC',
    subcategories: {
      'GV_SC-01': 'A cybersecurity supply chain risk management program, strategy, objectives, policies, and processes are established and agreed to by organizational stakeholders',
      'GV_SC-02': 'Cybersecurity roles and responsibilities for suppliers, customers, and partners are established, communicated, and coordinated internally and externally',
      'GV_SC-03': 'Cybersecurity supply chain risk management is integrated into cybersecurity and enterprise risk management, risk assessment, and improvement processes',
      'GV_SC-04': 'Suppliers are known and prioritized by criticality',
      'GV_SC-05': 'Requirements to address cybersecurity risks in supply chains are established, prioritized, and integrated into contracts and other types of agreements with suppliers and other relevant third parties',
      'GV_SC-06': 'Planning and due diligence are performed to reduce risks before entering into formal supplier or other third-party relationships',
      'GV_SC-07': 'The risks posed by a supplier, their products and services, and other third parties are understood, recorded, prioritized, assessed, responded to, and monitored over the course of the relationship',
      'GV_SC-08': 'Relevant suppliers and other third parties are included in incident planning, response, and recovery activities',
      'GV_SC-09': 'Supply chain security practices are integrated into cybersecurity and enterprise risk management programs, and their performance is monitored throughout the technology product and service life cycle',
      'GV_SC-10': 'Cybersecurity supply chain risk management plans include provisions for activities that occur after the conclusion of a partnership or service agreement',
    },
  },
  'ID_AM': {
    function: 'Identify',
    title: 'Asset Management',
    desc: 'Assets (e.g., data, hardware, software, systems, facilities, services, people) that enable the organization to achieve business purposes are identified and managed consistent with their relative importance to organizational objectives and the organization\'s risk strategy.',
    abbr: 'ID_AM',
    subcategories: {
      'ID_AM-01': 'Inventories of hardware managed by the organization are maintained',
      'ID_AM-02': 'Inventories of software, services, and systems managed by the organization are maintained',
      'ID_AM-03': 'Representations of the organization\'s authorized network communication and internal and external network data flows are maintained',
      'ID_AM-04': 'Inventories of services provided by suppliers are maintained',
      'ID_AM-05': 'Assets are prioritized based on classification, criticality, resources, and impact on the mission',
      'ID_AM-07': 'Inventories of data and corresponding metadata for designated data types are maintained',
      'ID_AM-08': 'Systems, hardware, software, services, and data are managed throughout their life cycles',
    },
  },
  'ID_IM': {
    function: 'Identify',
    title: 'Improvement',
    desc: 'Improvements to organizational cybersecurity risk management processes, procedures and activities are identified across all CSF Functions.',
    abbr: 'ID_IM',
    subcategories: {
      'ID_IM-01': 'Improvements are identified from evaluations',
      'ID_IM-02': 'Improvements are identified from security tests and exercises, including those done in coordination with suppliers and relevant third parties',
      'ID_IM-03': 'Improvements are identified from execution of operational processes, procedures, and activities',
      'ID_IM-04': 'Incident response plans and other cybersecurity plans that affect operations are established, communicated, maintained, and improved',
    },
  },
  'ID_RA': {
    function: 'Identify',
    title: 'Risk Assessment',
    desc: 'The cybersecurity risk to the organization, assets, and individuals is understood by the organization.',
    abbr: 'ID_RA',
    subcategories: {
      'ID_RA-01': 'Vulnerabilities in assets are identified, validated, and recorded',
      'ID_RA-02': 'Cyber threat intelligence is received from information sharing forums and sources',
      'ID_RA-03': 'Internal and external threats to the organization are identified and recorded',
      'ID_RA-04': 'Potential impacts and likelihoods of threats exploiting vulnerabilities are identified and recorded',
      'ID_RA-05': 'Threats, vulnerabilities, likelihoods, and impacts are used to understand inherent risk and inform risk response prioritization',
      'ID_RA-06': 'Risk responses are chosen, prioritized, planned, tracked, and communicated',
      'ID_RA-07': 'Changes and exceptions are managed, assessed for risk impact, recorded, and tracked',
      'ID_RA-08': 'Processes for receiving, analyzing, and responding to vulnerability disclosures are established',
      'ID_RA-09': 'The authenticity and integrity of hardware and software are assessed prior to acquisition and use',
      'ID_RA-10': 'Critical suppliers are assessed prior to acquisition',
    },
  },
  'PR_AA': {
    function: 'Protect',
    title: 'Identity Management, Authentication, and Access Control',
    desc: 'Access to physical and logical assets is limited to authorized users, services, and hardware and managed commensurate with the assessed risk of unauthorized access.',
    abbr: 'PR_AA',
    subcategories: {
      'PR_AA-01': 'Identities and credentials for authorized users, services, and hardware are managed by the organization',
      'PR_AA-02': 'Identities are proofed and bound to credentials based on the context of interactions',
      'PR_AA-03': 'Users, services, and hardware are authenticated',
      'PR_AA-04': 'Identity assertions are protected, conveyed, and verified',
      'PR_AA-05': 'Access permissions, entitlements, and authorizations are defined in a policy, managed, enforced, and reviewed, and incorporate the principles of least privilege and separation of duties',
      'PR_AA-06': 'Physical access to assets is managed, monitored, and enforced commensurate with risk',
    },
  },
  'PR_AT': {
    function: 'Protect',
    title: 'Awareness and Training',
    desc: 'The organization\'s personnel are provided with cybersecurity awareness and training so that they can perform their cybersecurity-related tasks.',
    abbr: 'PR_AT',
    subcategories: {
      'PR_AT-01': 'Personnel are provided with awareness and training so that they possess the knowledge and skills to perform general tasks with cybersecurity risks in mind',
      'PR_AT-02': 'Individuals in specialized roles are provided with awareness and training so that they possess the knowledge and skills to perform relevant tasks with cybersecurity risks in mind',
    },
  },
  'PR_DS': {
    function: 'Protect',
    title: 'Data Security',
    desc: 'Data are managed consistent with the organization\'s risk strategy to protect the confidentiality, integrity, and availability of information.',
    abbr: 'PR_DS',
    subcategories: {
      'PR_DS-01': 'The confidentiality, integrity, and availability of data-at-rest are protected',
      'PR_DS-02': 'The confidentiality, integrity, and availability of data-in-transit are protected',
      'PR_DS-10': 'The confidentiality, integrity, and availability of data-in-use are protected',
      'PR_DS-11': 'Backups of data are created, protected, maintained, and tested',
    },
  },
  'PR_IR': {
    function: 'Protect',
    title: 'Technology Infrastructure Resilience',
    desc: 'Security architectures are managed with the organization\'s risk strategy to protect asset confidentiality, integrity, and availability, and organizational resilience.',
    abbr: 'PR_IR',
    subcategories: {
      'PR_IR-01': 'Networks and environments are protected from unauthorized logical access and usage',
      'PR_IR-02': 'The organization\'s technology assets are protected from environmental threats',
      'PR_IR-03': 'Mechanisms are implemented to achieve resilience requirements in normal and adverse situations',
      'PR_IR-04': 'Adequate resource capacity to ensure availability is maintained',
    },
  },
  'PR_PS': {
    function: 'Protect',
    title: 'Platform Security',
    desc: 'The hardware, software (e.g., firmware, operating systems, applications), and services of physical and virtual platforms are managed consistent with the organization\'s risk strategy to protect their confidentiality, integrity, and availability.',
    abbr: 'PR_PS',
    subcategories: {
      'PR_PS-01': 'Configuration management practices are established and applied',
      'PR_PS-02': 'Software is maintained, replaced, and removed commensurate with risk',
      'PR_PS-03': 'Hardware is maintained, replaced, and removed commensurate with risk',
      'PR_PS-04': 'Log records are generated and made available for continuous monitoring',
      'PR_PS-05': 'Installation and execution of unauthorized software are prevented',
      'PR_PS-06': 'Secure software development practices are integrated, and their performance is monitored throughout the software development life cycle',
    },
  },
  'RC_CO': {
    function: 'Recover',
    title: 'Incident Recovery Communication',
    desc: 'Restoration activities are coordinated with internal and external parties.',
    abbr: 'RC_CO',
    subcategories: {
      'RC_CO-03': 'Recovery activities and progress in restoring operational capabilities are communicated to designated internal and external stakeholders',
      'RC_CO-04': 'Public updates on incident recovery are shared using approved methods and messaging',
    },
  },
  'RC_RP': {
    function: 'Recover',
    title: 'Incident Recovery Plan Execution',
    desc: 'Restoration activities are performed to ensure operational availability of systems and services affected by cybersecurity incidents.',
    abbr: 'RC_RP',
    subcategories: {
      'RC_RP-01': 'The recovery portion of the incident response plan is executed once initiated from the incident response process',
      'RC_RP-02': 'Recovery actions are selected, scoped, prioritized, and performed',
      'RC_RP-03': 'The integrity of backups and other restoration assets is verified before using them for restoration',
      'RC_RP-04': 'Critical mission functions and cybersecurity risk management are considered to establish post-incident operational norms',
      'RC_RP-05': 'The integrity of restored assets is verified, systems and services are restored, and normal operating status is confirmed',
      'RC_RP-06': 'The end of incident recovery is declared based on criteria, and incident-related documentation is completed',
    },
  },
  'RS_AN': {
    function: 'Respond',
    title: 'Incident Analysis',
    desc: 'Investigations are conducted to ensure effective response and support forensics and recovery activities.',
    abbr: 'RS_AN',
    subcategories: {
      'RS_AN-03': 'Analysis is performed to establish what has taken place during an incident and the root cause of the incident',
      'RS_AN-06': 'Actions performed during an investigation are recorded, and the records\' integrity and provenance are preserved',
      'RS_AN-07': 'Incident data and metadata are collected, and their integrity and provenance are preserved',
      'RS_AN-08': 'An incident\'s magnitude is estimated and validated',
    },
  },
  'RS_CO': {
    function: 'Respond',
    title: 'Incident Response Reporting and Communication',
    desc: 'Response activities are coordinated with internal and external stakeholders as required by laws, regulations, or policies.',
    abbr: 'RS_CO',
    subcategories: {
      'RS_CO-02': 'Internal and external stakeholders are notified of incidents',
      'RS_CO-03': 'Information is shared with designated internal and external stakeholders',
    },
  },
  'RS_MA': {
    function: 'Respond',
    title: 'Incident Management',
    desc: 'Responses to detected cybersecurity incidents are managed.',
    abbr: 'RS_MA',
    subcategories: {
      'RS_MA-01': 'The incident response plan is executed in coordination with relevant third parties once an incident is declared',
      'RS_MA-02': 'Incident reports are triaged and validated',
      'RS_MA-03': 'Incidents are categorized and prioritized',
      'RS_MA-04': 'Incidents are escalated or elevated as needed',
      'RS_MA-05': 'The criteria for initiating incident recovery are applied',
    },
  },
  'RS_MI': {
    function: 'Respond',
    title: 'Incident Mitigation',
    desc: 'Activities are performed to prevent expansion of an event and mitigate its effects.',
    abbr: 'RS_MI',
    subcategories: {
      'RS_MI-01': 'Incidents are contained',
      'RS_MI-02': 'Incidents are eradicated',
    },
  },
} as const;

export type NistV2Code = keyof typeof CONTROL_CODE_MAP_DESC;

export const NIST_V2_TO_CATEGORY_CODE = Object.fromEntries(
  Object.values(CONTROL_CODE_MAP_DESC).map((control) => [
    control.abbr,
    control.abbr.split('_')[0],
  ])
);

export const nistV2Categories = ['DE', 'GV', 'ID', 'PR', 'RC', 'RS'] as const;

export const DETECT_CONTROLS = Object.values(CONTROL_CODE_MAP_DESC).filter(item => item.function === "Detect").map(item => item.abbr);
export const GOVERN_CONTROLS = Object.values(CONTROL_CODE_MAP_DESC).filter(item => item.function === "Govern").map(item => item.abbr);
export const IDENTIFY_CONTROLS = Object.values(CONTROL_CODE_MAP_DESC).filter(item => item.function === "Identify").map(item => item.abbr);
export const PROTECT_CONTROLS = Object.values(CONTROL_CODE_MAP_DESC).filter(item => item.function === "Protect").map(item => item.abbr);
export const RECOVER_CONTROLS = Object.values(CONTROL_CODE_MAP_DESC).filter(item => item.function === "Recover").map(item => item.abbr);
export const RESPOND_CONTROLS = Object.values(CONTROL_CODE_MAP_DESC).filter(item => item.function === "Respond").map(item => item.abbr);

export type NistV2Category = (typeof nistV2Categories)[number];
export const isNistV2Category = (c: any): c is NistV2Category =>
  nistV2Categories.includes(c);

export const NIST_V2_RANGE_MINIMUM = [1, 5];

export const BATTERY_OPTIONS = [
  {
    label: 'Initial',
    value: '0',
    backgroundColor: 'brand.recommendedAction.initial',
  },
  {
    label: 'Repeatable',
    value: '0.16',
    backgroundColor: 'brand.recommendedAction.repeatable',
  },
  {
    label: 'Defined',
    value: '0.41',
    backgroundColor: 'brand.recommendedAction.defined',
  },
  {
    label: 'Managed',
    value: '0.75',
    backgroundColor: 'brand.recommendedAction.managed',
  },
  {
    label: 'Optimized',
    value: '1',
    backgroundColor: 'brand.recommendedAction.optimized',
  },
];

// NIST v2 Safeguards by Group
export const NistV2SafeguardsByGroup = {
  'DE_AE': ['DE_AE-02', 'DE_AE-03', 'DE_AE-04', 'DE_AE-06', 'DE_AE-07', 'DE_AE-08'],
  'DE_CM': ['DE_CM-01', 'DE_CM-02', 'DE_CM-03', 'DE_CM-06', 'DE_CM-09'],
  'GV_OC': ['GV_OC-01', 'GV_OC-02', 'GV_OC-03', 'GV_OC-04', 'GV_OC-05'],
  'GV_OV': ['GV_OV-01', 'GV_OV-02', 'GV_OV-03'],
  'GV_PO': ['GV_PO-01', 'GV_PO-02'],
  'GV_RM': ['GV_RM-01', 'GV_RM-02', 'GV_RM-03', 'GV_RM-04', 'GV_RM-05', 'GV_RM-06', 'GV_RM-07'],
  'GV_RR': ['GV_RR-01', 'GV_RR-02', 'GV_RR-03', 'GV_RR-04'],
  'GV_SC': ['GV_SC-01', 'GV_SC-02', 'GV_SC-03', 'GV_SC-04', 'GV_SC-05', 'GV_SC-06', 'GV_SC-07', 'GV_SC-08', 'GV_SC-09', 'GV_SC-10'],
  'ID_AM': ['ID_AM-01', 'ID_AM-02', 'ID_AM-03', 'ID_AM-04', 'ID_AM-05', 'ID_AM-07', 'ID_AM-08'],
  'ID_IM': ['ID_IM-01', 'ID_IM-02', 'ID_IM-03', 'ID_IM-04'],
  'ID_RA': ['ID_RA-01', 'ID_RA-02', 'ID_RA-03', 'ID_RA-04', 'ID_RA-05', 'ID_RA-06', 'ID_RA-07', 'ID_RA-08', 'ID_RA-09', 'ID_RA-10'],
  'PR_AA': ['PR_AA-01', 'PR_AA-02', 'PR_AA-03', 'PR_AA-04', 'PR_AA-05', 'PR_AA-06'],
  'PR_AT': ['PR_AT-01', 'PR_AT-02'],
  'PR_DS': ['PR_DS-01', 'PR_DS-02', 'PR_DS-10', 'PR_DS-11'],
  'PR_IR': ['PR_IR-01', 'PR_IR-02', 'PR_IR-03', 'PR_IR-04'],
  'PR_PS': ['PR_PS-01', 'PR_PS-02', 'PR_PS-03', 'PR_PS-04', 'PR_PS-05', 'PR_PS-06'],
  'RC_CO': ['RC_CO-03', 'RC_CO-04'],
  'RC_RP': ['RC_RP-01', 'RC_RP-02', 'RC_RP-03', 'RC_RP-04', 'RC_RP-05', 'RC_RP-06'],
  'RS_AN': ['RS_AN-03', 'RS_AN-06', 'RS_AN-07', 'RS_AN-08'],
  'RS_CO': ['RS_CO-02', 'RS_CO-03'],
  'RS_MA': ['RS_MA-01', 'RS_MA-02', 'RS_MA-03', 'RS_MA-04', 'RS_MA-05'],
  'RS_MI': ['RS_MI-01', 'RS_MI-02'],
} as const;

export type NistV2SafeguardsImplementation = {
  [key in keyof typeof NistV2SafeguardsByGroup]: Record<
    (typeof NistV2SafeguardsByGroup)[key][number],
    number
  >;
};

export type NistV2Abbreviation =
  (typeof CONTROL_CODE_MAP_DESC)[NistV2Code]['abbr'];

export const nistV2Abbreviations = Object.values(CONTROL_CODE_MAP_DESC).map(
  ({ abbr }) => abbr,
);

const BATTERY_OPTION_COLOR = 'fill.brand.primary';
export const BY_MATURITY_BATTERY_OPTIONS = [
  {
    value: ENISTControl.INITIAL.toString(),
    backgroundColor: BATTERY_OPTION_COLOR,
    translationKey: 'initial',
  },
  {
    value: ENISTControl.REPEATABLE.toString(),
    backgroundColor: BATTERY_OPTION_COLOR,
    translationKey: 'repeatable',
  },
  {
    value: ENISTControl.DEFINED.toString(),
    backgroundColor: BATTERY_OPTION_COLOR,
    translationKey: 'defined',
  },
  {
    value: ENISTControl.MANAGED.toString(),
    backgroundColor: BATTERY_OPTION_COLOR,
    translationKey: 'managed',
  },
  {
    value: ENISTControl.OPTIMIZED.toString(),
    backgroundColor: BATTERY_OPTION_COLOR,
    translationKey: 'optimized',
  },
];

export const BY_FUNCTION_BATTERY_OPTIONS = [
  {
    value: ENISTControl.INITIAL.toString(),
    backgroundColor: BATTERY_OPTION_COLOR,
  },
  {
    value: ENISTControl.REPEATABLE.toString(),
    backgroundColor: BATTERY_OPTION_COLOR,
  },
  {
    value: ENISTControl.DEFINED.toString(),
    backgroundColor: BATTERY_OPTION_COLOR,
  },
  {
    value: ENISTControl.MANAGED.toString(),
    backgroundColor: BATTERY_OPTION_COLOR,
  },
  {
    value: ENISTControl.OPTIMIZED.toString(),
    backgroundColor: BATTERY_OPTION_COLOR,
  },
];

const getControlAbbrByFunction = <T extends readonly string[]>(
  controlCodes: T,
): string[] => {
  const controls = Object.fromEntries(
    Object.entries(CONTROL_CODE_MAP_DESC).filter(([k]) =>
      (controlCodes as readonly string[]).includes(k),
    ),
  );
  return Object.values(controls).map((item) => item.abbr);
};

export const detectControlsCodes = ['DE_AE', 'DE_CM'] as const;
export const DETECT_ABBR = getControlAbbrByFunction(detectControlsCodes);

export const governControlsCodes = ['GV_OC', 'GV_OV', 'GV_PO', 'GV_RM', 'GV_RR', 'GV_SC'] as const;
export const GOVERN_ABBR = getControlAbbrByFunction(governControlsCodes);

export const identifyControlsCodes = ['ID_AM', 'ID_IM', 'ID_RA'] as const;
export const IDENTIFY_ABBR = getControlAbbrByFunction(identifyControlsCodes);

export const protectControlsCodes = ['PR_AA', 'PR_AT', 'PR_DS', 'PR_IR', 'PR_PS'] as const;
export const PROTECT_ABBR = getControlAbbrByFunction(protectControlsCodes);

export const recoverControlsCodes = ['RC_CO', 'RC_RP'] as const;
export const RECOVER_ABBR = getControlAbbrByFunction(recoverControlsCodes);

export const respondControlsCodes = ['RS_AN', 'RS_CO', 'RS_MA', 'RS_MI'] as const;
export const RESPOND_ABBR = getControlAbbrByFunction(respondControlsCodes);

export const createDefaultNistV2Implementation = (): NistV2SafeguardsImplementation => {
  const defaultImplementation = {} as NistV2SafeguardsImplementation;

  // Initialize all groups with empty records (all values will be 0 by default)
  (Object.keys(NistV2SafeguardsByGroup) as Array<keyof typeof NistV2SafeguardsByGroup>).forEach((groupKey) => {
    (defaultImplementation as any)[groupKey] = {};
  });

  return defaultImplementation;
};

export const validateAndNormalizeSafeguards = (safeguards: unknown): NistV2SafeguardsImplementation => {
  if (!safeguards || typeof safeguards !== 'object') {
    return createDefaultNistV2Implementation();
  }
  return safeguards as NistV2SafeguardsImplementation;
};

export const nistV2AbbrToCode = (abbr: NistV2Abbreviation): NistV2Code => {
  const data = Object.entries(CONTROL_CODE_MAP_DESC).find(
    ([_, item]) => item.abbr === abbr,
  );
  return data![0] as NistV2Code;
};

// Returns the titles for a given safeguard
export const abbrToText = (abbr: string): Record<string, any> => {
  try {
    const [controlAbbr, _controlNumberRaw] = abbr.split('-');
    const subcategories = Object.values(CONTROL_CODE_MAP_DESC).find(
      (item) => item.abbr === controlAbbr,
    )?.subcategories;
    if (!subcategories) {
      return {
        title: abbr,
        secondaryTitle: abbr,
        desc: abbr,
      };
    }
    const subcategory = (subcategories as Record<string, string>)[abbr];
    return {
      title: abbr,
      secondaryTitle: subcategory || abbr,
      desc: subcategory || abbr,
    };
  } catch (error) {
    console.error(error);
    return {
      title: abbr,
      secondaryTitle: abbr,
      desc: abbr,
    };
  }
}
