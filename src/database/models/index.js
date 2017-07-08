const Sequelize = require('sequelize');
const fs = require('fs');
const cls = require('continuation-local-storage');
const config = require('../config');

let models = {};

let sequelize = new Sequelize(
	config.database,
	config.username,
	config.password,
	config.options
);

Sequelize.cls = cls.createNamespace(require('../../../package.json').name);

fs
	.readdirSync(__dirname)
	.filter(f => !f.includes('index'))
	.map(modelFile => {
		let model = sequelize.import(__dirname + '/' + modelFile);
		models[model.name] = model;
		return model;
	})
	.forEach(model => model.associate(models));

module.exports = models;
module.exports.sequelize = sequelize;
module.exports.Sequelize = Sequelize;
