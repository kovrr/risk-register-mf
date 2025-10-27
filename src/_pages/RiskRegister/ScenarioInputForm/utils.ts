import { CRQData, CRQScenarioFilters } from 'types/riskRegister';

export const transformToLocalFilters = (
  filters: Partial<CRQScenarioFilters>,
) => {
  const eventTypeFilters = filters.event_type_filter;
  if (!eventTypeFilters) {
    return filters;
  }

  const interruption =
    eventTypeFilters?.includes('interruption') ||
    eventTypeFilters?.includes('service_provider_interruption');
  const dataBreach =
    eventTypeFilters?.includes('data_breach') ||
    eventTypeFilters?.includes('service_provider_data_breach');

  const newEventTypeFilters = [
    ...eventTypeFilters.filter(
      (filter) =>
        filter !== 'interruption' &&
        filter !== 'service_provider_interruption' &&
        filter !== 'data_breach' &&
        filter !== 'service_provider_data_breach',
    ),
    ...(interruption ? ['interruption'] : []),
    ...(dataBreach ? ['data_breach'] : []),
  ];

  return {
    ...filters,
    event_type_filter: newEventTypeFilters,
  };
};

export const transformToServerFilters = (crqData: CRQData) => {
  const eventTypeFilters = crqData.filters.event_type_filter;
  if (!eventTypeFilters) {
    return crqData;
  }

  const interruption = eventTypeFilters.includes('interruption');
  const dataBreach = eventTypeFilters.includes('data_breach');

  const newEventTypeFilters = [
    ...eventTypeFilters.filter(
      (filter) =>
        filter !== 'interruption' &&
        filter !== 'service_provider_interruption' &&
        filter !== 'data_breach' &&
        filter !== 'service_provider_data_breach',
    ),
    ...(interruption ? ['interruption', 'service_provider_interruption'] : []),
    ...(dataBreach ? ['data_breach', 'service_provider_data_breach'] : []),
  ];

  return {
    ...crqData,
    filters: {
      ...crqData.filters,
      event_type_filter: newEventTypeFilters,
    },
  };
};
