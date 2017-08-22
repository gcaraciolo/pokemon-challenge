const expect = require('../../chaiSettings').expect
const FinancialTransactionHandler = require('../../../src/pokemon-challenge/payment/financialTransactionHandler')
const pagarmeHelper = require('../../../src/utils/pagarmeHelper')
const cards = require('../support/examples/cards.json')

describe('FinancialTransactionHandler', function () {
  describe('should buy a product with success', function () {
    const ftHandler = new FinancialTransactionHandler(pagarmeHelper)
    const productMetadata = {
      product: 'pokemon',
      name: 'pikachu',
      quantity: 2
    }

    return expect(ftHandler.doTransaction(cards.valid, 1245, productMetadata))
      .to.eventually.be.an('object')
  })
})
