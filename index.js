const app = require('./src/app')
const models = require('./src/database/models')
const constants = require('./constants.js')

const ready = () => console.log(`Server listening on port ${constants.SERVER_PORT}`)

models.sequelize.sync().then(() => {
  app.listen(constants.SERVER_PORT, ready)
})

module.exports = app
