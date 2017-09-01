const PokemonRepository = require('./pokemonRepository')

function StockHandler (pokemonId) {
  this.pokemonId = pokemonId
  this.pokemonRepository = new PokemonRepository()
}

StockHandler.prototype = {
  add (quantity, transaction) {
    return this.pokemonRepository.getByIdWithLockForUpdate(this.pokemonId, transaction)
      .then((pokemon) => pokemon.increaseStock(quantity)
    )
  },

  remove (quantity, transaction) {
    return this.pokemonRepository.getByIdWithLockForUpdate(this.pokemonId, transaction)
        .then((pokemon) => pokemon.decreaseStock(quantity))
  }
}

module.exports = StockHandler
