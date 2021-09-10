describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')      
    cy.visit('http://localhost:3003')
    const user = {          
       username: 'test',  
       name: 'test',    
       password: 'test'    
      }    
    cy.request('POST', 'http://localhost:3003/api/users/', user) 
  })

  it('Login form is shown', function() {
    cy.contains('Log in to application')
    cy.contains('username')
    cy.contains('password')
  })
  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.contains('login').click()
      cy.get('#username').type('test')
      cy.get('#password').type('test')
      cy.get('#login-button').click()

      cy.contains('Welcome test')
    })

    it('fails with wrong credentials', function() {
      cy.contains('login').click()
      cy.get('#username').type('test')
      cy.get('#password').type('wrong')
      cy.get('#login-button').click()

      cy.contains('invalid username or password')
    })
  })
  describe('When logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'test', password: 'test' })
    })

    it('A blog can be created', function() {
      cy.contains('new note').click()
      cy.get('#title').type('new')
      cy.get('#author').type('blog')
      cy.get('#url').type('newblog')

      cy.get('#create-button').click()

      cy.contains('new')
      cy.contains('blog')

      
    })
    
  })
})