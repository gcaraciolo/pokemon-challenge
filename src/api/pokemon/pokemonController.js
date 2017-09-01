const models = require('../../database/models')
const Checkout = require('../../pokemon-challenge/checkout')
const PokemonRepository = require('../../pokemon-challenge/pokemonRepository')
const PaymentRepository = require('../../pokemon-challenge/paymentRepository')
const {
  InventoryError,
  NotFoundError,
  ApiError } = require('../../errors')

const pokemonRepository = new PokemonRepository(models.pokemons)
const paymentRepository = new PaymentRepository(models.payments)
const checkout = new Checkout(pokemonRepository, paymentRepository)

// mock card
const card = {
  card_number: '4024007138010896',
  card_expiration_date: '1050',
  card_holder_name: 'Ash Ketchum',
  card_cvv: '123'
}

const PokemonController = {
  list (req, res, next) {
    return pokemonRepository.list().then((pokemons) =>
      res.status(200).send(pokemons)
    ).catch(next)
  },
  create (req, res, next) {
    return pokemonRepository.create(req.body).then((pokemon) =>
      res.status(201).json(pokemon)
    ).catch(next)
  }
}

PokemonController.buy = function (req, res, next) {
  return checkout.execute(req.body, card).then((transaction) =>
    res.status(200).json(transaction)
  ).catch(NotFoundError, error =>
    res.status(404).json(new ApiError([error.message]))
  ).catch(InventoryError, error =>
    res.status(400).json(new ApiError([error.message]))
  ).catch(next)
}

module.exports = PokemonController
