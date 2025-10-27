export const InitialAttackVectors = {
  validAccounts: 'valid accounts',
  trustedRelationship: 'trusted relationship',
  phishing: 'phishing',
  externalRemoteServices: 'external remote services',
  driveByCompromise: 'drive-by compromise',
  replicationThroughRemovableMedia: 'replication through removable media',
  supplyChainCompromise: 'supply chain compromise',
  hardwareAdditions: 'hardware additions',
  exploitPublicFacingApplication: 'exploit public facing application',
  lostOrStolenDevices: 'lost or stolen devices',
  humanError: 'human error',
  maliciousInsider: 'malicious insider',
  contentInjection: 'content injection',
} as const;

export type InitialAttackVector =
  (typeof InitialAttackVectors)[keyof typeof InitialAttackVectors];

export const initialAttackVectorsAsStringArray = Object.values(
  InitialAttackVectors
) as string[];

export const ATTACK_VECTOR_TO_URL: Partial<Record<InitialAttackVector, string>> = {
  [InitialAttackVectors.validAccounts]: 'valid-accounts',
  [InitialAttackVectors.trustedRelationship]: 'trusted-relationship',
  [InitialAttackVectors.phishing]: 'phishing',
  [InitialAttackVectors.externalRemoteServices]: 'external-remote-services',
  [InitialAttackVectors.driveByCompromise]: 'drive-by-compromise',
  [InitialAttackVectors.replicationThroughRemovableMedia]:
    'replication-through-removable-media',
  [InitialAttackVectors.supplyChainCompromise]: 'supply-chain-compromise',
  [InitialAttackVectors.hardwareAdditions]: 'hardware-additions',
  [InitialAttackVectors.exploitPublicFacingApplication]:
    'exploit-public-facing-application',
  [InitialAttackVectors.lostOrStolenDevices]: 'lost-or-stolen-devices',
  [InitialAttackVectors.humanError]: 'human-error',
  [InitialAttackVectors.maliciousInsider]: 'malicious-insider',
  [InitialAttackVectors.contentInjection]: 'content-injection',
} as const;

export const URL_TO_ATTACK_VECTOR: Record<string, InitialAttackVector> =
  Object.fromEntries(
    Object.entries(ATTACK_VECTOR_TO_URL).map(([key, value]) => [
      value,
      key as InitialAttackVector,
    ])
  );

  export const getAttackVectorUrl = (attackVector: InitialAttackVector): string | null => {
    const url = ATTACK_VECTOR_TO_URL[attackVector];
    return url ? `by-risk-driver/${url}` : null;
  };

export interface RiskDriverAttackVectorsProps {
  inDrawer: boolean;
  defaultTabIndex?: number;
}
