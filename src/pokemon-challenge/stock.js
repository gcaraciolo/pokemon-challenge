function StockHandler (pokemonId, pokemonRepository) {
  this.pokemonId = pokemonId
  this.pokemonRepository = pokemonRepository
}

StockHandler.prototype = {
  quantity () {
    return this.pokemonRepository.getById(this.pokemonId)
      .then(pokemon => pokemon.stock)
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
