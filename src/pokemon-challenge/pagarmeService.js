const pagarmeHelper = require('../utils/pagarmeHelper')

function PagarmeService () { }

PagarmeService.prototype = {
  doTransaction (card, invoice) {
    return pagarmeHelper.createClient().then(client => {
      return client.security.encrypt(card).then(hash => {
        return client.transactions.create({
          amount: pagarmeHelper.parseAmount(invoice.amount()),
          card_hash: hash,
          metadata: invoice.metadata()
        })
      })
    })
  }
}

module.exports = PagarmeService
