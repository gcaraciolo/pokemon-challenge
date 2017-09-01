const Stock = require('./stock')
const transactionHelper = require('../../utils/transactionHelper')
const { Payment } = require('../../database/models')

function Order (invoice) {
  this.invoice = invoice
  this.stock = new Stock(invoice.pokemon.id)
}

Order.prototype = {
  dispatch () {
    return transactionHelper.openReadCommitted((transaction) =>
      this.stock.remove(this.invoice.quantity, transaction).then(() =>
        Payment.createWithinTransaction(this.invoice.pokemon.id, this.invoice.quantity, transaction)
      )
    )
  },

  abort (payment) {
    return transactionHelper.openReadCommitted((transaction) =>
      Payment.setFailedWithinTransaction(payment.id, transaction).then(() =>
        this.stock.add(this.invoice.quantity, transaction)
      )
    )
  },

  confirm (payment) {
    return payment.confirm()
  }
}

module.exports = Order
