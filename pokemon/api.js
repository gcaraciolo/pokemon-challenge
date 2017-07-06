const models = require('../database/models')
const buyPokemon = require('./buyPokemon')
const app = require('express').Router()

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

		return buyPokemon(pokemon, req.body.quantity).then(transaction => {
			pokemon.stock = pokemon.stock - req.body.quantity;
			return pokemon.save().then(pokemon => {
				return transaction
			})
		}).then((body) => {
			res.send(body)
		}).catch(function (err){
			console.log(err)
			throw new Error('Something goes wrong')
		})
	})
	.catch(function (err) {
		console.log(err)
		return res.status(400).send(err.message);
	})
});

module.exports = app
