const app = require('../../src/api/app')
const models = require('../../src/database/models')
const constants = require('../../src/constants.js')

global.app = app

before(function (done) {
  models.sequelize.sync({ force: true }).then(() => {
    app.listen(constants.SERVER_PORT, () => done())
  })
})
