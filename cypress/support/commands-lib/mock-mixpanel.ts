export const mockMixpanel = () => {
  cy.intercept('GET', '/api/events/token', { body: {} }).as('events');
  cy.intercept('POST', '/events', { body: {} }).as('events');
};

const checkBase64 = (input: string) => {
  const pattern =
    /^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)?$/;
  return pattern.test(input);
};

export const extractMixpanelRequestData = (interception: any) => {
  const requestDataEncoded = decodeURI(interception.request.body);
  const data = requestDataEncoded.split('data=')[1];
  // Mixpanel encodes the data so we need to decode it
  let processReqStep1: string = data;
  if (checkBase64(data)) {
    processReqStep1 = Buffer.from(data, 'base64').toString();
  }
  const processReqStep2 = processReqStep1
    .replaceAll('%3A', ':')
    .replaceAll('%2C', ',')
    .replaceAll('%40', '@');
  console.log(processReqStep2);
  const endOfDataIndex = processReqStep2.lastIndexOf(']');
  return JSON.parse(processReqStep2.slice(0, endOfDataIndex + 1));
};
