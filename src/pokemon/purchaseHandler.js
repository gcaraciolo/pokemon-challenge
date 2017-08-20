const FinancialTransactionError = require('../errors/FinancialTransactionError')
const StockHandler = require('./stockHandler')
const FinancialTransactionHandler = require('./financialTransactionHandler')
const pagarmeHelper = require('../utils/pagarmeHelper')
const models = require('../database/models')

const Payment = models.payments

class PurchaseHandler {
  constructor (pokemon, card, quantity) {
    this.payment = undefined
    this.pokemon = pokemon
    this.card = card
    this.quantity = quantity

    this.stockHandler = new StockHandler(pokemon.id)
  }

  // TODO: open transaction
  preparePurchase () {
    return this.stockHandler.remove(this.quantity)
      .then(() => {
        return Payment.create({
          pokemon_id: this.pokemon.id,
          quantity: this.quantity
        }).then(payment => {
          this.payment = payment
        })
      })
  }

  makePurchase () {
    const ftHandler = new FinancialTransactionHandler(pagarmeHelper)
    const amount = Math.round(this.pokemon.price * this.quantity * 100)
    const metadata = {
      product: 'pokemon',
      name: this.pokemon.name,
      quantity: this.quantity
    }

    return ftHandler.doTransaction(this.card, amount, metadata)
  }

  finalizePurchase (transaction) {
    if (transaction.status !== 'paid') {
      return this.cancelPurchase(transaction)
        .then(() => Promise.reject(new FinancialTransactionError(transaction)))
    }

    return this.payment.confirm()
  }

  // TODO: open transaction
  cancelPurchase () {
    return this.payment.abort()
      .then(() => {
        return this.stockHandler.add(this.quantity)
      })
  }
}

module.exports = PurchaseHandler
