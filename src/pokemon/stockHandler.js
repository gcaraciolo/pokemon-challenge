const models = require('../../src/database/models')
const transaction = require('../utils/transaction')

const Pokemon = models.pokemons

class StockHandler {
  constructor (pokemonId) {
    this.pokemonId = pokemonId
  }

  inStock () {
    return Pokemon.findOne({
      where: {
        id: this.pokemonId
      }
    }).then(pokemon => pokemon.stock)
  }

  add (quantity) {
    return transaction.openReadCommitted(t =>
        Pokemon.getWithLockForUpdate(this.pokemonId, t)
          .then((pokemon) => pokemon.increaseStock(quantity))
    )
  }

  remove (quantity) {
    return transaction.openReadCommitted(t =>
      Pokemon.getWithLockForUpdate(this.pokemonId, t)
        .then((pokemon) => pokemon.decreaseStock(quantity))
    )
  }
}

module.exports = StockHandler
