const expect = require('../../chaiSettings').expect
const models = require('../../../src/database/models')
const cards = require('../support/examples/cards.json')
const PurchaseService = require('../../../src/pokemon-challenge/purchaseService')
const PokemonRepository = require('../../../src/pokemon-challenge/pokemonRepository')

const Pokemon = models.pokemons
const Payment = models.payments

describe('PurchaseService', function () {
  let purchaseService

  this.timeout(0)

  beforeEach(function () {
    return Pokemon.create({ name: 'pikachu', price: 13.4, stock: 2 })
      .then(() => {
        purchaseService = new PurchaseService(new PokemonRepository(models.pokemons))
      })
  })

  afterEach(function () {
    return Pokemon.sync({ force: true })
      .then(() => Payment.sync({ force: true }))
  })

  context('called with an invalid credit card', function () {
    it('should be rejected', function () {
      const result = purchaseService.purchase({ name: 'pikachu', quantity: 1 }, cards.invalid)

      return expect(result).to.eventually.rejected
    })
  })

  context('called with a valid credit card', function () {
    it('should return a pagarme transaction object', function () {
      const result = purchaseService.purchase({ name: 'pikachu', quantity: 1 }, cards.valid)

      return expect(result).to.eventually.contains.keys({
        status: 'paid',
        object: 'transaction'
      })
    })
  })
})
