const models = require('../database/models')
const PurchaseHandler = require('./purchaseHandler')
const errors = require('../errors')
const InventoryError = errors.InventoryError
const apiError = errors.apiError

const Pokemon = models.pokemons

// mock card
const card = {
  card_number: '4024007138010896',
  card_expiration_date: '1050',
  card_holder_name: 'Ash Ketchum',
  card_cvv: '123'
}

const list = (req, res, next) =>
  Pokemon
    .findAll()
    .then((pokemons) => {
      res.send(pokemons)
    })
    .catch(next)

const create = (req, res, next) =>
  Pokemon
    .create(req.body)
    .then((pokemon) => {
      res.status(201).json(pokemon)
    })
    .catch(next)

const buy = (req, res, next) =>
  Pokemon
    .findOne({
      where: {
        name: req.body.name
      }
    })
    .then((pokemon) => {
      if (!pokemon) {
        return res.status(404).json(apiError.controllerError(
          [
            `${req.body.name} not found`
          ]
        ))
      }

      const purchaseHandler = new PurchaseHandler(pokemon, card, req.body.quantity)

      return purchaseHandler.preparePurchase()
        .then(() => purchaseHandler.makePurchase())
        .then(transaction => {
          return purchaseHandler.finalizePurchase(transaction)
            .then(() => res.send(transaction))
        })
    })
    .catch(InventoryError, error =>
      res.status(400).json(apiError.controllerError(
        [
          error.message
        ]
      ))
    )
    .catch(next)

module.exports = {
  list,
  create,
  buy
}
