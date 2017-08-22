const routes = require('express').Router()

const pokemonRoutes = require('./pokemon/pokemonRouter')

routes.use('/pokemons', pokemonRoutes)

module.exports = routes
