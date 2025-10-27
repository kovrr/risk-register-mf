import { ENISTControl } from "@/types/quantificationForm";

interface NISTSubcategories {
  [key: string]: string;
}

interface NISTDetails {
  function: string;
  title: string;
  desc: string;
  abbr: string;
  subcategories: NISTSubcategories;
}

export interface NISTDetailsMap {
  [key: string]: NISTDetails;
}

export const MAX_NIST_GRADE = 5;

export const NistNameToCode: { [key: string]: number } = {
  ID_AM: 1,
  ID_BE: 2,
  ID_GV: 3,
  ID_RA: 4,
  ID_RM: 5,
  ID_SC: 6,
  PR_AC: 7,
  PR_AT: 8,
  PR_DS: 9,
  PR_IP: 10,
  PR_MA: 11,
  PR_PT: 12,
  DE_AE: 13,
  DE_CM: 14,
  DE_DP: 15,
  RS_RP: 16,
  RS_CO: 17,
  RS_AN: 18,
  RS_MI: 19,
  RS_IM: 20,
  RC_RP: 21,
  RC_IM: 22,
  RC_CO: 23,
};

export const NIST_CATEGORY_LEN = {
  ID: 6,
  PR: 6,
  DE: 3,
  RS: 5,
  RC: 3,
} as const;

