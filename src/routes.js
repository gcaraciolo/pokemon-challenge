const routes = require('express').Router()

const pokemon = require('./pokemon')

routes.use('/pokemons', pokemon.pokemonRoutes)

module.exports = routes
