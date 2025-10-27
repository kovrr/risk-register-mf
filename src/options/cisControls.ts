import { ECISControl } from 'types/quantificationForm';

export const MAX_CIS_GRADE = 3;

export const CONTROL_CODE_MAP_DESC = {
  '1': {
    title: 'Inventory and Control of Hardware Assets',
    column:
      'Keep track of (inventory, track, and correct) all hardware devices on the network in order to allow only authorized devices access and prevent unauthorized and unmanaged devices from gaining access.',
    desc: 'Actively manage (inventory, track, and correct) all hardware devices on the network so that only authorized devices are given access, and unauthorized and unmanaged devices are found and prevented from gaining access.',
    abbr: 'ICHA',
    safeguards: [
      {
        assetType: 'Devices',
        title: 'Utilize an Active Discovery Tool',
        desc: "Utilize an active discovery tool to identify devices connected to the organization's network and update the hardware asset inventory.",
        ig: [0, 1, 1],
      },
      {
        assetType: 'Devices',
        title: 'Use a Passive Asset Discovery Tool',
        desc: "Utilize a passive discovery tool to identify devices connected to the organization's network and automatically update the organization's hardware asset inventory.",
        ig: [0, 0, 1],
      },
      {
        assetType: 'Devices',
        title: 'Use DHCP Logging to Update Asset Inventory',
        desc: "Use Dynamic Host Configuration Protocol (DHCP) logging on all DHCP servers or IP address management tools to update the organization's hardware asset inventory.",
        ig: [0, 1, 1],
      },
      {
        assetType: 'Devices',
        title: 'Maintain Detailed Asset Inventory',
        desc: "Maintain an accurate and up-to-date inventory of all technology assets with the potential to store or process information. This inventory shall include all hardware assets, whether connected to the organization's network or not.",
        ig: [1, 1, 1],
      },
      {
        assetType: 'Devices',
        title: 'Maintain Asset Inventory Information',
        desc: 'Ensure that the hardware asset inventory records the network address, hardware address, machine name, data asset owner, and department for each asset and whether the hardware asset has been approved to connect to the network.',
        ig: [0, 1, 1],
      },
      {
        assetType: 'Devices',
        title: 'Address Unauthorized Assets',
        desc: 'Ensure that unauthorized assets are either removed from the network, quarantined or the inventory is updated in a timely manner.',
        ig: [1, 1, 1],
      },
      {
        assetType: 'Devices',
        title: 'Deploy Port Level Access Control',
        desc: 'Utilize port level access control, following 802.1x standards, to control which devices can authenticate to the network. The authentication system shall be tied into the hardware asset inventory data to ensure only authorized devices can connect to the network.',
        ig: [0, 1, 1],
      },
      {
        assetType: 'Devices',
        title: 'Utilize Client Certificates to Authenticate Hardware Assets',
        desc: "Use client certificates to authenticate hardware assets connecting to the organization's trusted network.",
        ig: [0, 0, 1],
      },
    ],
    isIG2IG3Equal: false,
  },
  '2': {
    title: 'Inventory and Control of Software Assets',
    column:
      'Manage (track, inventory, and correct) all software on the network so that only authorized software is installed and executed, and that all unauthorized or unmanaged software is detected and prevented from executing.',
    desc: 'Actively manage (inventory, track, and correct) all software on the network so that only authorized software is installed and can execute, and that unauthorized and unmanaged software is found and prevented from installation or execution.',
    abbr: 'ICSA',
    safeguards: [
      {
        assetType: 'Applications',
        title: 'Maintain Inventory of Authorized Software',
        desc: 'Maintain an up-to-date list of all authorized software that is required in the enterprise for any business purpose on any business system.',
        ig: [1, 1, 1],
      },
      {
        assetType: 'Applications',
        title: 'Ensure Software is Supported by Vendor',
        desc: "Ensure that only software applications or operating systems currently supported by the software's vendor are added to the organization's authorized software inventory. Unsupported software should be tagged as unsupported in the inventory system.",
        ig: [1, 1, 1],
      },
      {
        assetType: 'Applications',
        title: 'Utilize Software Inventory Tools',
        desc: 'Utilize software inventory tools throughout the organization to automate the documentation of all software on business systems.',
        ig: [0, 1, 1],
      },
      {
        assetType: 'Applications',
        title: 'Track Software Inventory Information',
        desc: 'The software inventory system should track the name, version, publisher, and install date for all software, including operating systems authorized by the organization.',
        ig: [0, 1, 1],
      },
      {
        assetType: 'Applications',
        title: 'Integrate Software and Hardware Asset Inventories',
        desc: 'The software inventory system should be tied into the hardware asset inventory so all devices and associated software are tracked from a single location.',
        ig: [0, 0, 1],
      },
      {
        assetType: 'Applications',
        title: 'Address unapproved software',
        desc: 'Ensure that unauthorized software is either removed or the inventory is updated in a timely manner',
        ig: [1, 1, 1],
      },
      {
        assetType: 'Applications',
        title: 'Utilize Application Whitelisting',
        desc: 'Utilize application whitelisting technology on all assets to ensure that only authorized software executes and all unauthorized software is blocked from executing on assets.',
        ig: [0, 0, 1],
      },
      {
        assetType: 'Applications',
        title: 'Implement Application Whitelisting of Libraries',
        desc: "The organization's application whitelisting software must ensure that only authorized software libraries (such as *.dll, *.ocx, *.so, etc.) are allowed to load into a system process.",
        ig: [0, 0, 1],
      },
      {
        assetType: 'Applications',
        title: 'Implement Application Whitelisting of Scripts',
        desc: "The organization's application whitelisting software must ensure that only authorized, digitally signed scripts (such as *.ps1,  *.py, macros, etc.) are allowed to run on a system.",
        ig: [0, 0, 1],
      },
      {
        assetType: 'Applications',
        title: 'Physically or Logically Segregate High Risk Applications',
        desc: 'Physically or logically segregated systems should be used to isolate and run software that is required for business operations but incur higher risk for the organization.',
        ig: [0, 0, 1],
      },
    ],
    isIG2IG3Equal: false,
  },
  '3': {
    title: 'Continuous Vulnerability Management',
    column:
      'To identify vulnerabilities, remediate, and minimize the window of opportunity for attackers, you must continuously acquire, assess, and act on new information.',
    desc: 'Continuously acquire, assess, and take action on new information in order to identify vulnerabilities, remediate, and minimize the window of opportunity for attackers.',
    abbr: 'CVM',
    safeguards: [
      {
        assetType: 'Applications',
        title: 'Run Automated Vulnerability Scanning Tools',
        desc: "Utilize an up-to-date SCAP-compliant vulnerability scanning tool to automatically scan all systems on the network on a weekly or more frequent basis to identify all potential vulnerabilities on the organization's systems.",
        ig: [0, 1, 1],
      },
      {
        assetType: 'Applications',
        title: 'Perform Authenticated Vulnerability Scanning',
        desc: 'Perform authenticated vulnerability scanning with agents running locally on each system or with remote scanners that are configured with elevated rights on the system being tested.',
        ig: [0, 1, 1],
      },
      {
        assetType: 'Users',
        title: 'Protect Dedicated Assessment Accounts',
        desc: 'Use a dedicated account for authenticated vulnerability scans, which should not be used for any other administrative activities and should be tied to specific machines at specific IP addresses.',
        ig: [0, 1, 1],
      },
      {
        assetType: 'Applications',
        title: 'Deploy Automated Operating System Patch Management Tools',
        desc: 'Deploy automated software update tools in order to ensure that the operating systems are running the most recent security updates provided by the software vendor.',
        ig: [1, 1, 1],
      },
      {
        assetType: 'Applications',
        title: 'Deploy Automated Software Patch Management Tools',
        desc: 'Deploy automated software update tools in order to ensure that third-party software on all systems is running the most recent security updates provided by the software vendor.',
        ig: [1, 1, 1],
      },
      {
        assetType: 'Applications',
        title: 'Compare Back-to-back Vulnerability Scans',
        desc: 'Regularly compare the results from back-to-back vulnerability scans to verify that vulnerabilities have been remediated in a timely manner.',
        ig: [0, 1, 1],
      },
      {
        assetType: 'Applications',
        title: 'Utilize a Risk-rating Process',
        desc: 'Utilize a risk-rating process to prioritize the remediation of discovered vulnerabilities.',
        ig: [0, 1, 1],
      },
    ],
    isIG2IG3Equal: true,
  },
  '4': {
    title: 'Controlled Use of Administrative Privileges',
    column:
      'Tools and processes used to monitor, prevent, and fix any problems related to the use, assignment, and configuration of administrative privileges on computers, networks, and applications.',
    desc: 'The processes and tools used to track/control/prevent/correct the use, assignment, and configuration of administrative privileges on computers, networks, and applications.',
    abbr: 'CUAP',
    safeguards: [
      {
        assetType: 'Users',
        title: 'Maintain Inventory of Administrative Accounts',
        desc: 'Use automated tools to inventory all administrative accounts, including domain and local accounts, to ensure that only authorized individuals have elevated privileges.',
        ig: [0, 1, 1],
      },
      {
        assetType: 'Users',
        title: 'Change Default Passwords',
        desc: 'Before deploying any new asset, change all default passwords to have values consistent with administrative level accounts.',
        ig: [1, 1, 1],
      },
      {
        assetType: 'Users',
        title: 'Ensure the Use of Dedicated Administrative Accounts',
        desc: 'Ensure that all users with administrative account access use a dedicated or secondary account for elevated activities. This account should only be used for administrative activities and not internet browsing, email, or similar activities.',
        ig: [1, 1, 1],
      },
      {
        assetType: 'Users',
        title: 'Use Unique Passwords',
        desc: 'Where multi-factor authentication is not supported (such as local administrator, root, or service accounts), accounts will use passwords that are unique to that system.',
        ig: [0, 1, 1],
      },
      {
        assetType: 'Users',
        title: 'Use Multifactor Authentication For All Administrative Access',
        desc: 'Use multi-factor authentication and encrypted channels for all administrative account access.',
        ig: [0, 1, 1],
      },
      {
        assetType: 'Users',
        title: 'Use of Dedicated Machines For All Administrative Tasks',
        desc: "Ensure administrators use a dedicated machine for all administrative tasks or tasks requiring administrative access. This machine will be segmented from the organization's primary network and not be allowed Internet access. This machine will not be used for reading e-mail, composing documents, or browsing the Internet.",
        ig: [0, 0, 1],
      },
      {
        assetType: 'Users',
        title: 'Limit Access to Script Tools',
        desc: 'Limit access to scripting tools (such as Microsoft PowerShell and Python) to only administrative or development users with the need to access those capabilities.',
        ig: [0, 1, 1],
      },
      {
        assetType: 'Users',
        title: 'Log and Alert on Changes to Administrative Group Membership',
        desc: 'Configure systems to issue a log entry and alert when an account is added to or removed from any group assigned administrative privileges.',
        ig: [0, 1, 1],
      },
      {
        assetType: 'Users',
        title: 'Log and Alert on Unsuccessful Administrative Account Login',
        desc: 'Configure systems to issue a log entry and alert on unsuccessful logins to an administrative account.',
        ig: [0, 1, 1],
      },
    ],
    isIG2IG3Equal: false,
  },
  '5': {
    title:
      'Secure Configuration for Hardware and Software on Mobile Devices, Laptops, Workstations and Servers',
    column:
      'To ensure that attackers cannot exploit vulnerable services and settings, establish, implement, and actively manage (report on, correct) the configuration of mobile devices, laptops, servers, and workstations with a rigorous configuration management and change control process.',
    desc: 'Establish, implement, and actively manage (track, report on, correct) the security configuration of mobile devices, laptops, servers, and workstations using a rigorous configuration management and change control process in order to prevent attackers from exploiting vulnerable services and settings.',
    abbr: 'SCHS',
    safeguards: [
      {
        assetType: 'Applications',
        title: 'Establish Secure Configurations',
        desc: 'Maintain documented, standard security configuration standards for all authorized operating systems and software.',
        ig: [1, 1, 1],
      },
      {
        assetType: 'Applications',
        title: 'Maintain Secure Images',
        desc: "Maintain secure images or templates for all systems in the enterprise based on the organization's approved configuration standards. Any new system deployment or existing system that becomes compromised should be imaged using one of those images or templates.",
        ig: [0, 1, 1],
      },
      {
        assetType: 'Applications',
        title: 'Securely Store Master Images',
        desc: 'Store the master images and templates on securely configured servers, validated with integrity monitoring tools, to ensure that only authorized changes to the images are possible.',
        ig: [0, 1, 1],
      },
      {
        assetType: 'Applications',
        title: 'Deploy System Configuration Management Tools',
        desc: 'Deploy system configuration management tools that will automatically enforce and redeploy configuration settings to systems at regularly scheduled intervals.',
        ig: [0, 1, 1],
      },
      {
        assetType: 'Applications',
        title: 'Implement Automated Configuration Monitoring Systems',
        desc: 'Utilize a Security Content Automation Protocol (SCAP) compliant configuration monitoring system to verify all security configuration elements, catalog approved exceptions, and alert when unauthorized changes occur.',
        ig: [0, 1, 1],
      },
    ],
    isIG2IG3Equal: true,
  },
  '6': {
    title: 'Maintenance, Monitoring and Analysis of Audit Logs',
    column:
      'Manage, collect, and analyze audit logs of events that might provide insights into, or help recover from, an attack.',
    desc: 'Collect, manage, and analyze audit logs of events that could help detect, understand, or recover from an attack.',
    abbr: 'MMAAL',
    safeguards: [
      {
        assetType: 'Network',
        title: 'Utilize Three Synchronized Time Sources',
        desc: 'Use at least three synchronized time sources from which all servers and network devices retrieve time information on a regular basis so that timestamps in logs are consistent.',
        ig: [0, 1, 1],
      },
      {
        assetType: 'Network',
        title: 'Activate audit logging',
        desc: 'Ensure that local logging has been enabled on all systems and networking devices.',
        ig: [1, 1, 1],
      },
      {
        assetType: 'Network',
        title: 'Enable Detailed Logging',
        desc: 'Enable system logging to include detailed information such as a event source, date, user, timestamp, source addresses, destination addresses, and other useful elements.',
        ig: [0, 1, 1],
      },
      {
        assetType: 'Network',
        title: 'Ensure adequate storage for logs',
        desc: 'Ensure that all systems that store logs have adequate storage space for the logs generated.',
        ig: [0, 1, 1],
      },
      {
        assetType: 'Network',
        title: 'Central Log Management',
        desc: 'Ensure that appropriate logs are being aggregated to a central log management system for analysis and review.',
        ig: [0, 1, 1],
      },
      {
        assetType: 'Network',
        title: 'Deploy SIEM or Log Analytic tool',
        desc: 'Deploy Security Information and Event Management (SIEM) or log analytic tool for log correlation and analysis.',
        ig: [0, 1, 1],
      },
      {
        assetType: 'Network',
        title: 'Regularly Review Logs',
        desc: 'On a regular basis, review logs to identify anomalies or abnormal events.',
        ig: [0, 1, 1],
      },
      {
        assetType: 'Network',
        title: 'Regularly Tune SIEM',
        desc: 'On a regular basis, tune your SIEM system to better identify actionable events and decrease event noise.',
        ig: [0, 0, 1],
      },
    ],
    isIG2IG3Equal: false,
  },
  '7': {
    title: 'Email and Web Browser Protections',
    column:
      'Reduce the attack surface and the chance of attackers manipulating human behavior through their interaction with web browsers and email systems.',
    desc: 'Minimize the attack surface and the opportunities for attackers to manipulate human behavior though their interaction with web browsers and email systems.',
    abbr: 'EWBP',
    safeguards: [
      {
        assetType: 'Applications',
        title: 'Ensure Use of Only Fully Supported Browsers and Email Clients',
        desc: 'Ensure that only fully supported web browsers and email clients are allowed to execute in the organization, ideally only using the latest version of the browsers and email clients provided by the vendor.',
        ig: [1, 1, 1],
      },
      {
        assetType: 'Applications',
        title:
          'Disable Unnecessary or Unauthorized Browser or Email Client Plugins',
        ig: [0, 1, 1],
        desc: 'Uninstall or disable any unauthorized browser or email client plugins or add-on applications.',
      },
      {
        assetType: 'Applications',
        title:
          'Limit Use of Scripting Languages in Web Browsers and Email Clients',
        ig: [0, 1, 1],
        desc: 'Ensure that only authorized scripting languages are able to run in all web browsers and email clients.',
      },
      {
        assetType: 'Network',
        title: 'Maintain and Enforce Network-Based URL Filters',
        desc: "Enforce network-based URL filters that limit a system's ability to connect to websites not approved by the organization. This filtering shall be enforced for each of the organization's systems, whether they are physically at an organization's facilities or not.",
        ig: [0, 1, 1],
      },
      {
        assetType: 'Network',
        title: 'Subscribe to URL-Categorization Service',
        desc: 'Subscribe to URL categorization services to ensure that they are up-to-date with the most recent website category definitions available. Uncategorized sites shall be blocked by default.',
        ig: [0, 1, 1],
      },
      {
        assetType: 'Network',
        title: 'Log all URL requester',
        desc: "Log all URL requests from each of the organization's systems, whether on-site or a mobile device, in order to identify potentially malicious activity and assist incident handlers with identifying potentially compromised systems.",
        ig: [0, 1, 1],
      },
      {
        assetType: 'Network',
        title: 'Use of DNS Filtering Services',
        desc: 'Use DNS filtering services to help block access to known malicious domains.',
        ig: [1, 1, 1],
      },
      {
        assetType: 'Network',
        title: 'Implement DMARC and Enable Receiver-Side Verification',
        desc: 'To lower the chance of spoofed or modified emails from valid domains, implement Domain-based Message Authentication, Reporting and Conformance (DMARC) policy and verification, starting by implementing the Sender Policy Framework (SPF) and the Domain Keys Identified Mail(DKIM) standards.',
        ig: [0, 1, 1],
      },
      {
        assetType: 'Network',
        title: 'Block Unnecessary File Types',
        desc: "Block all e-mail attachments entering the organization's email gateway if the file types are unnecessary for the organization's business.",
        ig: [0, 1, 1],
      },
      {
        assetType: 'Network',
        title: 'Sandbox All Email Attachments',
        desc: 'Use sandboxing to analyze and block inbound email attachments with malicious behavior.',
        ig: [0, 0, 1],
      },
    ],
    isIG2IG3Equal: false,
  },
  '8': {
    title: 'Malware Defenses',
    column:
      'Control the installation, spread, and execution of malicious code across multiple points within an enterprise, leveraging automation to enable rapid defense updates, data gathering, and a swift response.',
    desc: 'Control the installation, spread, and execution of malicious code at multiple points in the enterprise, while optimizing the use of automation to enable rapid updating of defense, data gathering, and corrective action.',
    abbr: 'MD',
    safeguards: [
      {
        assetType: 'Devices',
        title: 'Utilize Centrally Managed Anti-malware Software',
        desc: "Utilize centrally managed anti-malware software to continuously monitor and defend each of the organization's workstations and servers.",
        ig: [0, 1, 1],
      },
      {
        assetType: 'Devices',
        title: 'Ensure Anti-Malware Software and Signatures are Updated',
        desc: "Ensure that the organization's anti-malware software updates its scanning engine and signature database on a regular basis.",
        ig: [1, 1, 1],
      },
      {
        assetType: 'Devices',
        title:
          'Enable Operating System Anti-Exploitation Features/ Deploy Anti-Exploit Technologies',
        ig: [0, 1, 1],
        desc: 'Enable anti-exploitation features such as Data Execution Prevention (DEP) or Address Space Layout Randomization (ASLR) that are available in an operating system or deploy appropriate toolkits that can be configured to apply protection to a broader set of applications and executables.',
      },
      {
        assetType: 'Devices',
        title: 'Configure Anti-Malware Scanning of Removable Devices',
        desc: 'Configure devices so that they automatically conduct an anti-malware scan of removable media when inserted or connected.',
        ig: [1, 1, 1],
      },
      {
        assetType: 'Devices',
        title: 'Configure Devices Not To Auto-Run Content',
        desc: 'Configure devices to not auto-run content from removable media.',
        ig: [1, 1, 1],
      },
      {
        assetType: 'Devices',
        title: 'Centralize Anti-Malware Logging',
        desc: 'Send all malware detection events to enterprise anti-malware administration tools and event log servers for analysis and alerting.',
        ig: [0, 1, 1],
      },
      {
        assetType: 'Network',
        title: 'Enable DNS Query Logging',
        desc: 'Enable Domain Name System (DNS) query logging to detect hostname lookups for known malicious domains.',
        ig: [0, 1, 1],
      },
      {
        assetType: 'Devices',
        title: 'Enable Command-Line Audit Logging',
        desc: 'Enable command-line audit logging for command shells, such as Microsoft PowerShell and Bash.',
        ig: [0, 1, 1],
      },
    ],
    isIG2IG3Equal: true,
  },
  '9': {
    title: 'Limitation and Control of Network Ports, Protocols, and Services',
    column:
      'Manage (track/control/correct) the ongoing operational use of ports, protocols, and networked services in order to minimize the windows of vulnerability in which attackers can exploit.',
    desc: 'Manage (track/control/correct) the ongoing operational use of ports, protocols, and services on networked devices in order to minimize windows of vulnerability available to attackers.',
    abbr: 'LCNPPS',
    safeguards: [
      {
        assetType: 'Devices',
        title:
          'Associate Active Ports, Services and Protocols to Asset Inventory',
        ig: [0, 1, 1],
        desc: 'Associate active ports, services and protocols to the hardware assets in the asset inventory.',
      },
      {
        assetType: 'Devices',
        title: 'Ensure Only Approved Ports, Protocols and Services Are Running',
        desc: 'Ensure that only network ports, protocols, and services listening on a system with validated business needs are running on each system.',
        ig: [0, 1, 1],
      },
      {
        assetType: 'Devices',
        title: 'Perform Regular Automated Port Scans',
        desc: 'Perform automated port scans on a regular basis against all systems and alert if unauthorized ports are detected on a system.',
        ig: [0, 1, 1],
      },
      {
        assetType: 'Devices',
        title: 'Apply Host-Based Firewalls or Port Filtering',
        desc: 'Apply host-based firewalls or port filtering tools on end systems, with a default-deny rule that drops all traffic except those services and ports that are explicitly allowed.',
        ig: [1, 1, 1],
      },
      {
        assetType: 'Devices',
        title: 'Implement Application Firewalls',
        desc: 'Place application firewalls in front of any critical servers to verify and validate the traffic going to the server. Any unauthorized traffic should be blocked and logged.',
        ig: [0, 0, 1],
      },
    ],
    isIG2IG3Equal: false,
  },
  '10': {
    title: 'Data Recovery Capabilities',
    column:
      'Backup procedures and tools are used in conjunction with a proven methodology to ensure timely recovery of critical data.',
    desc: 'The processes and tools used to properly back up critical information with a proven methodology for timely recovery of it.',
    abbr: 'DRC',
    safeguards: [
      {
        assetType: 'Data',
        title: 'Ensure Regular Automated BackUps',
        desc: 'Ensure that all system data is automatically backed up on a regular basis.',
        ig: [1, 1, 1],
      },
      {
        assetType: 'Data',
        title: 'Perform Complete System Backups',
        desc: "Ensure that all of the organization's key systems are backed up as a complete system, through processes such as imaging, to enable the quick recovery of an entire system.",
        ig: [1, 1, 1],
      },
      {
        assetType: 'Data',
        title: 'Test Data on Backup Media',
        desc: 'Test data integrity on backup media on a regular basis by performing a data restoration process to ensure that the backup is properly working.',
        ig: [0, 1, 1],
      },
      {
        assetType: 'Data',
        title: 'Ensure Protection of Backups',
        desc: 'Ensure that backups are properly protected via physical security or encryption when they are stored, as well as when they are moved across the network. This includes remote backups and cloud services.',
        ig: [1, 1, 1],
      },
      {
        assetType: 'Data',
        title:
          'Ensure Backups Have At least One Non-Continuously Addressable Destination',
        ig: [1, 1, 1],
        desc: 'Ensure that all backups have at least one backup destination that is not continuously addressable through operating system calls.',
      },
    ],
    isIG2IG3Equal: true,
  },
  '11': {
    title:
      'Secure Configuration for Network Devices, such as Firewalls, Routers and Switches',
    column:
      'Implement a rigorous configuration management process and change control procedure to establish, implement, track, and actively manage (report on, correct) the security configuration of network infrastructure devices in order to prevent attackers from exploiting vulnerable services and settings.',
    desc: 'Establish, implement, and actively manage (track, report on, correct) the security configuration of network infrastructure devices using a rigorous configuration management and change control process in order to prevent attackers from exploiting vulnerable services and settings.',
    abbr: 'SCND',
    safeguards: [
      {
        assetType: 'Network',
        title: 'Maintain Standard Security Configurations for Network Devices',
        desc: 'Maintain standard, documented security configuration standards for all authorized network devices.',
        ig: [0, 1, 1],
      },
      {
        assetType: 'Network',
        title: 'Document Traffic Configuration Rules',
        desc: 'All configuration rules that allow traffic to flow through network devices should be documented in a configuration management system with a specific business reason for each rule, a specific individual’s name responsible for that business need, and an expected duration of the need.',
        ig: [0, 1, 1],
      },
      {
        assetType: 'Network',
        title:
          'Use Automated Tools to Verify Standard Device Configurations and Detect Changes',
        ig: [0, 1, 1],
        desc: 'Compare all network device configuration against approved security configurations defined for each network device in use and alert when any deviations are discovered.',
      },
      {
        assetType: 'Network',
        title:
          'Install the Latest Stable Version of Any Security-Related Updates on All Network Devices',
        ig: [1, 1, 1],
        desc: 'Install the latest stable version of any security-related updates on all network devices.',
      },
      {
        assetType: 'Network',
        title:
          'Manage Network Devices Using Multi-Factor Authentication and Encrypted Sessions',
        ig: [0, 1, 1],
        desc: 'Manage all network devices using multi-factor authentication and encrypted sessions.',
      },
      {
        assetType: 'Network',
        title: 'Use Dedicated Machines For All Network Administrative Tasks',
        desc: "Ensure network engineers use a dedicated machine for all administrative tasks or tasks requiring elevated access. This machine shall be segmented from the organization's primary network and not be allowed Internet access. This machine shall not be used for reading e-mail, composing documents, or surfing the Internet.",
        ig: [0, 1, 1],
      },
      {
        assetType: 'Network',
        title: 'Manage Network Infrastructure Through a Dedicated Network',
        desc: 'Manage the network infrastructure across network connections that are separated from the business use of that network, relying on separate VLANs or, preferably, on entirely different physical connectivity for management sessions for network devices.',
        ig: [0, 1, 1],
      },
    ],
    isIG2IG3Equal: true,
  },
  '12': {
    title: 'Boundary Defense',
    column:
      'Detect, prevent, or correct the flow of information transferring networks of different trust levels in order to prevent security breaches.',
    desc: 'Detect/prevent/correct the flow of information transferring networks of different trust levels with a focus on security-damaging data.',
    abbr: 'BD',
    safeguards: [
      {
        assetType: 'Network',
        title: 'Maintain an Inventory of Network Boundaries',
        desc: "Maintain an up-to-date inventory of all of the organization's network boundaries.",
        ig: [1, 1, 1],
      },
      {
        assetType: 'Network',
        title:
          'Scan for Unauthorized Connections across Trusted Network Boundaries',
        ig: [0, 1, 1],
        desc: 'Perform regular scans from outside each trusted network boundary to detect any unauthorized connections which are accessible across the boundary.',
      },
      {
        assetType: 'Network',
        title: 'Deny Communications with Known Malicious IP Addresses',
        desc: "Deny communications with known malicious or unused Internet IP addresses and limit access only to trusted and necessary IP address ranges at each of the organization's network boundaries,.",
        ig: [0, 1, 1],
      },
      {
        assetType: 'Network',
        title: 'Deny Communication over Unauthorized Ports',
        desc: "Deny communication over unauthorized TCP or UDP ports or application traffic to ensure that only authorized protocols are allowed to cross the network boundary in or out of the network at each of the organization's network boundaries.",
        ig: [1, 1, 1],
      },
      {
        assetType: 'Network',
        title: 'Configure Monitoring Systems to Record Network Packets',
        desc: "Configure monitoring systems to record network packets passing through the boundary at each of the organization's network boundaries.",
        ig: [0, 1, 1],
      },
      {
        assetType: 'Network',
        title: 'Deploy Network-Based IDS Sensors',
        desc: "Deploy network-based Intrusion Detection Systems (IDS) sensors to look for unusual attack mechanisms and detect compromise of these systems at each of the organization's network boundaries.",
        ig: [0, 1, 1],
      },
      {
        assetType: 'Network',
        title: 'Deploy Network-Based Intrusion Prevention Systems',
        desc: "Deploy network-based Intrusion Prevention Systems (IPS) to block malicious network traffic at each of the organization's network boundaries.",
        ig: [0, 0, 1],
      },
      {
        assetType: 'Network',
        title: 'Deploy NetFlow Collection on Networking Boundary Devices',
        desc: 'Enable the collection of NetFlow and logging data on all network boundary devices.',
        ig: [0, 1, 1],
      },
      {
        assetType: 'Network',
        title: 'Deploy Application Layer Filtering Proxy Server',
        desc: 'Ensure that all network traffic to or from the Internet passes through an authenticated application layer proxy that is configured to filter unauthorized connections.',
        ig: [0, 0, 1],
      },
      {
        assetType: 'Network',
        title: 'Decrypt Network Traffic at Proxy',
        desc: 'Decrypt all encrypted network traffic at the boundary proxy prior to analyzing the content. However, the organization may use whitelists of allowed sites that can be accessed through the proxy without decrypting the traffic.',
        ig: [0, 0, 1],
      },
      {
        assetType: 'Users',
        title: 'Require All Remote Login to Use Multi-Factor Authentication',
        desc: "Require all remote login access to the organization's network to encrypt data in transit and use multi-factor authentication.",
        ig: [0, 1, 1],
      },
      {
        assetType: 'Devices',
        title: 'Manage All Devices Remotely Logging into Internal Network',
        desc: "Scan all enterprise devices remotely logging into the organization's network prior to accessing the network to ensure that each of the organization's security policies has been enforced in the same manner as local network devices.",
        ig: [0, 0, 1],
      },
    ],
    isIG2IG3Equal: false,
  },
  '13': {
    title: 'Data Protection',
    column:
      'Processes and tools for preventing data exfiltration, mitigating the effects of exfiltrated data, and ensuring the privacy and integrity of sensitive information.',
    desc: 'The processes and tools used to prevent data exfiltration, mitigate the effects of exfiltrated data, and ensure the privacy and integrity of sensitive information.',
    abbr: 'DP',
    safeguards: [
      {
        assetType: 'Data',
        title: 'Maintain an Inventory of Sensitive Information',
        desc: "Maintain an inventory of all sensitive information stored, processed, or transmitted by the organization's technology systems, including those located on-site or at a remote service provider.",
        ig: [1, 1, 1],
      },
      {
        assetType: 'Data',
        title:
          'Remove Sensitive Data or Systems Not Regularly Accessed by Organization',
        desc: 'Remove sensitive data or systems not regularly accessed by the organization from the network. These systems shall only be used as stand alone systems (disconnected from the network) by the business unit needing to occasionally use the system or completely virtualized and powered off until needed.',
        ig: [1, 1, 1],
      },
      {
        assetType: 'Data',
        title: 'Monitor and Block Unauthorized Network Traffic',
        desc: 'Deploy an automated tool on network perimeters that monitors for unauthorized transfer of sensitive information and blocks such transfers while alerting information security professionals.',
        ig: [0, 0, 1],
      },
      {
        assetType: 'Data',
        title:
          'Only Allow Access to Authorized Cloud Storage or Email Providers',
        desc: 'Only allow access to authorized cloud storage or email providers.',
        ig: [0, 1, 1],
      },
      {
        assetType: 'Data',
        title: 'Monitor and Detect Any Unauthorized Use of Encryption',
        desc: 'Monitor all traffic leaving the organization and detect any unauthorized use of encryption.',
        ig: [0, 0, 1],
      },
      {
        assetType: 'Data',
        title: 'Encrypt the Hard Drive of All Mobile Devices.',
        desc: 'Utilize approved whole disk encryption software to encrypt the hard drive of all mobile devices.',
        ig: [1, 1, 1],
      },
      {
        assetType: 'Data',
        title: 'Manage USB Devices',
        desc: 'If USB storage devices are required, enterprise software should be used that can configure systems to allow the use of specific devices. An inventory of such devices should be maintained.',
        ig: [0, 1, 1],
      },
      {
        assetType: 'Data',
        title:
          "Manage System's External Removable Media's Read/Write Configurations",
        desc: 'Configure systems not to write data to external removable media, if there is no business need for supporting such devices.',
        ig: [0, 0, 1],
      },
      {
        assetType: 'Data',
        title: 'Encrypt Data on USB Storage Devices',
        desc: 'If USB storage devices are required, all data stored on such devices must be encrypted while at rest.',
        ig: [0, 0, 1],
      },
    ],
    isIG2IG3Equal: false,
  },
  '14': {
    title: 'Controlled Access Based on the Need to Know',
    column:
      'Performing processes and deploying tools to ensure secure access to critical assets (e.g., information, resources, and systems) on the basis of the formal determination of which individuals, computers, and applications have a need and a right to access those critical assets based on an approved classification.',
    desc: 'The processes and tools used to track/control/prevent/correct secure access to critical assets (e.g., information, resources, systems) according to the formal determination of which persons, computers, and applications have a need and right to access these critical assets based on an approved classification.',
    abbr: 'CAB',
    safeguards: [
      {
        assetType: 'Network',
        title: 'Segment the Network Based on Sensitivity',
        desc: 'Segment the network based on the label or classification level of the information stored on the servers, locate all sensitive information on separated Virtual Local Area Networks (VLANs).',
        ig: [0, 1, 1],
      },
      {
        assetType: 'Network',
        title: 'Enable Firewall Filtering Between VLANs',
        desc: 'Enable firewall filtering between VLANs to ensure that only authorized systems are able to communicate with other systems necessary to fulfill their specific responsibilities.',
        ig: [0, 1, 1],
      },
      {
        assetType: 'Network',
        title: 'Disable Workstation to Workstation Communication',
        desc: "Disable all workstation to workstation communication to limit an attacker's ability to move laterally and compromise neighboring systems, through technologies such as Private VLANs or micro segmentation.",
        ig: [0, 1, 1],
      },
      {
        assetType: 'Data',
        title: 'Encrypt All Sensitive Information in Transit',
        desc: 'Encrypt all sensitive information in transit.',
        ig: [0, 1, 1],
      },
      {
        assetType: 'Data',
        title: 'Utilize an Active Discovery Tool to Identify Sensitive Data',
        desc: "Utilize an active discovery tool to identify all sensitive information stored, processed, or transmitted by the organization's technology systems, including those located on-site or at a remote service provider, and update the organization's sensitive information inventory.",
        ig: [0, 0, 1],
      },
      {
        assetType: 'Data',
        title: 'Protect Information through Access Control Lists',
        desc: 'Protect all information stored on systems with file system, network share, claims, application, or database specific access control lists. These controls will enforce the principle that only authorized individuals should have access to the information based on their need to access the information as a part of their responsibilities.',
        ig: [1, 1, 1],
      },
      {
        assetType: 'Data',
        title: 'Enforce Access Control to Data through Automated Tools',
        desc: 'Use an automated tool, such as host-based Data Loss Prevention, to enforce access controls to data even when data is copied off a system.',
        ig: [0, 0, 1],
      },
      {
        assetType: 'Data',
        title: 'Encrypt Sensitive Information at Rest',
        desc: 'Encrypt all sensitive information at rest using a tool that requires a secondary authentication mechanism not integrated into the operating system, in order to access the information.',
        ig: [0, 0, 1],
      },
      {
        assetType: 'Data',
        title: 'Enforce Detail Logging for Access or Changes to Sensitive Data',
        desc: 'Enforce detailed audit logging for access to sensitive data or changes to sensitive data (utilizing tools such as File Integrity Monitoring or Security Information and Event Monitoring).',
        ig: [0, 0, 1],
      },
    ],
    isIG2IG3Equal: false,
  },
  '15': {
    title: 'Wireless Access Control',
    column:
      'Processes and tools for tracking, controlling, preventing, or correcting the security of wireless local area networks (WLANs), access points, or wireless client systems.',
    desc: 'The processes and tools used to track/control/prevent/correct the security use of wireless local area networks (WLANs), access points, and wireless client systems.',
    abbr: 'WAC',
    safeguards: [
      {
        assetType: 'Network',
        title: 'Maintain an Inventory of Authorized Wireless Access Points',
        desc: 'Maintain an inventory of authorized wireless access points connected to the wired network.',
        ig: [0, 1, 1],
      },
      {
        assetType: 'Network',
        title: 'Detect Wireless Access Points Connected to the Wired Network',
        desc: 'Configure network vulnerability scanning tools to detect and alert on unauthorized wireless access points connected to the wired network.',
        ig: [0, 1, 1],
      },
      {
        assetType: 'Network',
        title: 'Use a Wireless Intrusion Detection System',
        desc: 'Use a wireless intrusion detection system (WIDS) to detect and alert on unauthorized wireless access points connected to the network.',
        ig: [0, 1, 1],
      },
      {
        assetType: 'Devices',
        title: 'Disable Wireless Access on Devices if Not Required',
        desc: 'Disable wireless access on devices that do not have a business purpose for wireless access.',
        ig: [0, 0, 1],
      },
      {
        assetType: 'Devices',
        title: 'Limit Wireless Access on Client Devices',
        desc: 'Configure wireless access on client machines that do have an essential wireless business purpose, to allow access only to authorized wireless networks and to restrict access to other wireless networks.',
        ig: [0, 0, 1],
      },
      {
        assetType: 'Devices',
        title:
          'Disable Peer-to-Peer Wireless Network Capabilities on Wireless Clients',
        desc: 'Disable peer-to-peer (ad hoc) wireless network capabilities on wireless clients.',
        ig: [0, 1, 1],
      },
      {
        assetType: 'Network',
        title:
          'Leverage the Advanced Encryption Standard (AES) to Encrypt Wireless Data',
        desc: 'Leverage the Advanced Encryption Standard (AES) to encrypt wireless data in transit.',
        ig: [1, 1, 1],
      },
      {
        assetType: 'Network',
        title:
          'Use Wireless Authentication Protocols that Require Mutual, Multi-Factor Authentication',
        desc: 'Ensure that wireless networks use authentication protocols such as Extensible Authentication Protocol-Transport Layer Security (EAP/TLS), which requires mutual, multi-factor authentication.',
        ig: [0, 0, 1],
      },
      {
        assetType: 'Devices',
        title: 'Disable Wireless Peripheral Access of Devices',
        desc: 'Disable wireless peripheral access of devices (such as Bluetooth and NFC), unless such access is required for a business purpose.',
        ig: [0, 1, 1],
      },
      {
        assetType: 'Network',
        title:
          'Create Separate Wireless Network for Personal and Untrusted Devices',
        desc: 'Create a separate wireless network for personal or untrusted devices. Enterprise access from this network should be treated as untrusted and filtered and audited accordingly.',
        ig: [1, 1, 1],
      },
    ],
    isIG2IG3Equal: false,
  },
  '16': {
    title: 'Account Monitoring and Control',
    column:
      'Maintain an active control over system and application accounts - their creation, use, dormancy, and deletion - to minimize the opportunities for attackers to leverage them.',
    desc: 'Actively manage the life cycle of system and application accounts - their creation, use, dormancy, deletion - in order to minimize opportunities for attackers to leverage them.',
    abbr: 'AMC',
    safeguards: [
      {
        assetType: 'Users',
        title: 'Maintain an Inventory of Authentication Systems',
        desc: "Maintain an inventory of each of the organization's authentication systems, including those located on-site or at a remote service provider.",
        ig: [0, 1, 1],
      },
      {
        assetType: 'Users',
        title: 'Configure Centralized Point of Authentication',
        desc: 'Configure access for all accounts through as few centralized points of authentication as possible, including network, security, and cloud systems.',
        ig: [0, 1, 1],
      },
      {
        assetType: 'Users',
        title: 'Require Multi-Factor Authentication',
        desc: 'Require multi-factor authentication for all user accounts, on all systems, whether managed on-site or by a third-party provider.',
        ig: [0, 1, 1],
      },
      {
        assetType: 'Users',
        title: 'Encrypt or Hash all Authentication Credentials',
        desc: 'Encrypt or hash with a salt all authentication credentials when stored.',
        ig: [0, 1, 1],
      },
      {
        assetType: 'Users',
        title: 'Encrypt Transmittal of Username and Authentication Credentials',
        desc: 'Ensure that all account usernames and authentication credentials are transmitted across networks using encrypted channels.',
        ig: [0, 1, 1],
      },
      {
        assetType: 'Users',
        title: 'Maintain an Inventory of Accounts',
        desc: 'Maintain an inventory of all accounts organized by authentication system.',
        ig: [0, 1, 1],
      },
      {
        assetType: 'Users',
        title: 'Establish Process for Revoking Access',
        desc: 'Establish and follow an automated process for revoking system access by disabling accounts immediately upon termination or change of responsibilities of an employee or contractor . Disabling these accounts, instead of deleting accounts, allows preservation of audit trails.',
        ig: [0, 1, 1],
      },
      {
        assetType: 'Users',
        title: 'Disable Any Unassociated Accounts',
        desc: 'Disable any account that cannot be associated with a business process or business owner.',
        ig: [1, 1, 1],
      },
      {
        assetType: 'Users',
        title: 'Disable Dormant Accounts',
        desc: 'Automatically disable dormant accounts after a set period of inactivity.',
        ig: [1, 1, 1],
      },
      {
        assetType: 'Users',
        title: 'Ensure All Accounts Have An Expiration Date',
        desc: 'Ensure that all accounts have an expiration date that is monitored and enforced.',
        ig: [0, 1, 1],
      },
      {
        assetType: 'Users',
        title: 'Lock Workstation Sessions After Inactivity',
        desc: 'Automatically lock workstation sessions after a standard period of inactivity.',
        ig: [1, 1, 1],
      },
      {
        assetType: 'Users',
        title: 'Monitor Attempts to Access Deactivated Accounts',
        desc: 'Monitor attempts to access deactivated accounts through audit logging.',
        ig: [0, 1, 1],
      },
      {
        assetType: 'Users',
        title: 'Alert on Account Login Behavior Deviation',
        desc: 'Alert when users deviate from normal login behavior, such as time-of-day, workstation location and duration.',
        ig: [0, 0, 1],
      },
    ],
    isIG2IG3Equal: false,
  },
  '17': {
    title: 'Implement a Security Awareness and Training Program',
    column:
      'Determine which knowledge, skills, and abilities are needed to support the defense of the enterprise for all functional roles within the organization (focusing on those that are mission-critical to the business and its security); develop and implement an integrated plan to assess, identify gaps, and remediate through policy, organizational planning, training, and awareness programs.',
    desc: 'For all functional roles in the organization (prioritizing those mission-critical to the business and its security), identify the specific knowledge, skills and abilities needed to support defense of the enterprise; develop and execute an integrated plan to assess, identify gaps, and remediate through policy, organizational planning, training, and awareness programs.',
    abbr: 'ISA',
    safeguards: [
      {
        assetType: 'N/A',
        title: 'Perform a Skills Gap Analysis',
        desc: 'Perform a skills gap analysis to understand the skills and behaviors workforce members are not adhering to, using this information to build a baseline education roadmap.',
        ig: [0, 1, 1],
      },
      {
        assetType: 'N/A',
        title: 'Deliver Training to Fill the Skills Gap',
        desc: "Deliver training to address the skills gap identified to positively impact workforce members' security behavior.",
        ig: [0, 1, 1],
      },
      {
        assetType: 'N/A',
        title: 'Implement a Security Awareness Program',
        desc: "Create a security awareness program for all workforce members to complete on a regular basis to ensure they understand and exhibit the necessary behaviors and skills to help ensure the security of the organization. The organization's security awareness program should be communicated in a continuous and engaging manner.",
        ig: [1, 1, 1],
      },
      {
        assetType: 'N/A',
        title: 'Update Awareness Content Frequently',
        desc: "Ensure that the organization's security awareness program is updated frequently (at least annually) to address new technologies, threats, standards and business requirements.",
        ig: [0, 1, 1],
      },
      {
        assetType: 'N/A',
        title: 'Train Workforce on Secure Authentication',
        desc: 'Train workforce members on the importance of enabling and utilizing secure authentication.',
        ig: [1, 1, 1],
      },
      {
        assetType: 'N/A',
        title: 'Train Workforce on Identifying Social Engineering Attacks',
        desc: 'Train the workforce on how to identify different forms of social engineering attacks, such as phishing, phone scams and impersonation calls.',
        ig: [1, 1, 1],
      },
      {
        assetType: 'N/A',
        title: 'Train Workforce on Sensitive Data Handling',
        desc: 'Train workforce on how to identify and properly store, transfer, archive and destroy sensitive information.',
        ig: [1, 1, 1],
      },
      {
        assetType: 'N/A',
        title: 'Train Workforce on Causes of Unintentional Data Exposure',
        desc: 'Train workforce members to be aware of causes for unintentional data exposures, such as losing their mobile devices or emailing the wrong person due to autocomplete in email.',
        ig: [1, 1, 1],
      },
      {
        assetType: 'N/A',
        title: 'Train Workforce Members on Identifying and Reporting Incidents',
        desc: 'Train employees to be able to identify the most common indicators of an incident and be able to report such an incident.',
        ig: [1, 1, 1],
      },
    ],
    isIG2IG3Equal: true,
  },
  '18': {
    title: 'Application Software Security',
    column:
      'Maintain the security life cycle of all in-house developed and acquired software so as to prevent, detect, and correct security weaknesses.',
    desc: 'Manage the security life cycle of all in-house developed and acquired software in order to prevent, detect, and correct security weaknesses.',
    abbr: 'ASS',
    safeguards: [
      {
        assetType: 'N/A',
        title: 'Establish Secure Coding Practices',
        desc: 'Establish secure coding practices appropriate to the programming language and development environment being used.',
        ig: [0, 1, 1],
      },
      {
        assetType: 'N/A',
        title:
          'Ensure Explicit Error Checking is Performed for All In-House Developed Software',
        desc: 'For in-house developed software, ensure that explicit error checking is performed and documented for all input, including for size, data type, and acceptable ranges or formats.',
        ig: [0, 1, 1],
      },
      {
        assetType: 'N/A',
        title: 'Verify That Acquired Software is Still Supported',
        desc: 'Verify that the version of all software acquired from outside your organization is still supported by the developer or appropriately hardened based on developer security recommendations.',
        ig: [0, 1, 1],
      },
      {
        assetType: 'N/A',
        title: 'Only Use Up-to-Date And Trusted Third-Party Components',
        desc: 'Only use up-to-date and trusted third-party components for the software developed by the organization.',
        ig: [0, 0, 1],
      },
      {
        assetType: 'N/A',
        title:
          'Use Only Standardized and Extensively Reviewed Encryption Algorithms',
        desc: 'Use only standardized and extensively reviewed encryption algorithms.',
        ig: [0, 1, 1],
      },
      {
        assetType: 'N/A',
        title:
          'Ensure Software Development Personnel are Trained in Secure Coding',
        desc: 'Ensure that all software development personnel receive training in writing secure code for their specific development environment and responsibilities.',
        ig: [0, 1, 1],
      },
      {
        assetType: 'N/A',
        title: 'Apply Static and Dynamic Code Analysis Tools',
        desc: 'Apply static and dynamic analysis tools to verify that secure coding practices are being adhered to for internally developed software.',
        ig: [0, 1, 1],
      },
      {
        assetType: 'N/A',
        title:
          'Establish a Process to Accept and Address Reports of Software Vulnerabilities',
        desc: 'Establish a process to accept and address reports of software vulnerabilities, including providing a means for external entities to contact your security group.',
        ig: [0, 1, 1],
      },
      {
        assetType: 'N/A',
        title: 'Separate Production and Non-Production Systems',
        desc: 'Maintain separate environments for production and non-production systems. Developers should not have unmonitored access to production environments.',
        ig: [0, 1, 1],
      },
      {
        assetType: 'N/A',
        title: 'Deploy Web Application Firewalls (WAFs)',
        desc: 'Protect web applications by deploying web application firewalls (WAFs) that inspect all traffic flowing to the web application for common web application attacks. For applications that are not web-based, specific application firewalls should be deployed if such tools are available for the given application type. If the traffic is encrypted, the device should either sit behind the encryption or be capable of decrypting the traffic prior to analysis. If neither option is appropriate, a host-based web application firewall should be deployed.',
        ig: [0, 1, 1],
      },
      {
        assetType: 'N/A',
        title: 'Use Standard Hardening Configuration Templates for Databases',
        desc: 'For applications that rely on a database, use standard hardening configuration templates. All systems that are part of critical business processes should also be tested.',
        ig: [0, 1, 1],
      },
    ],
    isIG2IG3Equal: false,
  },
  '19': {
    title: 'Incident Response and Management',
    column:
      "The organization's information and reputation can be safeguarded by developing and implementing an incident response infrastructure (e.g., plans, defined roles, training, communications, management oversight) that enables it to detect and contain an attack quickly, eliminate the attacker, and restore the integrity of its network and systems.",
    desc: "Protect the organization's information, as well as its reputation, by developing and implementing an incident response infrastructure (e.g., plans, defined roles, training, communications, management oversight) for quickly discovering an attack and then effectively containing the damage, eradicating the attacker's presence, and restoring the integrity of the network and systems.",
    abbr: 'IRM',
    safeguards: [
      {
        assetType: 'N/A',
        title: 'Document Incident Response Procedures',
        desc: 'Ensure that there are written incident response plans that define roles of personnel as well as phases of incident handling/management.',
        ig: [1, 1, 1],
      },
      {
        assetType: 'N/A',
        title: 'Assign Job Titles and Duties for Incident Response',
        desc: 'Assign job titles and duties for handling computer and network incidents to specific individuals and ensure tracking and documentation throughout the incident through resolution.',
        ig: [0, 1, 1],
      },
      {
        assetType: 'N/A',
        title: 'Designate Management Personnel to Support Incident Handling',
        desc: 'Designate management personnel, as well as backups, who will support the incident handling process by acting in key decision-making roles.',
        ig: [1, 1, 1],
      },
      {
        assetType: 'N/A',
        title: 'Devise Organization-wide Standards for Reporting Incidents',
        desc: 'Devise organization-wide standards for the time required for system administrators and other workforce members to report anomalous events to the incident handling team, the mechanisms for such reporting, and the kind of information that should be included in the incident notification.',
        ig: [0, 1, 1],
      },
      {
        assetType: 'N/A',
        title: 'Maintain Contact Information For Reporting Security Incidents',
        desc: 'Assemble and maintain information on third-party contact information to be used to report a security incident, such as Law Enforcement, relevant government departments, vendors, and ISAC partners.',
        ig: [1, 1, 1],
      },
      {
        assetType: 'N/A',
        title:
          'Publish Information Regarding Reporting Computer Anomalies and Incidents',
        desc: 'Publish information for all workforce members, regarding reporting computer anomalies and incidents to the incident handling team. Such information should be included in routine employee awareness activities.',
        ig: [1, 1, 1],
      },
      {
        assetType: 'N/A',
        title: 'Conduct Periodic Incident Scenario Sessions for Personnel',
        desc: 'Plan and conduct routine incident, response exercises and scenarios for the workforce involved in the incident response to maintain awareness and comfort in responding to real world threats. Exercises should test communication channels, decision making, and incident responders technical capabilities using tools and data available to them.',
        ig: [0, 1, 1],
      },
      {
        assetType: 'N/A',
        title: 'Create Incident Scoring and Prioritization Schema',
        desc: 'Create incident scoring and prioritization schema based on known or potential impact to your organization. Utilize score to define frequency of status updates and escalation procedures.',
        ig: [0, 0, 1],
      },
    ],
    isIG2IG3Equal: false,
  },
  '20': {
    title: 'Penetration Tests and Red Team Exercises',
    column:
      "Assess the overall defense strength of an organization (the people, the processes, and the technology) by simulating an attacker's objectives and actions.",
    desc: "Test the overall strength of an organization's defense (the technology, the processes, and the people) by simulating the objectives and actions of an attacker.",
    abbr: 'PTRT',
    safeguards: [
      {
        assetType: 'N/A',
        title: 'Establish a Penetration Testing Program',
        desc: 'Establish a program for penetration tests that includes a full scope of blended attacks, such as wireless, client-based, and web application attacks.',
        ig: [0, 1, 1],
      },
      {
        assetType: 'N/A',
        title: 'Conduct Regular External and Internal Penetration Tests',
        desc: 'Conduct regular external and internal penetration tests to identify vulnerabilities and attack vectors that can be used to exploit enterprise systems successfully.',
        ig: [0, 1, 1],
      },
      {
        assetType: 'N/A',
        title: 'Perform Periodic Red Team Exercises',
        desc: 'Perform periodic Red Team exercises to test organizational readiness to identify and stop attacks or to respond quickly and effectively.',
        ig: [0, 0, 1],
      },
      {
        assetType: 'N/A',
        title:
          'Include Tests for Presence of Unprotected System Information and Artifacts',
        desc: 'Include tests for the presence of unprotected system information and artifacts that would be useful to attackers, including network diagrams, configuration files, older penetration test reports, e-mails or documents containing passwords or other information critical to system operation.',
        ig: [0, 1, 1],
      },
      {
        assetType: 'N/A',
        title:
          'Create Test Bed for Elements Not Typically Tested in Production',
        desc: 'Create a test bed that mimics a production environment for specific penetration tests and Red Team attacks against elements that are not typically tested in production, such as attacks against supervisory control and data acquisition and other control systems.',
        ig: [0, 1, 1],
      },
      {
        assetType: 'N/A',
        title:
          'Use Vulnerability Scanning and Penetration Testing Tools in Concert',
        desc: 'Use vulnerability scanning and penetration testing tools in concert. The results of vulnerability scanning assessments should be used as a starting point to guide and focus penetration testing efforts.',
        ig: [0, 1, 1],
      },
      {
        assetType: 'N/A',
        title:
          'Ensure Results from Penetration Test are Documented Using Open, Machine-readable Standards',
        desc: 'Wherever possible, ensure that Red Team results are documented using open, machine-readable standards (e.g., SCAP). Devise a scoring method for determining the results of Red Team exercises so that results can be compared over time.',
        ig: [0, 0, 1],
      },
      {
        assetType: 'N/A',
        title:
          'Control and Monitor Accounts Associated with Penetration Testing',
        desc: 'Any user or system accounts used to perform penetration testing should be controlled and monitored to make sure they are only being used for legitimate purposes, and are removed or restored to normal function after testing is over.',
        ig: [0, 1, 1],
      },
    ],
    isIG2IG3Equal: false,
  },
} as const;

