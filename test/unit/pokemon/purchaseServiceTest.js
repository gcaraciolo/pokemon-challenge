const expect = require('chai').expect
const models = require('../../../src/database/models')
const PurchaseService = require('../../../src/pokemon/purchaseService')

const Pokemon = models.pokemons

describe('PurchaseService', function () {
  const card = {
    card_number: '4024007138010896',
    card_expiration_date: '1050',
    card_holder_name: 'Ash Ketchum',
    card_cvv: '123'
  }

  describe('#purchase()', function () {
    it('should purchase pokemon with success')
  })
})
