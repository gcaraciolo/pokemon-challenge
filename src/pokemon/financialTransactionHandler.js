class FinancialTransactionHandler {

  constructor (pagarmeHelper) {
    this.pagarmeHelper = pagarmeHelper
  }

  doTransaction (card, amount, metadata) {
    return this.pagarmeHelper.createClient()
      .then(client => {
        return client.security.encrypt(card)
          .then(hash => {
            return client.transactions.create({
              amount: amount,
              card_hash: hash,
              metadata: metadata
            })
          })
      })
  }
}

module.exports = FinancialTransactionHandler
