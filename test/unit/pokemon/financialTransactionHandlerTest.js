const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const FinancialTransactionHandler = require('../../../src/pokemon/financialTransactionHandler')
const pagarmeHelper = require('../../../src/utils/pagarmeHelper')
const cards = require('../support/examples/cards.json')

const expect = chai.expect

chai.use(chaiAsPromised)

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