export type CisDetailsMap = typeof CONTROL_CODE_MAP_DESC;
export type CisAbbreviation = (typeof CONTROL_CODE_MAP_DESC)[CisCode]['abbr'];

const basicControlsCodes = ['1', '2', '3', '4', '5', '6'] as const;
const foundationalControlsCodes = [
  '7',
  '8',
  '9',
  '10',
  '11',
  '12',
  '13',
  '14',
  '15',
  '16',
] as const;
const organizationalControlsCodes = ['17', '18', '19', '20'] as const;
export const CisCodes = [
  ...basicControlsCodes,
  ...foundationalControlsCodes,
  ...organizationalControlsCodes,
];
export type CisCode = (typeof CisCodes)[number];

export const cisAbbrToCode = (abbr: CisAbbreviation): CisCode => {
  const data = Object.entries(CONTROL_CODE_MAP_DESC).find(
    ([_, item]) => item.abbr === abbr,
  );
  return data![0] as CisCode;
};

export const BASIC_CIS_CONTROLS = Object.fromEntries(
  Object.entries(CONTROL_CODE_MAP_DESC).filter(([k]) =>
    (basicControlsCodes as readonly string[]).includes(k),
  ),
);

export const BASIC_ABBR = Object.values(BASIC_CIS_CONTROLS).map(
  (item) => item.abbr,
);

