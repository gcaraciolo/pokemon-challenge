const PaymentRepository = require('./paymentRepository')
const Stock = require('./stock')
const transactionHelper = require('../utils/transactionHelper')

function Checkout (invoice) {
  this.invoice = invoice
  this.paymentRepository = new PaymentRepository()
  this.stock = new Stock(invoice.pokemon.id)
}

Checkout.prototype = {
  dispatch () {
    return transactionHelper.openReadCommitted((transaction) => {
      return this.stock.remove(this.invoice.quantity, transaction).then(() => {
        return this.paymentRepository.create(this.invoice.pokemon.id, this.invoice.quantity, transaction)
      })
    })
  },

  abort (payment) {
    return transactionHelper.openReadCommitted((transaction) => {
      return this.paymentRepository.abort(payment.id, transaction).then(() => {
        return this.stock.add(this.invoice.quantity, transaction)
      })
    })
  }
}

module.exports = Checkout
