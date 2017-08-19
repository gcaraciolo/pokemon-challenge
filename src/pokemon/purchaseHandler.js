const FinancialTransactionError = require('../errors/financialTransactionError')
const StockHandler = require('./stockHandler')
const FinancialTransactionHandler = require('./financialTransactionHandler')
const PagarmeHelper = require('../utils/pagarmeHelper')
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
    const ftHandler = new FinancialTransactionHandler(new PagarmeHelper())
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
      .then(() => transaction)
  }

  // TODO: open transaction
  cancelPurchase () {
    return this.payment.abort()
      .then(() => {
        return this.stockHandler.add(this.quantity)
      })
  }

  coordinatePurchase () {
    return this.preparePurchase()
      .then(() => this.makePurchase())
      .then(transaction => this.finalizePurchase(transaction))
  }
}

module.exports = PurchaseHandler