export const CONTROL_CODE_MAP_DESC = {
  'ID.AM': {
    function: 'Identify',
    title: 'Asset Management',
    desc: 'The data, personnel, devices, systems, and facilities that enable the organization to achieve business purposes are identified and managed consistent with their relative importance to organizational objectives and the organization’s risk strategy.',
    abbr: 'ID.AM',
    subcategories: {
      'ID.AM-1':
        'Physical devices and systems within the organization are inventoried',
      'ID.AM-2':
        'Software platforms and applications within the organization are inventoried',
      'ID.AM-3': 'Organizational communication and data flows are mapped',
      'ID.AM-4': 'External information systems are catalogued',
      'ID.AM-5':
        'Resources (e.g., hardware, devices, data, time, personnel, and software) are prioritized based on their classification, criticality, and business value',
      'ID.AM-6':
        'Cybersecurity roles and responsibilities for the entire workforce and third-party stakeholders (e.g., suppliers, customers, partners) are established',
    },
  },
  'ID.BE': {
    function: 'Identify',
    title: 'Business Environment',
    desc: 'The organization’s mission, objectives, stakeholders, and activities are understood and prioritized; this information is used to inform cybersecurity roles, responsibilities, and risk management decisions.',
    abbr: 'ID.BE',
    subcategories: {
      'ID.BE-1':
        'The organization’s role in the supply chain is identified and communicated',
      'ID.BE-2':
        'The organization’s place in critical infrastructure and its industry sector is identified and communicated',
      'ID.BE-3':
        'Priorities for organizational mission, objectives, and activities are established and communicated',
      'ID.BE-4':
        'Dependencies and critical functions for delivery of critical services are established',
      'ID.BE-5':
        'Resilience requirements to support delivery of critical services are established for all operating states (e.g. under duress/attack, during recovery, normal operations)',
    },
  },
  'ID.GV': {
    function: 'Identify',
    title: 'Governance',
    desc: 'The policies, procedures, and processes to manage and monitor the organization’s regulatory, legal, risk, environmental, and operational requirements are understood and inform the management of cybersecurity risk.',
    abbr: 'ID.GV',
    subcategories: {
      'ID.GV-1':
        'Organizational cybersecurity policy is established and communicated',
      'ID.GV-2':
        'Cybersecurity roles and responsibilities are coordinated and aligned with internal roles and external partners',
      'ID.GV-3':
        'Legal and regulatory requirements regarding cybersecurity, including privacy and civil liberties obligations, are understood and managed',
      'ID.GV-4':
        'Governance and risk management processes address cybersecurity risks',
    },
  },
  'ID.RA': {
    function: 'Identify',
    title: 'Risk Assessment',
    desc: 'The organization understands the cybersecurity risk to organizational operations (including mission, functions, image, or reputation), organizational assets, and individuals.',
    abbr: 'ID.RA',
    subcategories: {
      'ID.RA-1': 'Asset vulnerabilities are identified and documented',
      'ID.RA-2':
        'Cyber threat intelligence is received from information sharing forums and sources',
      'ID.RA-3':
        'Threats, both internal and external, are identified and documented',
      'ID.RA-4': 'Potential business impacts and likelihoods are identified',
      'ID.RA-5':
        'Threats, vulnerabilities, likelihoods, and impacts are used to determine risk',
      'ID.RA-6': 'Risk responses are identified and prioritized',
    },
  },
  'ID.RM': {
    function: 'Identify',
    title: 'Risk Management Strategy',
    desc: 'The organization’s priorities, constraints, risk tolerances, and assumptions are established and used to support operational risk decisions.',
    abbr: 'ID.RM',
    subcategories: {
      'ID.RM-1':
        'Risk management processes are established, managed, and agreed to by organizational stakeholders',
      'ID.RM-2':
        'Organizational risk tolerance is determined and clearly expressed',
      'ID.RM-3':
        'The organization’s determination of risk tolerance is informed by its role in critical infrastructure and sector specific risk analysis',
    },
  },
  'ID.SC': {
    function: 'Identify',
    title: 'Supply Chain Risk Management',
    desc: 'The organization’s priorities, constraints, risk tolerances, and assumptions are established and used to support risk decisions associated with managing supply chain risk. The organization has established and implemented the processes to identify, assess and manage supply chain risks.',
    abbr: 'ID.SC',
    subcategories: {
      'ID.SC-1':
        'Cyber supply chain risk management processes are identified, established, assessed, managed, and agreed to by organizational stakeholders',
      'ID.SC-2':
        'Suppliers and third party partners of information systems, components, and services are identified, prioritized, and assessed using a cyber supply chain risk assessment process',
      'ID.SC-3':
        'Contracts with suppliers and third-party partners are used to implement appropriate measures designed to meet the objectives of an organization’s cybersecurity program and Cyber Supply Chain Risk Management Plan.',
      'ID.SC-4':
        'Suppliers and third-party partners are routinely assessed using audits, test results, or other forms of evaluations to confirm they are meeting their contractual obligations.',
      'ID.SC-5':
        'Response and recovery planning and testing are conducted with suppliers and third-party providers',
    },
  },
  'PR.AC': {
    function: 'Protect',
    title: 'Identity Management, Authentication and Access Control',
    desc: 'Access to physical and logical assets and associated facilities is limited to authorized users, processes, and devices, and is managed consistent with the assessed risk of unauthorized access to authorized activities and transactions.',
    abbr: 'PR.AC',
    subcategories: {
      'PR.AC-1':
        'Identities and credentials are issued, managed, verified, revoked, and audited for authorized devices, users and processes',
      'PR.AC-2': 'Physical access to assets is managed and protected',
      'PR.AC-3': 'Remote access is managed',
      'PR.AC-4':
        'Access permissions and authorizations are managed, incorporating the principles of least privilege and separation of duties',
      'PR.AC-5':
        'Network integrity is protected (e.g., network segregation, network segmentation)',
      'PR.AC-6':
        'Identities are proofed and bound to credentials and asserted in interactions',
      'PR.AC-7':
        'Users, devices, and other assets are authenticated (e.g., single-factor, multi-factor) commensurate with the risk of the transaction (e.g., individuals’ security and privacy risks and other organizational risks)',
    },
  },
  'PR.AT': {
    function: 'Protect',
    title: 'Awareness and Training',
    desc: 'The organization’s personnel and partners are provided cybersecurity awareness education and are trained to perform their cybersecurity-related duties and responsibilities consistent with related policies, procedures, and agreements.',
    abbr: 'PR.AT',
    subcategories: {
      'PR.AT-1': 'All users are informed and trained',
      'PR.AT-2': 'Privileged users understand their roles and responsibilities',
      'PR.AT-3':
        'Third-party stakeholders (e.g., suppliers, customers, partners) understand their roles and responsibilities',
      'PR.AT-4':
        'Senior executives understand their roles and responsibilities',
      'PR.AT-5':
        'Physical and cybersecurity personnel understand their roles and responsibilities',
    },
  },
  'PR.DS': {
    function: 'Protect',
    title: 'Data Security',
    desc: 'Information and records (data) are managed consistent with the organization’s risk strategy to protect the confidentiality, integrity, and availability of information.',
    abbr: 'PR.DS',
    subcategories: {
      'PR.DS-1': 'Data-at-rest is protected',
      'PR.DS-2': 'Data-in-transit is protected',
      'PR.DS-3':
        'Assets are formally managed throughout removal, transfers, and disposition',
      'PR.DS-4': 'Adequate capacity to ensure availability is maintained',
      'PR.DS-5': 'Protections against data leaks are implemented',
      'PR.DS-6':
        'Integrity checking mechanisms are used to verify software, firmware, and information integrity',
      'PR.DS-7':
        'The development and testing environment(s) are separate from the production environment',
      'PR.DS-8':
        'Integrity checking mechanisms are used to verify hardware integrity',
    },
  },
  'PR.IP': {
    function: 'Protect',
    title: 'Information Protection Processes and Procedures',
    desc: 'Security policies (that address purpose, scope, roles, responsibilities, management commitment, and coordination among organizational entities), processes, and procedures are maintained and used to manage protection of information systems and assets.',
    abbr: 'PR.IP',
    subcategories: {
      'PR.IP-1':
        'A baseline configuration of information technology/industrial control systems is created and maintained incorporating security principles (e.g. concept of least functionality)',
      'PR.IP-2':
        'A System Development Life Cycle to manage systems is implemented',
      'PR.IP-3': 'Configuration change control processes are in place',
      'PR.IP-4': 'Backups of information are conducted, maintained, and tested',
      'PR.IP-5':
        'Policy and regulations regarding the physical operating environment for organizational assets are met',
      'PR.IP-6': 'Data is destroyed according to policy',
      'PR.IP-7': 'Protection processes are improved',
      'PR.IP-8': 'Effectiveness of protection technologies is shared',
      'PR.IP-9':
        'Response plans (Incident Response and Business Continuity) and recovery plans (Incident Recovery and Disaster Recovery) are in place and managed',
      'PR.IP-10': 'Response and recovery plans are tested',
      'PR.IP-11':
        'Cybersecurity is included in human resources practices (e.g., deprovisioning, personnel screening)',
      'PR.IP-12':
        'A vulnerability management plan is developed and implemented',
    },
  },
  'PR.MA': {
    function: 'Protect',
    title: 'Maintenance',
    desc: 'Maintenance and repairs of industrial control and information system components are performed consistent with policies and procedures.',
    abbr: 'PR.MA',
    subcategories: {
      'PR.MA-1':
        'Maintenance and repair of organizational assets are performed and logged, with approved and controlled tools',
      'PR.MA-2':
        'Remote maintenance of organizational assets is approved, logged, and performed in a manner that prevents unauthorized access',
    },
  },
  'PR.PT': {
    function: 'Protect',
    title: 'Protective Technology',
    desc: 'Technical security solutions are managed to ensure the security and resilience of systems and assets, consistent with related policies, procedures, and agreements.',
    abbr: 'PR.PT',
    subcategories: {
      'PR.PT-1':
        'Audit/log records are determined, documented, implemented, and reviewed in accordance with policy',
      'PR.PT-2':
        'Removable media is protected and its use restricted according to policy',
      'PR.PT-3':
        'The principle of least functionality is incorporated by configuring systems to provide only essential capabilities',
      'PR.PT-4': 'Communications and control networks are protected',
      'PR.PT-5':
        'Mechanisms (e.g., failsafe, load balancing, hot swap) are implemented to achieve resilience requirements in normal and adverse situations',
    },
  },
  'DE.AE': {
    function: 'Detect',
    title: 'Anomalies and Events',
    desc: 'Anomalous activity is detected and the potential impact of events is understood.',
    abbr: 'DE.AE',
    subcategories: {
      'DE.AE-1':
        'A baseline of network operations and expected data flows for users and systems is established and managed',
      'DE.AE-2':
        'Detected events are analyzed to understand attack targets and methods',
      'DE.AE-3':
        'Event data are collected and correlated from multiple sources and sensors',
      'DE.AE-4': 'Impact of events is determined',
      'DE.AE-5': 'Incident alert thresholds are established',
    },
  },
  'DE.CM': {
    function: 'Detect',
    title: 'Security Continuous Monitoring',
    desc: 'The information system and assets are monitored to identify cybersecurity events and verify the effectiveness of protective measures.',
    abbr: 'DE.CM',
    subcategories: {
      'DE.CM-1':
        'The network is monitored to detect potential cybersecurity events',
      'DE.CM-2':
        'The physical environment is monitored to detect potential cybersecurity events',
      'DE.CM-3':
        'Personnel activity is monitored to detect potential cybersecurity events',
      'DE.CM-4': 'Malicious code is detected',
      'DE.CM-5': 'Unauthorized mobile code is detected',
      'DE.CM-6':
        'External service provider activity is monitored to detect potential cybersecurity events',
      'DE.CM-7':
        'Monitoring for unauthorized personnel, connections, devices, and software is performed',
      'DE.CM-8': 'Vulnerability scans are performed',
    },
  },
  'DE.DP': {
    function: 'Detect',
    title: 'Detection Processes',
    desc: 'Detection processes and procedures are maintained and tested to ensure awareness of anomalous events.',
    abbr: 'DE.DP',
    subcategories: {
      'DE.DP-1':
        'Roles and responsibilities for detection are well defined to ensure accountability',
      'DE.DP-2': 'Detection activities comply with all applicable requirements',
      'DE.DP-3': 'Detection processes are tested',
      'DE.DP-4': 'Event detection information is communicated',
      'DE.DP-5': 'Detection processes are continuously improved',
    },
  },
  'RS.RP': {
    function: 'Respond',
    title: 'Response Planning',
    desc: 'Response processes and procedures are executed and maintained, to ensure response to detected cybersecurity incidents.',
    abbr: 'RS.RP',
    subcategories: {
      'RS.RP-1': 'Response plan is executed during or after an incident',
    },
  },
  'RS.CO': {
    function: 'Respond',
    title: 'Communications',
    desc: 'Response activities are coordinated with internal and external stakeholders (e.g. external support from law enforcement agencies).',
    abbr: 'RS.CO',
    subcategories: {
      'RS.CO-1':
        'Personnel know their roles and order of operations when a response is needed',
      'RS.CO-2': 'Incidents are reported consistent with established criteria',
      'RS.CO-3': 'Information is shared consistent with response plans',
      'RS.CO-4':
        'Coordination with stakeholders occurs consistent with response plans',
      'RS.CO-5':
        'Voluntary information sharing occurs with external stakeholders to achieve broader cybersecurity situational awareness',
    },
  },
  'RS.AN': {
    function: 'Respond',
    title: 'Analysis',
    desc: 'Analysis is conducted to ensure effective response and support recovery activities.',
    abbr: 'RS.AN',
    subcategories: {
      'RS.AN-1': 'Notifications from detection systems are investigated',
      'RS.AN-2': 'The impact of the incident is understood',
      'RS.AN-3': 'Forensics are performed',
      'RS.AN-4': 'Incidents are categorized consistent with response plans',
      'RS.AN-5':
        'Processes are established to receive, analyze and respond to vulnerabilities disclosed to the organization from internal and external sources (e.g. internal testing, security bulletins, or security researchers)',
    },
  },
  'RS.MI': {
    function: 'Respond',
    title: 'Mitigation',
    desc: 'Activities are performed to prevent expansion of an event, mitigate its effects, and resolve the incident.',
    abbr: 'RS.MI',
    subcategories: {
      'RS.MI-1': 'Incidents are contained',
      'RS.MI-2': 'Incidents are mitigated',
      'RS.MI-3':
        'Newly identified vulnerabilities are mitigated or documented as accepted risks',
    },
  },
  'RS.IM': {
    function: 'Respond',
    title: 'Improvements',
    desc: 'Organizational response activities are improved by incorporating lessons learned from current and previous detection/response activities.',
    abbr: 'RS.IM',
    subcategories: {
      'RS.IM-1': 'Response plans incorporate lessons learned',
      'RS.IM-2': 'Response strategies are updated',
    },
  },
  'RC.RP': {
    function: 'Recover',
    title: 'Recovery Planning',
    desc: 'Recovery processes and procedures are executed and maintained to ensure restoration of systems or assets affected by cybersecurity incidents.',
    abbr: 'RC.RP',
    subcategories: {
      'RC.RP-1':
        'Recovery plan is executed during or after a cybersecurity incident',
    },
  },
  'RC.IM': {
    function: 'Recover',
    title: 'Improvements',
    desc: 'Recovery planning and processes are improved by incorporating lessons learned into future activities.',
    abbr: 'RC.IM',
    subcategories: {
      'RC.IM-1': 'Recovery plans incorporate lessons learned',
      'RC.IM-2': 'Recovery strategies are updated',
    },
  },
  'RC.CO': {
    function: 'Recover',
    title: 'Communications',
    desc: 'Restoration activities are coordinated with internal and external parties (e.g.  coordinating centers, Internet Service Providers, owners of attacking systems, victims, other CSIRTs, and vendors).',
    abbr: 'RC.CO',
    subcategories: {
      'RC.CO-1': 'Public relations are managed',
      'RC.CO-2': 'Reputation is repaired after an incident',
      'RC.CO-3':
        'Recovery activities are communicated to internal and external stakeholders as well as executive and management teams',
    },
  },
} as const;

