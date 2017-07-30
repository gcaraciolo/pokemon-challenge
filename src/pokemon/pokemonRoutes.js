const pokemonRoutes = require('express').Router()
const Joi = require('joi')
const paramValidation = require('express-validation')

const pokemonController = require('./pokemonController')

pokemonRoutes.get('/pokemons', pokemonController.list)

pokemonRoutes.post('/pokemons',
  paramValidation({
    body: {
      name: Joi.string().alphanum()
        .min(1).max(255)
        .required(),
      price: Joi.number()
        .required().label('Pokemon price'),
      stock: Joi.number().integer()
    }
  }),
  pokemonController.create
)

pokemonRoutes.post('/pokemons/buy',
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

module.exports = pokemonRoutes
