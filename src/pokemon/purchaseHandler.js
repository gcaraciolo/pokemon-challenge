const Promise = require('bluebird')
const FinancialTransactionError = require('../errors/financialTransactionError')
const StockHandler = require('./stockHandler')
const FinancialTransactionHandler = require('./financialTransactionHandler')
const models = require('../database/models')

const Payment = models.payments

class PurchaseHandler {
  constructor (pokemon, card, quantity) {
    this.payment = undefined
    this.pokemon = pokemon
    this.card = card
    this.quantity = quantity
  }

  coordinatePurchase () {
    const stockHandler = new StockHandler(this.pokemon.id)
    const financialTransactionHandler = new FinancialTransactionHandler()

    return stockHandler.remove(this.quantity)
      .then(() => {
        return Payment.create({
          pokemon_id: this.pokemon.id,
          quantity: this.quantity
        }).then(payment => {
          this.payment = payment
        })
      })
      .then(() => {
        return financialTransactionHandler.generateClient()
          .then(() => {
            return financialTransactionHandler.cryptCard(this.card)
          })
          .then(cryptedCard => {
            const amout = Math.round(this.pokemon.price * this.quantity * 100)
            return financialTransactionHandler.makeTransaction({
              amount: amout,
              card_hash: cryptedCard,
              metadata: {
                product: 'pokemon',
                name: this.pokemon.name,
                quantity: this.quantity
              }
            })
          })
      })
      .then(transaction => {
        if (transaction.status !== 'paid') {
          throw new FinancialTransactionError(transaction)
        }

        return this.payment.confirm()
          .then(() => transaction)
      })
      .catch(error => {
        return this.payment.abort()
          .then(() => {
            return stockHandler.add(this.quantity)
          })
          .then(() => {
            throw new FinancialTransactionError(null, error)
          })
      })
  }
}

module.exports = PurchaseHandler
