const expect = require('chai').expect
const FinancialTransactionHandler = require('../../../src/pokemon/financialTransactionHandler')
const PagarmeHelper = require('../../../src/utils/pagarmeHelper')

describe('FinancialTransactionHandler', function () {
  let financialTransactionHandler
  const card = {
    card_number: '4024007138010896',
    card_expiration_date: '1050',
    card_holder_name: 'Ash Ketchum',
    card_cvv: '123'
  }

  beforeEach(function () {
    const pagarmeHelper = new PagarmeHelper()
    financialTransactionHandler = new FinancialTransactionHandler(pagarmeHelper)

    return financialTransactionHandler.generateClient()
      .then(() => {
        expect(financialTransactionHandler.getClient()).to.be.an('object')
      })
  })

  describe('#cryptCard()', function () {
    it('should crypt card info', function () {
      return financialTransactionHandler.cryptCard(card)
        .then(cryptedCard => {
          expect(cryptedCard).to.be.a('string')
        })
    })
  })

  describe('#makeTransaction()', function () {
    it('should buy something', function () {
      return financialTransactionHandler.cryptCard(card)
        .then(cryptedCard => {
          return financialTransactionHandler.makeTransaction({
            amount: 1245,
            card_hash: cryptedCard,
            metadata: {
              product: 'pokemon',
              name: 'pikachu',
              quantity: 2
            }
          })
        })
        .then(transaction => {
          expect(transaction).to.be.an('object')
        })
    })
  })
})
