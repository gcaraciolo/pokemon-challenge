const PagarmeHelper = require('../utils/pagarmeHelper')

class FinancialTransactionHandler {
  constructor () {
    this.pagarmeHelper = new PagarmeHelper()
  }

  generateClient () {
    return this.pagarmeHelper.createClient()
  }

  getClient () {
    return this.pagarmeHelper.client
  }

  cryptCard (card) {
    return this.getClient()
      .security
      .encrypt(card)
  }

  makeTransaction (metadata) {
    return this.getClient()
      .transactions
      .create(metadata)
  }
}

module.exports = FinancialTransactionHandler
