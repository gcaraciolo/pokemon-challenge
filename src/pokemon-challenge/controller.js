const { FinancialTransactionError } = require('../errors')
const Checkout = require('./checkout')
const Invoice = require('./invoice')
const PagarmeService = require('./pagarmeService')

const paymentService = new PagarmeService()

function Controller (pokemon, quantity) {
  this.invoice = new Invoice(pokemon, quantity)
  this.checkout = new Checkout(this.invoice)
}

Controller.prototype = {
  execute (card) {
    return this.checkout.dispatch().then((payment) => {
      return paymentService.doTransaction(card, this.invoice).then(transaction => {
        if (transaction.status !== 'paid') {
          return this.checkout.abort(payment).then(() =>
            Promise.reject(new FinancialTransactionError(transaction))
          )
        }

        return payment.confirm().then(() => transaction)
      })
    })
  }
}

module.exports = Controller
