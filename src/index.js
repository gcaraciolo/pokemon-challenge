const app = require('./api/app')
const models = require('./database/models/index')
const constants = require('./constants.js')

models.sequelize.sync().then(() => {
  app.listen(constants.SERVER_PORT)
})

module.exports = app
