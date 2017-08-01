const Sequelize = require('sequelize')
const fs = require('fs')
const cls = require('continuation-local-storage')
const config = require('../config')

const models = {}

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
)

Sequelize.cls = cls.createNamespace(require('../../../package.json').name)

fs
  .readdirSync(__dirname)
  .filter(f => !f.includes('index'))
  .map((modelFile) => {
    const model = sequelize.import(`${__dirname}/${modelFile}`)
    models[model.name] = model
    return model
  })
  .forEach(model => model.associate(models))

module.exports = models
module.exports.sequelize = sequelize
module.exports.Sequelize = Sequelize
