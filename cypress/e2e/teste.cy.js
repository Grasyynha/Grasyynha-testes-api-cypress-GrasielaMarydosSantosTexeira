import { faker } from '@faker-js/faker'

describe('Teste Api Rarodb', () => {
  const fakeName =      faker.person.fullName()
  const fakeMail =      faker.internet.email()
  const fakePassword =  faker.internet.password({length:8})
  let userId
  let token


  it('Deve criar um usuário', () => {
    cy.request('POST', 'https://raromdb-3c39614e42d4.herokuapp.com/api/users', {
      name: fakeName,
      email: fakeMail,
      password: fakePassword
      
    })
    .then((response) => {
      expect(response.status).to.eq(201)
      userId = response.body.id
      
    })
  })
  it('Deve autenticar o login', () => {
    cy.request('POST', 'https://raromdb-3c39614e42d4.herokuapp.com/api/auth/login', {
      email: fakeMail,
      password: fakePassword
    })
    .then((response) => {
      expect(response.status).to.eq(200)
      token = response.body.accessToken
      
    })
  })
  it('Deve consultar um usuario', () => {
    cy.request({
      method: 'GET',
      url: `https://raromdb-3c39614e42d4.herokuapp.com/api/users/${userId}`,
      body: {
        id: `${userId}`
      },
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`

      }
    }).then((response) => {
        expect(response.status).to.eq(200)
        const ListedUser = response.body

    })
  })

  it('Deve criar um filme com sucesso', function () {
    // Dados para criar um filme
    const newMovie = {
      title: '"Mr nobody"', // Defina um título para o filme
      genre: 'Desenho', // Defina um gênero
      description: 'Xmen', // Descrição do filme
      durationInMinutes: 120, // Duração do filme em minutos
      releaseYear: 2007, // Ano de lançamento
    };
  
   
    cy.request({
      method: 'POST',
      url: 'https://raromdb-3c39614e42d4.herokuapp.com/api/movies',
      body: newMovie,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, 
      },
    }).then((response) => {
      expect(response.status).to.equal(201); 
      expect(response.body).to.have.property('id');
      movieId = response.body.id; 
    });
  });
  
  it('Deve buscar um filme passado na url', () => {
    cy.request({
      method: 'GET',
      url: 'https://raromdb-3c39614e42d4.herokuapp.com/api/movies/search?title=troia',   
    }).then((response) => {
      expect(response.status).to.eq(200)
  
    })
  })
})
