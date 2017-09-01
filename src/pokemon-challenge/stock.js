const Pokemon = require('../database/models').pokemon

function StockHandler (pokemonId) {
  this.pokemonId = pokemonId
}

StockHandler.prototype = {
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

module.exports = StockHandler
