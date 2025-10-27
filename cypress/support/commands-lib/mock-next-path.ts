import * as NextNavigation from 'next/navigation';

export const mockNextPath = (path: string) => {
  cy.stub(NextNavigation, 'usePathname').returns(path);
};
