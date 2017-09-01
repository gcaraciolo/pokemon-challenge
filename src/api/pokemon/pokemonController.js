const Checkout = require('../../pokemon-challenge/purchase/checkout')
const { Pokemon } = require('../../database/models')
const {
  InventoryError,
  NotFoundError,
  ApiError } = require('../../errors')

// mock card
const card = {
  card_number: '4024007138010896',
  card_expiration_date: '1050',
  card_holder_name: 'Ash Ketchum',
  card_cvv: '123'
}

const PokemonController = {
  list (req, res, next) {
    return Pokemon.findAll().then((pokemons) =>
      res.status(200).send(pokemons)
    ).catch(next)
  },
  create (req, res, next) {
    return Pokemon.create(req.body).then((pokemon) =>
      res.status(201).json(pokemon)
    ).catch(next)
  }
}

PokemonController.buy = function (req, res, next) {
  return Pokemon.getByName(req.body.name).then(pokemon => {
    const checkout = new Checkout(pokemon, req.body.quantity)

    return checkout.pay(card)
  }).then((transaction) =>
    res.status(200).json(transaction)
  ).catch(NotFoundError, error =>
    res.status(404).json(new ApiError([error.message]))
  ).catch(InventoryError, error =>
    res.status(400).json(new ApiError([error.message]))
  ).catch(next)
}

module.exports = PokemonController