export type NistCode = keyof typeof CONTROL_CODE_MAP_DESC

export const NIST_TO_CATEGORY_CODE = Object.fromEntries(
  Object.values(CONTROL_CODE_MAP_DESC).map((control) => [
    control.abbr,
    control.abbr.split('.')[0],
  ])
);

export const nistCategories = ['RC', 'RS', 'PR', 'DE', 'ID'] as const;

export const IDENTIFY_CONTROLS = Object.values(CONTROL_CODE_MAP_DESC).filter(item => item.function === "Identify").map(item => item.abbr)
export const PROTECT_CONTROLS = Object.values(CONTROL_CODE_MAP_DESC).filter(item => item.function === "Protect").map(item => item.abbr)
export const DETECT_CONTROLS = Object.values(CONTROL_CODE_MAP_DESC).filter(item => item.function === "Detect").map(item => item.abbr)
export const RESPOND_CONTROLS = Object.values(CONTROL_CODE_MAP_DESC).filter(item => item.function === "Respond").map(item => item.abbr)
export const RECOVER_CONTROLS = Object.values(CONTROL_CODE_MAP_DESC).filter(item => item.function === "Recover").map(item => item.abbr)

export type NistCategory = (typeof nistCategories)[number];
export const isNistCategory = (c: any): c is NistCategory =>
  nistCategories.includes(c);

export const NIST_RANGE_MINIMUM = [1, 5];

export const BATTERY_OPTIONS = [
  {
    label: 'Initial',
    value: ENISTControl.INITIAL.toString(),
    backgroundColor: 'brand.recommendedAction.initial',
  },
  {
    label: 'Repeatable',
    value: ENISTControl.REPEATABLE.toString(),
    backgroundColor: 'brand.recommendedAction.repeatable',
  },
  {
    label: 'Defined',
    value: ENISTControl.DEFINED.toString(),
    backgroundColor: 'brand.recommendedAction.defined',
  },
  {
    label: 'Managed',
    value: ENISTControl.MANAGED.toString(),
    backgroundColor: 'brand.recommendedAction.managed',
  },
  {
    label: `Optimized`,
    value: ENISTControl.OPTIMIZED.toString(),
    backgroundColor: 'brand.recommendedAction.optimized',
  },
  {
    label: `Unknown`,
    value: ENISTControl.UNKNOWN.toString(),
    backgroundColor: 'brand.recommendedAction.unknown',
  },
];
