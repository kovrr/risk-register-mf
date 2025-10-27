import { shortenNumberWithSuffix } from 'components/ui/charts/utils';
import { CompanyApiData } from 'types/companyForm';
import { Quantification } from 'types/quantificationData';
import {
  BasicEventType,
  BasicEventTypes,
  ClickableEventTypes,
  EventTypes,
  EVENT_TYPE_TO_TEXT,
} from 'types/riskDrivers/eventTypes';
import {
  convertCurrencyLettersToSign,
  CurrencyCode,
} from 'worker/exportFqModule/converters';

export const prepareEventTypesBreakdownAndDefinition = ({
  quantification,
  company,
}: {
  quantification: Quantification;
  company: CompanyApiData;
}) => {
  const relevantEventsOnly = Object.fromEntries(
    Object.entries(quantification.by_event_type_exposure || {}).filter(
      ([eventType, _]) =>
        Object.values(BasicEventType).includes(eventType as BasicEventTypes)
    )
  );
  const labelsAndValues: Record<BasicEventTypes, number> = Object.fromEntries(
    Object.entries({
      ...relevantEventsOnly,
    })
      .sort((exposure1, exposure2) => exposure2[1].aal - exposure1[1].aal)
      .filter(([, { aal }]) => aal > 0)
      .map(([eventType, simulationExposure]) => {
        return [eventType as unknown as EventTypes[], simulationExposure.aal];
      })
  );

  const currencySymbol = convertCurrencyLettersToSign(
    company.currency as CurrencyCode
  );
  const currencyValue = (value: number) =>
    `${currencySymbol}${shortenNumberWithSuffix(value, 2)}`;
  const totalSum = Object.values(labelsAndValues).reduce(
    (sum, current) => sum + current,
    0
  );

  return {
    labelsAndValues,
    currencySymbol,
    currencyValue,
    totalSum,
  };
};

export const verifyEventTypesBreakdownAndDefinition = ({
  labelsAndValues,
  currencyValue,
  totalSum,
}: {
  labelsAndValues: Record<BasicEventTypes, number>;
  currencyValue: (value: number) => string;
  totalSum: number;
}) => {
  Object.entries(labelsAndValues).forEach(([label, value]) => {
    const percentage = ((value / totalSum) * 100).toFixed(2);
    // label is hidden under 8 percent
    if (Number(percentage) > 9) {
      cy.contains(EVENT_TYPE_TO_TEXT[label as ClickableEventTypes]);
      cy.contains(currencyValue(value as number));
      cy.contains(`${percentage}%`);
    }
  });
};
