const expect = require('chai').expect
const PurchaseHandler = require('../../../src/pokemon/purchaseHandler')
const StockHandler = require('../../../src/pokemon/stockHandler')
const FinancialTransactionError = require('../../../src/errors/financialTransactionError')
const models = require('../../../src/database/models')

const Pokemon = models.pokemons

describe('PurchaseHandler', function () {
  let pikachu
  this.timeout(0)

  beforeEach(function () {
    return Pokemon.create({ name: 'Pikachu', price: 12.5, stock: 3 })
      .then(pokemon => {
        pikachu = pokemon
      })
  })

  describe('#coordinatePurchase()', function () {
    it('should coordinate purchase', function () {
      const card = {
        card_number: '4024007138010896',
        card_expiration_date: '1050',
        card_holder_name: 'Ash Ketchum',
        card_cvv: '123'
      }
      const purchaseHandler = new PurchaseHandler(pikachu, card, 2)

      return purchaseHandler.coordinatePurchase()
        .then(transaction => {
          expect(transaction).to.be.an('object')
          expect(transaction).to.have.property('status').to.equal('paid')
          expect(transaction).to.have.property('amount').to.equal(Math.round(12.5 * 2 * 100))
        })
        .then(() => {
          const stockHandler = new StockHandler(pikachu.id)

          return stockHandler.inStock()
            .then(stock => {
              expect(stock).to.equal(1)
            })
        })
    })

    it('should throw FinancialTransactionError', function () {
      const card = {
        card_number: '4024007138010896',
        card_expiration_date: '1050',
        card_holder_name: 'Ash Ketchum',
        card_cvv: '12'
      }
      const purchaseHandler = new PurchaseHandler(pikachu, card, 2)
      return purchaseHandler.coordinatePurchase()
        .then(() => {
          throw new Error('cannot arrive here')
        })
        .catch(() => {
          const stockHandler = new StockHandler(pikachu.id)

          return stockHandler.inStock()
            .then(stock => {
              expect(stock).to.equal(3)
            })
        })
    })
  })
})
