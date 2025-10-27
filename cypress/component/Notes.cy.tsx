import { Notes } from '@/_pages/RiskRegister/ScenarioView/Notes';
import { Toaster } from '@/components/atoms/toaster';
import { BaseDriver } from '../support/base-driver';
import {
  mockCreateNote,
  mockDeleteNote,
  mockGetNotes,
  mockUpdateNote,
} from '../support/commands-lib/mock-notes';

describe('Notes Component', () => {
  let driver: BaseDriver;
  const scenarioId = '12345678-1234-1234-1234-123456789def';
  const mockNotes = [
    {
      id: 'note-1',
      parent_type: 'scenario' as const,
      parent_id: scenarioId,
      content: 'Test note content 1',
      user: 'test.user@example.com',
      created_at: new Date().toISOString(),
    },
    {
      id: 'note-2',
      parent_type: 'scenario' as const,
      parent_id: scenarioId,
      content: 'Test note content 2',
      user: 'test.user@example.com',
      created_at: new Date().toISOString(),
    },
  ];

  beforeEach(() => {
    driver = new BaseDriver();
    cy.viewport(800, 600);

    mockGetNotes(mockNotes);
    mockCreateNote();
    mockUpdateNote();
    mockDeleteNote();
    cy.intercept('GET', '**/api/documents/*', {
      statusCode: 200,
      body: { download_url: 'https://example.com/test' },
    }).as('getDocument');

    driver.mock();
    cy.mockFrontegg([]);
  });

  const mountComponent = () => {
    cy.mount(
      <>
        <Toaster />
        <Notes />
      </>,
      {
        routerParams: {
          scenarioId,
        },
      },
    );
  };

  it('renders list of notes correctly', () => {
    mountComponent();
    mockNotes.forEach((note) => {
      cy.contains(note.content).should('be.visible');
      cy.contains(note.user).should('be.visible');
    });
  });

  it('allows creating a new note', () => {
    mountComponent();

    const noteText = 'This is a new test note';
    cy.get('textarea').type(noteText);
    cy.contains('button', 'Save').click();

    cy.wait('@createNote').then((interception) => {
      // For multipart/form-data, check if the content is included in the request body
      expect(interception.request.body).to.include(noteText);
    });

    cy.get('textarea').should('have.value', '');
  });

  it('handles file attachment', () => {
    mountComponent();

    cy.get('#file-upload').selectFile(
      {
        contents: Cypress.Buffer.from('file contents'),
        fileName: 'test.pdf',
        mimeType: 'application/pdf',
      },
      { force: true },
    );

    cy.contains('test.pdf').should('be.visible');
  });

  it('handles error state', () => {
    cy.intercept('POST', '**/api/notes', {
      statusCode: 500,
      body: { message: 'Error creating note' },
    }).as('createNoteError');

    mountComponent();
    cy.get('textarea').type('Test note');
    cy.contains('button', 'Save').click();

    cy.wait('@createNoteError');
    cy.contains('Failed to create note. Please try again later.').should(
      'be.visible',
    );
  });
});
