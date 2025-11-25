import { Notes } from '@/_pages/RiskRegister/ScenarioView/Notes';
import { buildRiskRegisterResponse } from '@/mocks/builders/riskRegisterBuilders';
import { Toaster } from '@/components/atoms/toaster';
import type { NoteOutput } from '@/types/riskRegister';
import { BaseDriver } from '../support/base-driver';
import {
  mockCreateNote,
  mockDeleteNote,
  mockGetDocument,
  mockUpdateNote,
} from '../support/commands-lib/mock-notes';

describe('Notes Component', () => {
  let driver: BaseDriver;
  const scenarioId = '12345678-1234-1234-1234-123456789def';
  const mockNotes: NoteOutput[] = [
    {
      id: 'note-1',
      content: 'Test note content 1',
      user: 'test.user@example.com',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      documents: [],
    },
    {
      id: 'note-2',
      content: 'Test note content 2',
      user: 'test.user2@example.com',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      documents: [],
    },
  ];

  const mockScenario = buildRiskRegisterResponse({
    customer_scenario_id: 'RISK-001',
    name: 'Test Scenario',
  });
  mockScenario.scenario_id = scenarioId;
  mockScenario.notes = mockNotes;

  beforeEach(() => {
    driver = new BaseDriver();
    cy.viewport(800, 600);

    // Mock scenario endpoint (required by useCurrentRiskRegisterScenario + notes)
    cy.intercept('GET', `**/api/risk-scenarios/${scenarioId}`, {
      statusCode: 200,
      body: mockScenario,
    }).as('getScenario');
    mockCreateNote(scenarioId);
    mockUpdateNote();
    mockDeleteNote();
    mockGetDocument(scenarioId);

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

    // Wait for scenario to load (component shows skeleton until scenario is loaded)
    cy.wait('@getScenario');

    // Wait for skeleton to disappear and notes to load
    cy.get('textarea[placeholder*="Add a note"]', { timeout: 5000 }).should('be.visible');
    
    // Verify notes are rendered
        mockNotes.forEach((note) => {
          cy.contains(note.content).should('be.visible');
          cy.contains(note.user).should('be.visible');
    });
  });

  it('allows creating a new note', () => {
    mountComponent();

    // Wait for scenario to load
    cy.wait('@getScenario');

    // Wait for form to be ready
    cy.get('textarea[placeholder*="Add a note"]', { timeout: 5000 }).should('be.visible');
    
    // Type note content
        const noteText = 'This is a new test note';
    cy.get('textarea[placeholder*="Add a note"]').type(noteText);
    
    // Click Save button (translates to "Save")
    cy.contains('button', 'Save').should('be.enabled').click();

    // Wait for create note API call
    cy.wait('@createNote', { timeout: 5000 });

    // Verify textarea was cleared (component clears form on success)
    cy.get('textarea[placeholder*="Add a note"]').should('have.value', '');
    
    // Verify success toast appears
    cy.contains('Note created successfully').should('be.visible');
  });

  it('handles file attachment', () => {
    mountComponent();

    // Wait for scenario to load
    cy.wait('@getScenario');
    
    // Wait for form to be ready
    cy.get('textarea[placeholder*="Add a note"]', { timeout: 5000 }).should('be.visible');
    
    // Find file input and upload file
    cy.get('#file-upload').selectFile(
      {
        contents: Cypress.Buffer.from('file contents'),
        fileName: 'test.pdf',
        mimeType: 'application/pdf',
      },
      { force: true },
    );

    // Verify file name appears (component shows "Selected file: {filename}")
    cy.contains('test.pdf').should('be.visible');
  });

  it('handles error state', () => {
    // Mock error for create note endpoint
    cy.intercept('POST', `**/api/risk-scenarios/${scenarioId}/notes*`, {
      statusCode: 500,
      body: { detail: 'Error creating note' },
    }).as('createNoteError');

    mountComponent();

    // Wait for scenario to load
    cy.wait('@getScenario');

    // Wait for form to be ready
    cy.get('textarea[placeholder*="Add a note"]', { timeout: 5000 }).should('be.visible');
    
    // Type note content
    cy.get('textarea[placeholder*="Add a note"]').type('Test note');
    
    // Click Save button
        cy.contains('button', 'Save').click();

    // Wait for error API call
    cy.wait('@createNoteError', { timeout: 5000 });

    // Verify error toast appears
    cy.contains('Failed to create note').should('be.visible');
  });
});
