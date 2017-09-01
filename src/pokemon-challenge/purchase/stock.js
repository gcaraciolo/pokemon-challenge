const { Pokemon } = require('../../database/models')

function Stock (pokemonId) {
  this.pokemonId = pokemonId
}

Stock.prototype = {
  add (quantity, transaction) {
    return Pokemon.getByIdWithLock(this.pokemonId, transaction)
      .then((pokemon) => pokemon.increaseStock(quantity)
    )
  },

  remove (quantity, transaction) {
    return Pokemon.getByIdWithLock(this.pokemonId, transaction)
        .then((pokemon) => pokemon.decreaseStock(quantity))
  }
}

module.exports = Stock
