export const mockGetDocument = (shouldFail = false) => {
  cy.intercept('GET', '**/api/documents/*', (req) => {
    if (shouldFail) {
      req.reply({ statusCode: 500 });
    } else {
      req.reply({
        statusCode: 200,
        body: {
          download_url: 'https://example.com/test-file',
        },
      });
    }
  }).as('getDocument');
};

export const mockGetNotes = (notes: any[] = []) => {
  cy.intercept('GET', '**/api/notes*', (req) => {
    req.reply({
      statusCode: 200,
      body: {
        items: notes,
        total: notes.length,
        page: 1,
        size: 50,
      },
    });
  }).as('getNotes');
};

export const mockCreateNote = (shouldFail = false) => {
  cy.intercept('POST', '**/api/notes', (req) => {
    if (shouldFail) {
      req.reply({ statusCode: 500 });
    } else {
      // Handle both FormData and regular body
      const getBodyValue = (key: string) => {
        if (req.body && typeof req.body.get === 'function') {
          return req.body.get(key);
        }
        return req.body?.[key] || '';
      };

      req.reply({
        statusCode: 201,
        body: {
          id: 'new-note-id',
          parent_type: getBodyValue('parent_type'),
          parent_id: getBodyValue('parent_id'),
          content: getBodyValue('content'),
          user: getBodyValue('user'),
          created_at: new Date().toISOString(),
        },
      });
    }
  }).as('createNote');
};

export const mockUpdateNote = (shouldFail = false) => {
  cy.intercept('PATCH', '**/api/notes/*', (req) => {
    if (shouldFail) {
      req.reply({ statusCode: 500 });
    } else {
      // Handle both FormData and regular body
      const getBodyValue = (key: string) => {
        if (req.body && typeof req.body.get === 'function') {
          return req.body.get(key);
        }
        return req.body?.[key] || '';
      };

      req.reply({
        statusCode: 200,
        body: {
          id: req.url.split('/').pop(),
          content: getBodyValue('content'),
          user: getBodyValue('user'),
          created_at: new Date().toISOString(),
        },
      });
    }
  }).as('updateNote');
};

export const mockDeleteNote = (shouldFail = false) => {
  cy.intercept('DELETE', '**/api/notes/*', (req) => {
    if (shouldFail) {
      req.reply({ statusCode: 500 });
    } else {
      req.reply({ statusCode: 204 });
    }
  }).as('deleteNote');
};
