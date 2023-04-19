describe('UI Test', () => {
  it('should go to the login page', () => {
    cy.visit('http://localhost:3000/');
    cy.url().should('include', 'localhost:3000');
  });
  
  it('displays an error message when email and password are not provided', () => {
    cy.visit('http://localhost:3000/');
    cy.get('[data-testid="login-form"]').submit();
    cy.get('[data-testid="alert"]').should('be.visible');
    cy.get('[data-testid="alert"]').contains('Please enter your email and password');
  });

  it('it will go to register page', () => {
    cy.visit('http://localhost:3000/');
    cy.get('[data-testid="register-link"]').click();
    cy.url().should('include', 'localhost:3000/register');
  });

  it('it will successfully register if it runs first time', () => {
    cy.visit('http://localhost:3000/register');
    cy.get('input[name="email"]').type('puquan@12345.com');
    cy.get('input[name="password"]').type('123456');
    cy.get('input[name="username"]').type('puquan');
    cy.get('[data-testid="register-form"]').submit();
    cy.url().should('include', 'localhost:3000/dashboard');
  });

  it ('it will login after register', () => {
    cy.visit('http://localhost:3000/');
    cy.get('input[name="email"]').type('puquan@12345.com');
    cy.get('input[name="password"]').type('123456');
    cy.get('[data-testid="login-form"]').submit();
    cy.url().should('include', 'localhost:3000/dashboard');
  });

  it('it will create a new Game, start it and stop it, then view result. Then log out, at last login.', () => {
    cy.visit('http://localhost:3000/');
    cy.get('input[name="email"]').type('puquan@12345.com');
    cy.get('input[name="password"]').type('123456');
    cy.get('[data-testid="login-form"]').submit();
    cy.get('[data-testid="create-new-quiz"]').click();
    cy.get('[data-testid="quiz-name"]').click().type('Test Quiz');
    cy.get('[data-testid="send-quizName"]').click();
    cy.get('[data-testid="display-quiz"]').should('be.visible');
    cy.get('[data-testid="display-quiz"]').should('contain', 'Test Quiz');
    cy.get('[data-testid="startquiz"]').click();
    cy.get('[data-testid="popup"]').should('be.visible');
    cy.get('body').click(100, 100);
    cy.get('[data-testid="stopquiz"]').click();
    cy.get('[data-testid="viewresult"]').click();
    cy.url().should('include', 'localhost:3000/quizResult');
    cy.get('[data-testid="logout"]').click();
    cy.get('[data-testid="login-form"]').should('be.visible');
    cy.get('input[name="email"]').type('puquan@12345.com');
    cy.get('input[name="password"]').type('123456');
    cy.get('[data-testid="login-form"]').submit();
  });

})