const pagarme = require('pagarme')
const constants = require('../../constants')

function PagarmeService () { }

PagarmeService.prototype = {
  doTransaction (card, invoice) {
    return createClient().then(client => {
      return client.security.encrypt(card).then(hash => {
        return client.transactions.create({
          amount: parseAmount(invoice.amount()),
          card_hash: hash,
          metadata: invoice.metadata()
        })
      })
    })
  },

  didFail (transaction) {
    return transaction.status !== 'paid'
  }
}

const createClient = () =>
  pagarme.client.connect({
    api_key: constants.PAGARME_API_KEY
  })

const parseAmount = (amount) => Math.round(amount * 100)

module.exports = PagarmeService
