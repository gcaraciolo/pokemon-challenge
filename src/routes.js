const routes = require('express').Router()

const pokemon = require('./pokemon')

routes.use(pokemon.pokemonRoutes)

module.exports = routes
