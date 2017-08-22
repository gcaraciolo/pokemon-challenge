const models = require('../../database/models')
const PokemonRepository = require('./pokemonRepository')

function StockHandler (pokemonId) {
  this.pokemonId = pokemonId
  this.pokemonRepository = new PokemonRepository(models.pokemons, models.payments)
}

StockHandler.prototype = {
  inStock () {
    return this.pokemonRepository.getById(this.pokemonId)
      .then(pokemon => pokemon => pokemon.stock)
  },

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
