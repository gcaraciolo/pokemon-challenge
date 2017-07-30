const app = require('express').Router()
const Joi = require('joi')
const paramValidation = require('express-validation')

const pokemonController = require('./pokemonController')

app.get('/pokemons', pokemonController.list)

app.post('/pokemons',
  paramValidation({
    body: {
      name: Joi.string().alphanum()
        .min(1).max(255)
        .required(),
      price: Joi.number().required(),
      stock: Joi.number().integer()
    }
  }),
  pokemonController.create
)

app.post('/pokemons/buy',
  paramValidation({
    body: {
      name: Joi.string().alphanum()
        .min(1).max(255)
        .required(),
      quantity: Joi.number().integer().required()
    }
  }),
  pokemonController.buy
)

module.exports = app
