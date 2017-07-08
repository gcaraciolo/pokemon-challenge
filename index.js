const app = require('./src/app')
const models = require('./src/database/models')
const apiErrorHandler = require('./src/apiErrorHandler')
const pokemon = require('./src/pokemon')

models.sequelize.sync().then(() => {
	app.use(pokemon.api)

	app.use(apiErrorHandler)

	app.listen(3000, function () {
		console.log('Listening on http://localhost:3000');
	});
})

module.exports = app;
