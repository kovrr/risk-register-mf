export const BasicEventType = {
  ransomware: 'ransomware',
  interruption: 'interruption',
  dataBreach: 'data_breach',
  attritional: 'attritional',
} as const;

export type BasicEventTypes =
  (typeof BasicEventType)[keyof typeof BasicEventType];

export const ServiceProviderEventType = {
  serviceProviderInterruption: 'service_provider_interruption',
  serviceProviderDataBreach: 'service_provider_data_breach',
} as const;

export type ServiceProviderEventTypes =
  (typeof ServiceProviderEventType)[keyof typeof ServiceProviderEventType];

export const EventType = { ...BasicEventType, ...ServiceProviderEventType };

export type EventTypes = (typeof EventType)[keyof typeof EventType];

export const ClickableEventType = {
  ransomware: EventType.ransomware,
  interruption: EventType.interruption,
  dataBreach: EventType.dataBreach,
};

export type ClickableEventTypes =
  (typeof ClickableEventType)[keyof typeof ClickableEventType];

export const EVENT_TYPE_TO_TEXT: Record<EventTypes, string> = {
  [EventType.ransomware]: 'Ransomware',
  [EventType.interruption]: 'Interruption',
  [EventType.dataBreach]: 'Data Breach',
  [EventType.attritional]: 'Attritional',
  [EventType.serviceProviderInterruption]: '3rd Party Interruption',
  [EventType.serviceProviderDataBreach]: '3rd Party Data Breach',
} as const;

export const EVENT_TYPE_TO_URL: Record<string, string> = {
  [EventType.ransomware]: 'ransomware',
  [EventType.interruption]: 'interruption',
  [EventType.dataBreach]: 'data-breach',
} as const;

// just reversing EVENT_TYPE_TO_URL
export const URL_TO_EVENT_TYPE: Record<string, ClickableEventTypes> =
  Object.fromEntries(
    Object.entries(EVENT_TYPE_TO_URL).map(([key, value]) => [
      value,
      key as ClickableEventTypes,
    ])
  );

export const eventTypesAsStringArray = [
  ...Object.values(EVENT_TYPE_TO_URL),
] as string[];

export const getEventTypeUrl = (eventType: EventTypes) => {
  return `by-risk-driver/${EVENT_TYPE_TO_URL[eventType]}`;
};
