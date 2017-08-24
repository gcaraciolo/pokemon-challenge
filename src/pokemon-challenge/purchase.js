const errors = require('../errors')
const models = require('../database/models')
const Stock = require('./stock')
const FinancialTransactionHandler = require('./financialTransactionHandler')
const PaymentRepository = require('./paymentRepository')
const PokemonRepository = require('./pokemonRepository')
const pagarmeHelper = require('../utils/pagarmeHelper')
const transactionHelper = require('../utils/transactionHelper')

const FinancialTransactionError = errors.FinancialTransactionError

function PurchaseHandler (pokemon, quantity) {
  this.pokemon = pokemon
  this.quantity = quantity

  this.paymentRepository = new PaymentRepository(models.payments)
  this.stock = new Stock(pokemon.id, new PokemonRepository(models.pokemons))
}

PurchaseHandler.prototype = {
  prepare () {
    return transactionHelper.openReadCommitted((transaction) => {
      return this.stock.remove(this.quantity, transaction)
        .then(() => {
          return this.paymentRepository.create({
            pokemon_id: this.pokemon.id,
            quantity: this.quantity
          })
        })
    })
  },

  make (card) {
    const ftHandler = new FinancialTransactionHandler(pagarmeHelper)
    const amount = Math.round(this.pokemon.price * this.quantity * 100)
    const metadata = {
      product: 'pokemon',
      name: this.pokemon.name,
      quantity: this.quantity
    }

    return ftHandler.doTransaction(card, amount, metadata)
  },

  finalize (payment, transaction) {
    if (transaction.status !== 'paid') {
      return this.cancel(payment, transaction)
        .then(() => Promise.reject(new FinancialTransactionError(transaction)))
    }

    return payment.confirm()
  },

  cancel (payment) {
    return transactionHelper.openReadCommitted((transaction) => {
      return payment.abort()
        .then(() => {
          return this.stock.add(this.quantity, transaction)
        })
    })
  }
}

module.exports = PurchaseHandler
