function PaymentService (pagarmeHelper) {
  this.pagarmeHelper = pagarmeHelper
}

PaymentService.prototype = {
  charge (card, amount, metadata) {
    return this.pagarmeHelper.createClient().then(client => {
      return client.security.encrypt(card).then(hash => {
        return client.transactions.create({
          amount: amount,
          card_hash: hash,
          metadata: metadata
        })
      })
    })
  }
}

module.exports = PaymentService