export const FOUNDATIONAL_CIS_CONTROLS = Object.fromEntries(
  Object.entries(CONTROL_CODE_MAP_DESC).filter(([k]) =>
    (foundationalControlsCodes as readonly string[]).includes(k),
  ),
);

export const FOUNDATIONAL_ABBR = Object.values(FOUNDATIONAL_CIS_CONTROLS).map(
  (item) => item.abbr,
);

export const ORGANIZATIONAL_CIS_CONTROLS = Object.fromEntries(
  Object.entries(CONTROL_CODE_MAP_DESC).filter(([k]) =>
    (organizationalControlsCodes as readonly string[]).includes(k),
  ),
);
export const ORGANIZATIONAL_ABBR = Object.values(
  ORGANIZATIONAL_CIS_CONTROLS,
).map((item) => item.abbr);

export const CIS_ABBR_NAMES = Object.values(CONTROL_CODE_MAP_DESC).map(
  (item) => item.abbr,
);

export type CisV7SafeguardsImplementation = {
  [key in (typeof CIS_ABBR_NAMES)[number]]: Record<string, number>;
};

export const ISO27001_CATEGORY_LEN = {
  Organizational: 37,
  People: 8,
  Physical: 14,
  Technological: 34,
} as const;

export const CIS_CATEGORY_LEN = {
  Basic: 6,
  Foundational: 10,
  Organizational: 4,
} as const;

