const Stock = require('./stock')
const transactionHelper = require('../utils/transactionHelper')
const Payment = require('../database/models').payment

function Checkout (invoice) {
  this.invoice = invoice
  this.stock = new Stock(invoice.pokemon.id)
}

Checkout.prototype = {
  dispatch () {
    return transactionHelper.openReadCommitted((transaction) => {
      return this.stock.remove(this.invoice.quantity, transaction).then(() => {
        return Payment.createWithinTransaction(this.invoice.pokemon.id, this.invoice.quantity, transaction)
      })
    })
  },

  abort (payment) {
    return transactionHelper.openReadCommitted((transaction) => {
      return Payment.setFailedWithinTransaction(payment.id, transaction).then(() => {
        return this.stock.add(this.invoice.quantity, transaction)
      })
    })
  }
}

module.exports = Checkout
