/// <reference types="cypress" />

context('Special characters • @team-name# •', () => {
    beforeEach(() => {
      cy.visit('https://example.cypress.io/commands/aliasing')
    })
  
    it('special-test with emoji 😅', () => {
      // https://on.cypress.io/as
  
      // Alias a DOM element for use later
      // We don't have to traverse to the element
      // later in our code, we reference it with @
  
      cy.get('.as-table').find('tbody>tr')
        .first().find('td').first()
        .find('button').as('firstBtn')
  
      // when we reference the alias, we place an
      // @ in front of its name
      cy.get('@firstBtn').click()
  
      cy.get('@firstBtn')
        .should('have.class', 'btn-success')
        .and('contain', 'Changed')
    })
})