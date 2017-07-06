const constants = require('../constants');

module.exports = {
	username: constants.DB_USER,
	password: constants.DB_PASSWORD,
	database: constants.DB_NAME,
	options: {
		host: constants.DB_HOST,
		dialect: constants.DB_DIALECT,
		port: constants.DB_PORT
	}
};
