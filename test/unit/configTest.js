const models = require('../../src/database/models')

function dbClear () {
  return models.sequelize.sync({ force: true })
}

before(dbClear)
