const { FinancialTransactionError } = require('../../errors/index')
const Order = require('./order')
const Invoice = require('./invoice')
const PagarmeService = require('./pagarmeService')

const paymentService = new PagarmeService()

function Checkout (pokemon, quantity) {
  this.invoice = new Invoice(pokemon, quantity)
  this.order = new Order(this.invoice)
}

Checkout.prototype = {
  pay (card) {
    return this.order.dispatch().then((payment) =>
      paymentService.doTransaction(card, this.invoice).then(transaction =>
        this.writeOffPayment(transaction, payment).then(() => transaction)
      )
    )
  },

  writeOffPayment (transaction, payment) {
    if (paymentService.didFail(transaction)) {
      return this.order.abort(payment).then(() =>
        Promise.reject(new FinancialTransactionError(transaction))
      )
    }

    return this.order.confirm(payment)
  }
}

module.exports = Checkout
