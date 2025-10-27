import { NoteItem } from '@/_pages/RiskRegister/ScenarioView/NoteItem';
import { buildNoteItemProps } from '@/mocks/builders/riskRegisterBuilders';
import { BaseDriver } from '../support/base-driver';
import { mockGetDocument } from '../support/commands-lib/mock-notes';

describe('NoteItem Component', () => {
  let driver: BaseDriver;
  const mockPropsWithoutAttachment = buildNoteItemProps();
  mockPropsWithoutAttachment.attachment = undefined;
  const mockPropsWithAttachment = buildNoteItemProps({
    avatar: 'Jade Davin',
    attachment: { id: 'attachment123', name: 'test-file.pdf' },
  });

  beforeEach(() => {
    driver = new BaseDriver();
    cy.viewport(500, 300);
    mockGetDocument();
    driver.mock();
    cy.mockFrontegg([]);
  });

  it('renders basic note information correctly', () => {
    cy.mount(<NoteItem {...mockPropsWithoutAttachment} />);
    cy.contains(mockPropsWithoutAttachment.email).should('be.visible');

    // Check for date in dd-mm-yyyy format
    const date = new Date(mockPropsWithoutAttachment.date);
    const formattedDate = `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()}`;
    cy.contains(formattedDate).should('be.visible');

    cy.contains(mockPropsWithoutAttachment.content).should('be.visible');
  });

  it('shows avatar initials correctly', () => {
    cy.mount(<NoteItem {...mockPropsWithAttachment} />);
    cy.contains('JD').should('be.visible');
  });

  it('handles text expansion and collapse', () => {
    const longContent = 'ABC '.repeat(900);
    const longNote = buildNoteItemProps({ content: longContent });
    cy.mount(<NoteItem {...longNote} />);

    cy.get(`#content-${longNote.noteId}`).should('have.class', 'line-clamp-3');
    cy.contains('Show More').click();
    cy.get(`#content-${longNote.noteId}`).should(
      'not.have.class',
      'line-clamp-3',
    );
    cy.contains('Show Less').click();
    cy.get(`#content-${longNote.noteId}`).should('have.class', 'line-clamp-3');
  });

  it('renders attachment when provided', () => {
    cy.mount(<NoteItem {...mockPropsWithAttachment} />);
    cy.contains(mockPropsWithAttachment.attachment!.name).should('be.visible');
    cy.get('svg').should('exist');
  });

  it('handles file download click', () => {
    cy.mount(<NoteItem {...mockPropsWithAttachment} />);
    cy.window().then((win) => {
      cy.stub(win, 'open').as('windowOpen');
    });
    cy.contains(mockPropsWithAttachment.attachment!.name).click();
    cy.get('@windowOpen').should('be.called');
  });

  it('renders without attachment', () => {
    cy.mount(<NoteItem {...mockPropsWithoutAttachment} />);
    // check that the attachment icon is not rendered
    cy.get('svg').should('not.exist');
  });
});
