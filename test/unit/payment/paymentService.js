const expect = require('../../chaiSettings').expect
const PaymentService = require('../../../src/pokemon-challenge/pagarmeService')
const pagarmeHelper = require('../../../src/utils/pagarmeHelper')
const cards = require('../support/examples/cards.json')

describe('PaymentService', function () {
  describe('should buy a product with success', function () {
    const paymentService = new PaymentService(pagarmeHelper)
    const productMetadata = {
      product: 'pokemon',
      name: 'pikachu',
      quantity: 2
    }

    return expect(paymentService.charge(cards.valid, 1245, productMetadata))
      .to.eventually.be.an('object')
  })
})
