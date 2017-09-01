const { FinancialTransactionError } = require('../../errors')
const PagarmeService = require('./pagarmeService')

const paymentService = new PagarmeService()

function Checkout (order) {
  this.order = order
}

Checkout.prototype = {
  pay (card) {
    return this.order.dispatch().then((payment) =>
      paymentService.doTransaction(card, this.order.invoice).then(transaction =>
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
