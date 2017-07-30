const pokemonRoutes = require('express').Router()
const pokemonController = require('./pokemonController')
const parameterValidator = require('../parameterValidator')

pokemonRoutes.get('/pokemons', pokemonController.list)

pokemonRoutes.post('/pokemons',
  parameterValidator((req) => {
    req.checkBody('name', 'name is required and can only contain letters with 1 to 255 characters')
      .isAlpha().isLength({ min: 1, max: 255 })
    req.checkBody('price', 'price must be a decimal number').isDecimal()
    req.checkBody('stock', 'stock must be a integer').isInt()
  }),
  pokemonController.create
)

pokemonRoutes.post('/pokemons/buy',
  parameterValidator((req) => {
    req.checkBody('name', 'name is required and can only contain letters with 1 to 255 characters')
      .isAlpha().isLength({ min: 1, max: 255 })
    req.checkBody('quantity', 'quantity is required and must be an integer').isInt()
  }),
  pokemonController.buy
)

module.exports = pokemonRoutes
