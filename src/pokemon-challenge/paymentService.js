function PaymentService (client) {
  this.client = client
}

PaymentService.prototype = {
  doTransaction (card, invoice) {
    return this.client.security.encrypt(card).then(hash => {
      return this.client.transactions.create({
        amount: invoice.amount(),
        card_hash: hash,
        metadata: invoice.metadata()
      })
    })
  }
}

module.exports = PaymentService