export const CIS_TO_CATEGORY = {
  ...Object.fromEntries(
    Object.values(BASIC_CIS_CONTROLS).map((details) => [details.abbr, 'Basic']),
  ),
  ...Object.fromEntries(
    Object.values(FOUNDATIONAL_CIS_CONTROLS).map((details) => [
      details.abbr,
      'Foundational',
    ]),
  ),
  ...Object.fromEntries(
    Object.values(ORGANIZATIONAL_CIS_CONTROLS).map((details) => [
      details.abbr,
      'Organizational',
    ]),
  ),
};

export const iso27001Category = [
  'Organizational',
  'People',
  'Physical',
  'Technological',
] as const;

export type ISO27001CategoryType = (typeof iso27001Category)[number];
export const isIso27001Category = (category: string) => {
  return iso27001Category.includes(category as any);
};

export const cisCategories = [
  'Basic',
  'Foundational',
  'Organizational',
] as const;
export type CisCategory = (typeof cisCategories)[number];

export const isCisCategory = (c: any): c is CisCategory =>
  cisCategories.includes(c);

export const categoryMembersByTitle = (c: any) => {
  if (!isCisCategory(c)) {
    throw Error('This method should only run on Cis Categories');
  }
  if (c === 'Basic') return BASIC_CIS_CONTROLS;
  if (c === 'Foundational') return FOUNDATIONAL_CIS_CONTROLS;
  return ORGANIZATIONAL_CIS_CONTROLS;
};

