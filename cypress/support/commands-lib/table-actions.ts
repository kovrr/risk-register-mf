import { AGLevelRecommendation } from 'components/ui/tables/types';
import { getAGTypeLabel } from 'options/get-label';

interface TableClick {
  location: string;
  indexToClick: number;
}

export function clickOnRow({ location, indexToClick }: TableClick) {
  cy.get(location).within(() => {
    cy.get('tr')
      .eq(indexToClick + 2)
      .within(($tr) => {
        cy.get('td')
          .eq(0)
          .then(($td) => {
            $td.trigger('click');
          });
      });
  });
}

export function assertExpandable({ location, indexToClick }: TableClick) {
  cy.log(`searching for row ${indexToClick}`);
  cy.get(location).within(() => {
    cy.get('tr')
      .eq(indexToClick + 1)
      .within(() => {
        cy.get('[aria-label="expand-row"]').click({ timeout: 8000 });
      });
  });
}
export function assertNonExpandable({ location, indexToClick }: TableClick) {
  cy.log(`searching for row ${indexToClick}`);
  cy.get(location).within(() => {
    cy.get('tr')
      .eq(indexToClick + 2)
      .within(() => {
        cy.get('[aria-label="expand-row"]').should('not.exist');
      });
  });
}

export function verifySorting({
  tablePath,
  headerPath,
  headerText,
  uniqueIndices,
}: {
  tablePath: string;
  headerPath: string;
  headerText: string;
  uniqueIndices: number[];
}) {
  let uniqueText: string;
  cy.get(tablePath).within(() => {
    cy.get('tbody>tr')
      .eq(0)
      .get('td')
      .should(($tds) => {
        uniqueText = uniqueIndices.reduce(
          (prev, cellIdx) => `${prev}.${$tds.eq(cellIdx).text()}`,
          ''
        );
      });
  });
  cy.get(tablePath).within(() => {
    cy.contains(headerPath, headerText).click();
  });
  cy.get(tablePath).within(() => {
    cy.get('tbody>tr')
      .eq(0)
      .get('td')
      .should(($tds) => {
        const newUniqueText = uniqueIndices.reduce(
          (prev, cellIdx) => `${prev}.${$tds.eq(cellIdx).text()}`,
          ''
        );
        expect(newUniqueText).to.not.equal(uniqueText);
      });
  });
}

export function verifyFiltering({
  tablePath,
  filterInput,
  tableRecommendationData,
}: {
  tablePath: string;
  filterInput: string;
  tableRecommendationData: AGLevelRecommendation[];
}) {
  // check first that all rows appears in the table.
  const controlsCount = tableRecommendationData.length;
  cy.get(tablePath).find('tbody>tr').should('have.length', controlsCount); // assert the number of rows
  // now perform filters and re-count
  const assetGroupToFilter = tableRecommendationData[0].assetGroup;

  let tableRecommendationDataFiltered = tableRecommendationData.filter(
    (RecommendationItem) => RecommendationItem.assetGroup === assetGroupToFilter
  );
  const assetGroupToFilterCount = tableRecommendationDataFiltered.length;
  cy.get(filterInput)
    .type(`${assetGroupToFilter}{enter}`)
    .blur()
    .then(() => {
      cy.get(tablePath)
        .find('tbody>tr')
        .should('have.length', assetGroupToFilterCount); // assert the number of rows
    });
  const assetGroupTypeFilter = tableRecommendationData[0].assetGroupType;
  const assetGroupToFilterRendered = getAGTypeLabel(assetGroupTypeFilter);

  tableRecommendationDataFiltered = tableRecommendationData.filter(
    (RecommendationItem) =>
      getAGTypeLabel(RecommendationItem.assetGroupType) ===
      assetGroupToFilterRendered
  );
  const assTypeToFilterCount = tableRecommendationDataFiltered.length;

  cy.get(filterInput)
    .focus()
    .clear()
    .type(`${assetGroupToFilterRendered}{enter}`)
    .wait(1000)
    .then(() => {
      cy.get(tablePath)
        .find('tbody>tr')
        .should('have.length', assTypeToFilterCount); // assert the number of rows
    });
}
