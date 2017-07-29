const models = require('../database/models')
const buyPokemon = require('./buyPokemon')
const InventoryError = require('../errors').InventoryError

const Pokemon = models.pokemon

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
      res.send(pokemon)
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
        return res.status(404).send({
          error: `${req.body.name} not found`
        })
      }

      return buyPokemon
        .buy(pokemon, req.body.quantity, card)
        .then(transaction =>
          res.send(transaction)
        )
    })
    .catch(InventoryError, error =>
      res.status(400).send({
        error: error.message
      })
    )
    .catch(next)

module.exports = {
  list,
  create,
  buy
}