export type ControlBatteryOption = {
  label: string;
  value: string;
  backgroundColor: string;
};

export const BATTERY_OPTIONS = [
  {
    label: 'Not Implemented',
    value: ECISControl.NOT_IMPLEMENTED.toString(),
    backgroundColor: 'brand.recommendedAction.notImplemented',
  },
  {
    label: 'IG1',
    value: ECISControl.IG1.toString(),
    backgroundColor: 'brand.recommendedAction.ig1',
  },
  {
    label: 'IG2',
    value: ECISControl.IG2.toString(),
    backgroundColor: 'brand.recommendedAction.ig2',
  },
  {
    label: 'IG3',
    value: ECISControl.IG3.toString(),
    backgroundColor: 'brand.recommendedAction.ig3',
  },
  {
    label: `I Don't Know`,
    value: ECISControl.UNKNOWN.toString(),
    backgroundColor: 'brand.recommendedAction.unknown',
  },
];

// Returns the titles for a given safeguard
export const abbrToText = (abbr: string): Record<string, any> => {
  try {
    const [controlAbbr, controlNumberRaw] = abbr.split('-');
    const controlNumber = parseInt(controlNumberRaw);
    const safeguards = Object.values(CONTROL_CODE_MAP_DESC).find(
      (item) => item.abbr === controlAbbr,
    )?.safeguards;
    if (!safeguards) {
      return {
        title: abbr,
        secondaryTitle: abbr,
        desc: abbr,
      };
    }
    const safeguard = safeguards[controlNumber - 1];
    return {
      title: abbr,
      secondaryTitle: safeguard.title,
      desc: safeguard.desc,
    };
  } catch (error) {
    console.error(error);
    return {
      title: abbr,
      secondaryTitle: abbr,
      desc: abbr,
    };
  }
};
