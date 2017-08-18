const models = require('../database/models')
const transaction = require('../utils/transaction')

const Pokemon = models.pokemons

const removeFromPokemonStock = (pokemonId, quantity) =>
  transaction.openReadCommitted(t =>
    Pokemon.getWithLockForUpdate(pokemonId, t)
      .then((pokemon) => pokemon.decreaseStock(quantity))
  )

const revertPokemonStock = (payment, status) =>
  transaction.openReadCommitted(t =>
    Pokemon.getWithLockForUpdate(payment.pokemon_id, t)
      .then(pokemon => pokemon.increaseStock(payment.quantity))
  )

module.exports = {
  removeFromPokemonStock,
  revertPokemonStock
}
