const app = require('./app')
const models = require('./database/models')
const apiErrorHandler = require('./apiErrorHandler')
const pokemon = require('./pokemon')

models.sequelize.sync().then(() => {
	app.use(pokemon.api)

	app.use(apiErrorHandler)

	app.listen(3000, function () {
		console.log('Listening on http://localhost:3000');
	});
})

module.exports = app;
