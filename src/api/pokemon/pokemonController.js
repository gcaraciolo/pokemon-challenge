const models = require('../../database/models')
const PurchaseService = require('../../pokemon-challenge/purchase/purchaseService')
const errors = require('../../errors')
const InventoryError = errors.InventoryError
const NotFoundError = errors.NotFoundError
const ApiError = errors.ApiError
const PokemonRepository = require('../../pokemon-challenge/pokemon/pokemonRepository')

const pokemonRepository = new PokemonRepository(models.pokemons)
const purchaseService = new PurchaseService(pokemonRepository)

const PokemonController = {
  list (req, res, next) {
    return pokemonRepository.list()
      .then((pokemons) => res.status(200).send(pokemons))
      .catch(next)
  },
  create (req, res, next) {
    return pokemonRepository.create(req.body)
      .then((pokemon) => res.status(201).json(pokemon))
      .catch(next)
  }
}

PokemonController.buy = function (req, res, next) {
  return purchaseService.purchase(req.body)
    .then((transaction) => {
      return res.status(200).json(transaction)
    })
    .catch(NotFoundError, error => {
      return res.status(404).json(new ApiError([error.message]))
    })
    .catch(InventoryError, error => {
      return res.status(400).json(new ApiError([error.message]))
    })
    .catch(next)
}

module.exports = PokemonController
