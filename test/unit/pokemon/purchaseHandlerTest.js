const chai = require('chai')

const PurchaseHandler = require('../../../src/pokemon-challenge/purchase/purchaseHandler')
const models = require('../../../src/database/models')

const cards = require('../support/examples/cards.json')

const expect = chai.expect
const Pokemon = expect.pokemons

describe('PurchaseHandler', function () {
  let purchaseHandler

  beforeEach(function () {
    return Pokemon.create({ name: 'pikachu', price: 13.4, stock: 2 })
      .then((pikachu) => {
        purchaseHandler = new PurchaseHandler(pikachu, cards.valid, 3)
      })
  })

  describe('#preparePurchase()', function () {
    it('TODO')
  })

  describe('#makePurchase()', function () {

  })

  describe('#finalizePurchase()', function () {

  })

  describe('#cancelPurchase()', function () {

  })
})
