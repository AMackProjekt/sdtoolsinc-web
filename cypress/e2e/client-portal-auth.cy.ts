describe('Client Portal Auth Critical Paths', () => {
  const baseUrl = Cypress.env('CLIENT_PORTAL_BASE_URL') || 'http://localhost:3003'

  it('renders login with verification recovery actions', () => {
    cy.visit(`${baseUrl}/auth/login?verify=check_email`)
    cy.contains('Please verify your email before signing in').should('be.visible')
    cy.contains('Resend verification email').should('be.visible')
  })

  it('shows invite field on signup when invite mode is on', () => {
    cy.visit(`${baseUrl}/auth/signup`)
    cy.contains('Invite Code').should('be.visible')
  })

  it('renders forgot password support guidance', () => {
    cy.visit(`${baseUrl}/auth/forgot-password`)
    cy.contains('Reset Password').should('be.visible')
    cy.contains('Still stuck? Contact support').should('be.visible')
  })
})
