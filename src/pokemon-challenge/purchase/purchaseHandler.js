const FinancialTransactionError = require('../../errors').FinancialTransactionError
const StockHandler = require('../pokemon/stockHandler')
const FinancialTransactionHandler = require('../payment/financialTransactionHandler')
const pagarmeHelper = require('../../utils/pagarmeHelper')
const PaymentRepository = require('../payment/paymentRepository')
const transactionHelper = require('../../utils/transactionHelper')
const models = require('../../database/models')

function PurchaseHandler (pokemon, quantity) {
  this.pokemon = pokemon
  this.quantity = quantity

  this.stockHandler = new StockHandler(pokemon.id)
  this.paymentRepository = new PaymentRepository(models.payments)
}

PurchaseHandler.prototype = {
  preparePurchase () {
    return transactionHelper.openReadCommitted((transaction) => {
      return this.stockHandler.remove(this.quantity, transaction)
        .then(() => {
          return this.paymentRepository.create({
            pokemon_id: this.pokemon.id,
            quantity: this.quantity
          })
        })
    })
  },

  makePurchase (card) {
    const ftHandler = new FinancialTransactionHandler(pagarmeHelper)
    const amount = Math.round(this.pokemon.price * this.quantity * 100)
    const metadata = {
      product: 'pokemon',
      name: this.pokemon.name,
      quantity: this.quantity
    }

    return ftHandler.doTransaction(card, amount, metadata)
  },

  finalizePurchase (payment, transaction) {
    if (transaction.status !== 'paid') {
      return this.cancelPurchase(payment, transaction)
        .then(() => Promise.reject(new FinancialTransactionError(transaction)))
    }

    return payment.confirm()
  },

  cancelPurchase (payment) {
    return transactionHelper.openReadCommitted((transaction) => {
      return payment.abort()
        .then(() => {
          return this.stockHandler.add(this.quantity, transaction)
        })
    })
  }
}

module.exports = PurchaseHandler
