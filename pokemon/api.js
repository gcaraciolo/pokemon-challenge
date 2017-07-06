const models = require('../database/models')
const buyPokemon = require('./buyPokemon')
const app = require('express').Router()

const Pokemon = models.pokemon

app.get('/get-pokemons', function (req, res, next) {
	Pokemon
		.findAll()
		.then(pokemons => {
			res.send(pokemons);
		})
		.catch(next)
});

app.put('/create-pokemons', function (req, res, next) {
	Pokemon
		.create(req.body)
		.then(pokemon => {
			res.send(pokemon)
		})
		.catch(next)
});

app.post('/buy-pokemons', function (req, res, next) {
	Pokemon
		.findOne({
			where: {
				name: req.body.name
			}
		})
		.then(pokemon => {
			if (pokemon.stock < req.body.quantity) {
				return res.status(400).send({
					error: 'Not enought ' + pokemon.name + ' in stock: ' + pokemon.stock
				})
			}

			return buyPokemon.buy(pokemon, req.body.quantity)
				.then(body => {
					res.send(body)
				}).catch(function (err){
					console.log(err)
					throw new Error('Something goes wrong')
				})
		})
		.catch(next)
});

module.exports = app
