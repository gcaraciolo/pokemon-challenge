const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const PurchaseHandler = require('../../../src/pokemon/purchaseHandler')
const StockHandler = require('../../../src/pokemon/stockHandler')
const FinancialTransactionError = require('../../../src/errors/financialTransactionError')
const models = require('../../../src/database/models')
const cards = require('../support/examples/cards.json')

const expect = chai.expect
const Pokemon = models.pokemons

chai.use(chaiAsPromised)

describe('PurchaseHandler', function () {
  let pikachu

  this.timeout(0)

  beforeEach(function () {
    return Pokemon.create({ name: 'Pikachu', price: 12.5, stock: 3 })
      .then(pokemon => {
        pikachu = pokemon
      })
  })

  afterEach(function () {
    return pikachu.destroy()
  })

  describe('called with', function () {
    context('a valid credit card', function () {
      it('should buy pokemon', function () {
        const purchaseHandler = new PurchaseHandler(pikachu, cards.valid, 2)

        return purchaseHandler.coordinatePurchase()
          .then(transaction => {
            const amoutExpected = Math.round(12.5 * 2 * 100)

            expect(transaction).to.be.an('object')
            expect(transaction).to.have.property('status').to.equal('paid')
            expect(transaction).to.have.property('amount').to.equal(amoutExpected)
          })
          .then(() => {
            const stockHandler = new StockHandler(pikachu.id)

            return stockHandler.inStock()
              .then(stock => {
                return expect(stock).to.equal(1)
              })
          })
      })
    })

    context('an invalid credit card', function () {
      it('should throw FinancialTransactionError', function () {
        const purchaseHandler = new PurchaseHandler(pikachu, cards.invalid, 2)
        return expect(purchaseHandler.coordinatePurchase()).to.eventually
          .be.rejectedWith(FinancialTransactionError)
      })
    })
  })
})
