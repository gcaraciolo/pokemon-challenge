const pagarmeHelper = require('../utils/pagarmeHelper')

function Invoice (pokemon, quantity) {
  this.pokemon = pokemon
  this.quantity = quantity
}

Invoice.prototype = {
  amount () {
    return pagarmeHelper.parseAmount(this.pokemon.price * this.quantity)
  },

  metadata () {
    return {
      product: 'pokemon',
      name: this.pokemon.name,
      quantity: this.quantity
    }
  }
}

module.exports = Invoice
