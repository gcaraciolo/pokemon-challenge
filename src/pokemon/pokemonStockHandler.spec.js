const pokemonStockHandler = require('./pokemonStockHandler')
const models = require('../database/models')

const Pokemon = models.pokemon
const Payment = models.payment

const createPokemons = () =>
  Pokemon.create({
    name: 'pikachu',
    price: 15.53,
    stock: 2
  })

beforeAll(() =>
  models.sequelize
    .sync()
    .then(() => models.sequelize.query('TRUNCATE TABLE pokemons, payments'))
    .then(() => createPokemons())
)

test('pokemon.stock remove pokemon from stock', () => {
  const quantity = 1

  expect.assertions(2)

  return Pokemon
    .findOne({
      where: {
        name: 'pikachu'
      }
    })
    .then(pokemon =>
      pokemonStockHandler
        .removeFromPokemonStock(pokemon.id, quantity)
    )
    .then((payment) => {
      expect(payment.status).toBe('processing')
    })
    .then(() =>
      Pokemon
        .findOne({
          where: {
            name: 'pikachu'
          }
        })
    )
    .then((pokemon) => {
      expect(pokemon.stock).toBe(1)
    })
})

test('pokemon.stock revert pokemon stock', () => {
  expect.assertions(2)

  return Pokemon
    .findOne({
      where: {
        name: 'pikachu'
      }
    })
    .then(pokemon =>
      Payment
        .findOne({
          where: {
            pokemon_id: pokemon.id
          }
        })
    )
    .then(payment =>
      pokemonStockHandler
        .revertPokemonStock(payment, 'fail')
    )
    .then(() =>
      Pokemon
        .findOne({
          where: {
            name: 'pikachu'
          }
        })
    )
    .then((pokemon) => {
      expect(pokemon.stock).toBe(2)

      return Payment
        .findOne({
          where: {
            pokemon_id: pokemon.id
          }
        })
    })
    .then((payment) => {
      expect(payment.status).toBe('fail')
    })
})

afterAll(() =>
  models.sequelize.query('TRUNCATE TABLE pokemons, payments')
)
