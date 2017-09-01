function Invoice (pokemon, quantity) {
  this.pokemon = pokemon
  this.quantity = quantity
}

Invoice.prototype = {
  amount () {
    return this.pokemon.price * this.quantity
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
