const app = require('./src/app')
const models = require('./src/database/models')
const apiErrorHandler = require('./src/apiErrorHandler')
const pokemon = require('./src/pokemon')
const constants = require('./constants.js')

const ready = () => console.log(`Server listening on port ${constants.SERVER_PORT}`)

models.sequelize.sync().then(() => {
  app.use(pokemon.pokemonRoutes)

  app.use(apiErrorHandler.notFound)
  app.use(apiErrorHandler.invalidParameter)
  app.use(apiErrorHandler.serverError)

  app.listen(constants.SERVER_PORT, ready)
})

module.exports = app
