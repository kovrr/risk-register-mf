export const CONTROL_CODE_MAP_DESC = {
  NS: {
    abbr: 'NS',
    title: 'Network security',
    description:
      'Network Security covers controls to secure and protect Azure networks, including securing virtual networks, establishing private connections, preventing, and mitigating external attacks, and securing DNS.',
    subcategories: {
      'NS-1': 'Establish network segmentation boundaries',
      'NS-2': 'Secure cloud services with network controls',
      'NS-3': 'Deploy firewall at the edge of enterprise network',
      'NS-4':
        'Deploy intrusion detection/intrusion prevention systems (IDS/IPS)',
      'NS-5': 'Deploy DDOS protection',
      'NS-6': 'Deploy web application firewall',
      'NS-7': 'Simplify network security configuration',
      'NS-8': 'Detect and disable insecure services and protocols',
      'NS-9': 'Connect on-premises or cloud network privately',
      'NS-10': 'Ensure Domain Name System (DNS) security',
    },
  },
  IM: {
    abbr: 'IM',
    title: 'Identity Management',
    description:
      'Identity Management covers controls to establish a secure identity and access controls using Azure Active Directory, including the use of single sign-on, strong authentications, managed identities (and service principals) for applications, conditional access, and account anomalies monitoring.',
    subcategories: {
      'IM-1': 'Use centralized identity and authentication system',
      'IM-2': 'Protect identity and authentication systems',
      'IM-3': 'Manage application identities securely and automatically',
      'IM-4': 'Authenticate server and services',
      'IM-5': 'Use single sign-on (SSO) for application access',
      'IM-6': 'Use strong authentication controls',
      'IM-7': 'Restrict resource access based on conditions',
      'IM-8': 'Restrict the exposure of credential and secrets',
      'IM-9': 'Secure user access to existing applications',
    },
  },
  PA: {
    abbr: 'PA',
    title: 'Privileged Access',
    description:
      'Privileged Access covers controls to protect privileged access to your Azure tenant and resources, including a range of controls to protect your administrative model, administrative accounts, and privileged access workstations against deliberate and inadvertent risk.',
    subcategories: {
      'PA-1': 'Separate and limit highly privileged/administrative users',
      'PA-2': 'Avoid standing access for user accounts and permissions',
      'PA-3': 'Manage lifecycle of identities and entitlements',
      'PA-4': 'Review and reconcile user access regularly',
      'PA-5': 'Set up emergency access',
      'PA-6': 'Use privileged access workstations',
      'PA-7': 'Follow just enough administration (least privilege) principle',
      'PA-8': 'Determine access process for cloud provider support',
    },
  },
  DP: {
    abbr: 'DP',
    title: 'Data Protection',
    description:
      'Data Protection covers control of data protection at rest, in transit, and via authorized access mechanisms, including discover, classify, protect, and monitor sensitive data assets using access control, encryption, key and certificate management in Azure.',
    subcategories: {
      'DP-1': 'Discover, classify, and label sensitive data',
      'DP-2': 'Monitor anomalies and threats targeting sensitive data',
      'DP-3': 'Encrypt sensitive data in transit',
      'DP-4': 'Enable data at rest encryption by default',
      'DP-5':
        'Use customer-managed key option in data at rest encryption when required',
      'DP-6': 'Use a secure key management process',
      'DP-7': 'Use a secure certificate management process',
      'DP-8': 'Ensure security of key and certificate repository',
    },
  },
  AM: {
    abbr: 'AM',
    title: 'Asset Management',
    description:
      'Asset Asset Management covers controls to ensure security visibility and governance over Azure resources, including recommendations on permissions for security personnel, security access to asset inventory, and managing approvals for services and resources (inventory, track, and correct).',
    subcategories: {
      'AM-1': 'Track asset inventory and their risks',
      'AM-2': 'Use only approved services',
      'AM-3': 'Ensure security of asset lifecycle management',
      'AM-4': 'Limit access to asset management',
      'AM-5': 'Use only approved applications in virtual machines',
    },
  },
  LT: {
    abbr: 'LT',
    title: 'Logging and Threat Detection',
    description:
      'Logging and Threat Detection covers controls for detecting threats on Azure and enabling, collecting, and storing audit logs for Azure services, including enabling detection, investigation, and remediation processes with controls to generate high-quality alerts with native threat detection in Azure services; it also includes collecting logs with Azure Monitor, centralizing security analysis with Azure Sentinel, time synchronization, and log retention.',
    subcategories: {
      'LT-1': 'Enable threat detection for Azure resources',
      'LT-2':
        'Enable threat detection for Azure identity and access management',
      'LT-3': 'Enable logging for Azure network activities',
      'LT-4': 'Enable logging for Azure resources',
      'LT-5': 'Centralize security log management and analysis',
      'LT-6': 'Configure log storage retention',
      'LT-7': 'Use approved time synchronization sources',
    },
  },
  IR: {
    abbr: 'IR',
    title: 'Incident Response',
    description:
      'Incident Response covers controls in incident response life cycle - preparation, detection and analysis, containment, and post-incident activities, including using Azure services such as Microsoft Defender for Cloud and Sentinel to automate the incident response process.',
    subcategories: {
      'IR-1':
        'Preparation - update incident response plan and handling process',
      'IR-2': 'Preparation - setup incident notification',
      'IR-3':
        'Detection and analysis - create incidents based on high-quality alerts',
      'IR-4': 'Detection and analysis - investigate an incident',
      'IR-5': 'Detection and analysis - prioritize incidents',
      'IR-6':
        'Containment, eradication and recovery - automate the incident handling',
      'IR-7':
        'Post-incident activity - conduct lesson learned and retain evidence',
    },
  },
  PV: {
    abbr: 'PV',
    title: 'Posture and Vulnerability Management',
    description:
      'Posture and Vulnerability Management focuses on controls for assessing and improving Azure security posture, including vulnerability scanning, penetration testing and remediation, as well as security configuration tracking, reporting, and correction in Azure resources.',
    subcategories: {
      'PV-1': 'Define and establish secure configurations',
      'PV-2': 'Audit and enforce secure configurations',
      'PV-3':
        'Define and establish secure configurations for compute resources',
      'PV-4': 'Audit and enforce secure configurations for compute resources',
      'PV-5': 'Perform vulnerability assessments',
      'PV-6': 'Rapidly and automatically remediate vulnerabilities',
      'PV-7': 'Conduct regular red team operations',
    },
  },
  ES: {
    abbr: 'ES',
    title: 'Endpoint Security',
    description:
      'Endpoint Security covers controls in endpoint detection and response, including use of endpoint detection and response (EDR) and anti-malware service for endpoints in Azure environments.',
    subcategories: {
      'ES-1': 'Use Endpoint Detection and Response (EDR)',
      'ES-2': 'Use modern anti-malware software',
      'ES-3': 'Ensure anti-malware software and signatures are updated',
    },
  },
  BR: {
    abbr: 'BR',
    title: 'Backup and Recovery',
    description:
      'Backup and Recovery covers controls to ensure that data and configuration backups at the different service tiers are performed, validated, and protected.',
    subcategories: {
      'BR-1': 'Ensure regular automated backups',
      'BR-2': 'Protect backup and recovery data',
      'BR-3': 'Monitor backups',
      'BR-4': 'Regularly test backups',
    },
  },
  DS: {
    abbr: 'DS',
    title: 'DevOps Security',
    description:
      'DevOps Security covers the controls related to the security engineering and operations in the DevOps processes, including deployment of critical security checks (such as static application security testing, vulnerability management) prior to the deployment phase to ensure the security throughout the DevOps process; it also includes common topics such as threat modeling and software supply security.',
    subcategories: {
      'DS-1': 'Conduct threat modeling',
      'DS-2': 'Ensure software supply chain security',
      'DS-3': 'Secure DevOps infrastructure',
      'DS-4':
        'Integrate static application security testing into DevOps pipeline',
      'DS-5':
        'Integrate dynamic application security testing into DevOps pipeline',
      'DS-6': 'Enforce security of workload throughout DevOps lifecycle',
      'DS-7': 'Enable logging and monitoring in DevOps',
    },
  },
  GS: {
    abbr: 'GS',
    title: 'Governance and Strategy',
    description:
      'Governance and Strategy provides guidance for ensuring a coherent security strategy and documented governance approach to guide and sustain security assurance, including establishing roles and responsibilities for the different cloud security functions, unified technical strategy, and supporting policies and standards.',
    subcategories: {
      'GS-1': 'Align organization roles, responsibilities and accountabilities',
      'GS-2':
        'Define and implement enterprise segmentation/separation of duties strategy',
      'GS-3': 'Define and implement data protection strategy',
      'GS-4': 'Define and implement network security strategy',
      'GS-5': 'Define and implement security posture management strategy',
      'GS-6': 'Define and implement identity and privileged access strategy',
      'GS-7':
        'Define and implement logging, threat detection and incident response strategy',
      'GS-8': 'Define and implement backup and recovery strategy',
      'GS-9': 'Define and implement endpoint security strategy',
      'GS-10': 'Define and implement DevOps security strategy',
    },
  },
};

export type AsbCode = keyof typeof CONTROL_CODE_MAP_DESC;
