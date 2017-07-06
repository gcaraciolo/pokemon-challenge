const pagarme = require('pagarme')

const app = require('./app')
const models = require('./database/models')

models.sequelize.sync().then(() => {
	app.listen(3000, function () {
		console.log('Listening on http://localhost:3000');
		api()
	});
})

function buyPokemon(pokemon, req) {
	const card = {
		card_number: '4024007138010896',
		card_expiration_date: '1050',
		card_holder_name: 'Ash Ketchum',
		card_cvv: '123'
	}

	function getPagarmeclient() {
		return pagarme.client.connect({ api_key: 'ak_test_WHgSu2XFmvoopAZMetV3LfA2RfEEQg' })
	}

	function buy(client) {
		return client.security.encrypt(card)
			.then(card_hash => {
				return client.transactions.create({
					amount: pokemon.price * req.body.quantity * 100,
					card_hash: card_hash,
					metadata: {
						product: 'pokemon',
						name: pokemon.name,
						quantity: req.body.quantity
					}
				})
			})
	}

	return getPagarmeclient()
		.then(client => buy(client))
		// .then(client => client.security.encrypt(card))
  		// .then(card_hash => {
  		// })
  		.then(transaction => {
  			if (transaction.status == 'paid') {
				pokemon.stock = pokemon.stock - req.body.quantity;
				return pokemon.save().then(pokemon => {
					return transaction
				})
			}
  		})
}

function api() {
	const Pokemon = models.pokemon

	app.get('/get-pokemons', function (req, res) {
		Pokemon.findAll()
			.then(function listOfPokemons(pokemons){
				res.send(pokemons);
			})
	});

	app.put('/create-pokemons', function (req, res) {
		Pokemon.create(req.body)
			.then(function sendPokemon(pokemon){
				res.send(pokemon)
			})
	});

	app.post('/buy-pokemons', function (req, res) {
		Pokemon.findOne({
			where: {
				name: req.body.name
			}
		})
		.then(function(pokemon) {
			if (pokemon.stock < req.body.quantity) {
				return res.status(400).send({
					error: 'Not enought ' + pokemon.name + ' in stock: ' + pokemon.stock
				})
			}

			return buyPokemon(pokemon, req).then((body) => {
				res.send(body)
			}).catch(function (err){
				console.log(err)
				throw new Error('Something goes wrong')
			})
		})
		.catch(function (err) {
			return res.status(400).send(err.message);
		})
	});
}

module.exports = app;
