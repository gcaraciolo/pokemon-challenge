const Promise = require('bluebird')

const buyPokemon = require('./buyPokemon')
const models = require('../database/models')
const InventoryError = require('../errors').InventoryError

const Pokemon = models.pokemons

jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000

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

test('pokemon.buy concurrent bought', () => {
  const card = {
    card_number: '4024007138010896',
    card_expiration_date: '1050',
    card_holder_name: 'Ash Ketchum',
    card_cvv: '123'
  }

  function processBuyPokemon () {
    return Pokemon
      .findOne({
        where: {
          name: 'pikachu'
        }
      })
      .then(pokemon => buyPokemon.buy(pokemon, 1, card))
  }

  expect.assertions(2)

  return Promise.all([
    processBuyPokemon(),
    processBuyPokemon(),
    processBuyPokemon()
  ])
    .catch(InventoryError, (error) => {
      expect(error.name).toBe('InventoryError')
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
      expect(pokemon.stock).toBe(0)
    })
    .catch(error => console.log(error))
})

test('pokemon.buy with invalid card', () => {
  const card = {
    card_number: '4024007138010897',
    card_expiration_date: '1050',
    card_holder_name: 'Ash Ketchum',
    card_cvv: '123'
  }

  expect.assertions(2)

  function increasePokemonStock () {
    return Pokemon
      .update({
        stock: 1
      }, {
        where: {
          name: 'pikachu'
        }
      })
  }

  function decreasePokemonStock () {
    return Pokemon
      .update({
        stock: 0
      }, {
        where: {
          name: 'pikachu'
        }
      })
  }

  return increasePokemonStock()
    .then(() =>
      Pokemon
        .findOne({
          where: {
            name: 'pikachu'
          }
        })
    )
    .then(pokemon => buyPokemon.buy(pokemon, 1, card))
    .catch((error) => {
      expect(error.message).toBe('payment error: refused')
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
    .then(() => decreasePokemonStock())
})

afterAll(() =>
  models.sequelize.query('TRUNCATE TABLE pokemons, payments')
)
