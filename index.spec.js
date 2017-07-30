const request = require('supertest')
const app = require('./index')

const iso8601Regex = /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/
const idRegex = /\d+/

jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000

beforeAll(() => new Promise((resolve) => {
  setTimeout(() => {
    resolve()
  }, 1000)
}))

// TODO: [bug] test is not closing the program.
afterAll(() => {
  app.close()
})

test('pokemons.list', () => request(app).get('/pokemons').then((response) => {
  expect(response.body.length).toBe(0)
}))

test('pokemons.create', () => {
  const pikachu = {
    name: 'pikachu',
    price: 15.56,
    stock: 3
  }

  return request(app)
    .post('/pokemons')
    .type('Application/json')
    .send(pikachu)
    .expect(200)
    .then((response) => {
      expect(response.body).toMatchObject(pikachu)
    })
})

test('pokemons.create with invalid params', () => {
  const pikachu = {
    price: 'adsas',
    stock: '!#@!$'
  }

  return request(app)
    .post('/pokemons')
    .type('Application/json')
    .send(pikachu)
    .expect(400)
    .then((response) => {
      expect(response.body).toHaveProperty('errors')
      expect(response.body).toEqual(expect.objectContaining({
        errors: [
          {
            message: 'name is required and can only contain letters with 1 to 255 characters',
            parameter_name: 'name',
            type: 'invalid_parameter'
          },
          {
            message: 'price must be a decimal number',
            parameter_name: 'price',
            type: 'invalid_parameter'
          },
          {
            message: 'stock must be a integer',
            parameter_name: 'stock',
            type: 'invalid_parameter'
          }
        ]
      }))
    })
})

test('pokemons.list after create ', () => {
  const pokemons = [{
    id: expect.stringMatching(idRegex),
    name: 'pikachu',
    price: 15.56,
    stock: 3,
    createdAt: expect.stringMatching(iso8601Regex),
    updatedAt: expect.stringMatching(iso8601Regex)
  }]

  return request(app)
    .get('/pokemons')
    .expect(200)
    .then((response) => {
      expect(response.body.length).toBe(1)
      expect(response.body).toEqual(expect.arrayContaining(pokemons))
    })
})

test('pokemons.buy', () => {
  const pokemonToBuy = {
    name: 'pikachu',
    quantity: 2
  }

  return request(app)
    .post('/pokemons/buy')
    .type('Application/json')
    .send(pokemonToBuy)
    .expect(200)
    .then((response) => {
      expect(response.body).toHaveProperty('status', 'paid')
      expect(response.body).toHaveProperty('amount', 3112)
    })
})

test('pokemons.buy not found', () => {
  const pokemonToBuy = {
    name: 'bulbasaur',
    quantity: 3
  }

  return request(app)
    .post('/pokemons/buy')
    .type('Application/json')
    .send(pokemonToBuy)
    .expect(404)
    .then((response) => {
      expect(response.body).toHaveProperty('error')
      expect(response.body.error).toEqual(expect.stringContaining('not found'))
    })
})

test('pokemons.buy with invalid params', () => {
  const pokemonToBuy = {
    quantity: 2.15
  }

  return request(app)
    .post('/pokemons/buy')
    .type('Application/json')
    .send(pokemonToBuy)
    .expect(400)
    .then((response) => {
      expect(response.body).toHaveProperty('errors')
      expect(response.body).toEqual(expect.objectContaining({
        errors: [
          {
            message: 'name is required and can only contain letters with 1 to 255 characters',
            parameter_name: 'name',
            type: 'invalid_parameter'
          },
          {
            message: 'quantity is required and must be an integer',
            parameter_name: 'quantity',
            type: 'invalid_parameter'
          }
        ]
      }))
    })
})

test('pokemons.list after bought ', () => {
  const pokemons = [{
    id: expect.stringMatching(idRegex),
    name: 'pikachu',
    price: 15.56,
    stock: 1,
    createdAt: expect.stringMatching(iso8601Regex),
    updatedAt: expect.stringMatching(iso8601Regex)
  }]

  return request(app)
    .get('/pokemons')
    .expect(200)
    .then((response) => {
      expect(response.body.length).toBe(1)
      expect(response.body).toEqual(expect.arrayContaining(pokemons))
    })
})

test('pokemons.buy not enough ', () => {
  const pokemonToBuy = {
    name: 'pikachu',
    quantity: 5
  }

  return request(app)
    .post('/pokemons/buy')
    .type('Application/json')
    .send(pokemonToBuy)
    .expect(400)
    .then((response) => {
      expect(response.body).toHaveProperty('error')
      expect(response.body.error).toEqual(expect.stringContaining('Not enought pikachu in stock: '))
    })
})
