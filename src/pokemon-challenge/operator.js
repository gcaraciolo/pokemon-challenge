const Stock = require('./stock')
const transactionHelper = require('../utils/transactionHelper')

function Operator (pokemon, quantity, pokemonRepository, paymentRepository) {
  this.pokemon = pokemon
  this.quantity = quantity
  this.paymentRepository = paymentRepository
  this.stock = new Stock(pokemon.id, pokemonRepository)
}

Operator.prototype = {
  /**
   * get item from stock and create a payment note
   * TODO: rename method
   */
  prepare () {
    return transactionHelper.openReadCommitted((transaction) => {
      return this.stock.remove(this.quantity, transaction).then(() => {
        return this.paymentRepository.create(this.pokemon.id, this.quantity, transaction)
      })
    })
  },

  /**
   * erase payment note and put item back in stock
   * TODO: rename method
   */
  abort (payment) {
    return transactionHelper.openReadCommitted((transaction) => {
      return this.paymentRepository.abort(payment.id, transaction).then(() => {
        return this.stock.add(this.quantity, transaction)
      })
    })
  }
}

module.exports = Operator
