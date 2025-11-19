/**
 * Mock document download endpoint
 * New endpoint: GET /api/v1/risk-scenarios/{scenario_id}/attachments/download?attachment_id={id}
 */
export const mockGetDocument = (scenarioId?: string, shouldFail = false) => {
  const urlPattern = scenarioId
    ? `**/api/v1/risk-scenarios/${scenarioId}/attachments/download*`
    : '**/api/v1/risk-scenarios/*/attachments/download*';

  cy.intercept('GET', urlPattern, (req) => {
    if (shouldFail) {
      req.reply({ statusCode: 500 });
    } else {
      // Return blob response for scenario attachments
      req.reply({
        statusCode: 200,
        body: new Blob(['test file content'], { type: 'application/pdf' }),
        headers: {
          'Content-Type': 'application/pdf',
        },
      });
    }
  }).as('getDocument');
};

/**
 * Mock notes GET endpoint
 * New endpoint: GET /api/v1/risk-scenarios/{scenario_id}/notes
 */
export const mockGetNotes = (notes: any[] = [], scenarioId?: string) => {
  const urlPattern = scenarioId
    ? `**/api/v1/risk-scenarios/${scenarioId}/notes*`
    : '**/api/v1/risk-scenarios/*/notes*';

  cy.intercept('GET', urlPattern, (req) => {
    req.reply({
      statusCode: 200,
      body: {
        data: notes, // New backend returns data in data.data format
      },
    });
  }).as('getNotes');
};

/**
 * Mock create note endpoint
 * New endpoints:
 * - POST /api/v1/risk-scenarios/{scenario_id}/notes (content as query param)
 * - POST /api/v1/risk-scenarios/{scenario_id}/notes-with-attachment (FormData)
 */
export const mockCreateNote = (scenarioId?: string, shouldFail = false) => {
  const urlPattern = scenarioId
    ? `**/api/v1/risk-scenarios/${scenarioId}/notes*`
    : '**/api/v1/risk-scenarios/*/notes*';

  cy.intercept('POST', urlPattern, (req) => {
    if (shouldFail) {
      req.reply({ statusCode: 500, body: { detail: 'Error creating note' } });
    } else {
      // Extract scenarioId from URL
      const urlMatch = req.url.match(/risk-scenarios\/([^/]+)\//);
      const extractedScenarioId = urlMatch ? urlMatch[1] : scenarioId || '';

      // Handle FormData (attachment) or query params (no attachment)
      let content = '';
        if (req.body && typeof req.body.get === 'function') {
        // FormData
        content = req.body.get('content') || '';
      } else if (req.query && req.query.content) {
        // Query params
        content = req.query.content as string;
      }

      req.reply({
        statusCode: 201,
        body: {
          data: {
          id: 'new-note-id',
            parent_type: 'scenario',
            parent_id: extractedScenarioId,
            content: content,
            user: 'test.user@example.com',
          created_at: new Date().toISOString(),
            documents: [],
          },
        },
      });
    }
  }).as('createNote');
};

/**
 * Mock update note endpoint (if still used)
 */
export const mockUpdateNote = (shouldFail = false) => {
  cy.intercept('PATCH', '**/api/v1/risk-scenarios/*/notes/*', (req) => {
    if (shouldFail) {
      req.reply({ statusCode: 500 });
    } else {
      const getBodyValue = (key: string) => {
        if (req.body && typeof req.body.get === 'function') {
          return req.body.get(key);
        }
        return req.body?.[key] || '';
      };

      req.reply({
        statusCode: 200,
        body: {
          data: {
          id: req.url.split('/').pop(),
          content: getBodyValue('content'),
          user: getBodyValue('user'),
          created_at: new Date().toISOString(),
          },
        },
      });
    }
  }).as('updateNote');
};

/**
 * Mock delete note endpoint (if still used)
 */
export const mockDeleteNote = (shouldFail = false) => {
  cy.intercept('DELETE', '**/api/v1/risk-scenarios/*/notes/*', (req) => {
    if (shouldFail) {
      req.reply({ statusCode: 500 });
    } else {
      req.reply({ statusCode: 204 });
    }
  }).as('deleteNote');
};
