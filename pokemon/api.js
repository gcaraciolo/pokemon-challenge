const models = require('../database/models')
const buyPokemon = require('./buyPokemon')
const app = require('express').Router()
const Joi = require('joi')
const paramValidation = require('express-validation')

const Pokemon = models.pokemon

app.get('/get-pokemons', function (req, res, next) {
	Pokemon
		.findAll()
		.then(pokemons => {
			res.send(pokemons);
		})
		.catch(next)
});

app.put('/create-pokemons',
	paramValidation({
		body: {
			name: Joi.string().alphanum().min(1).max(255).required(),
			price: Joi.number().required(),
			stock: Joi.number().integer()
		}
	}), 
	function (req, res, next) {
		Pokemon
			.create(req.body)
			.then(pokemon => {
				res.send(pokemon)
			})
			.catch(next)
	}
);

app.post('/buy-pokemons',
	paramValidation({
		body: {
			name: Joi.string().alphanum().min(1).max(255).required(),
			quantity: Joi.number().integer().required()
		}
	}), 
	function (req, res, next) {
	// mock card
	const card = {
		card_number: '4024007138010896',
		card_expiration_date: '1050',
		card_holder_name: 'Ash Ketchum',
		card_cvv: '123'
	}

	Pokemon
		.findOne({
			where: {
				name: req.body.name
			}
		})
		.then(pokemon => {
			if(!pokemon) {
				return res.status(404).send({
					error: req.body.name + ' not found'
				})
			}

			if (pokemon.stock < req.body.quantity) {
				return res.status(400).send({
					error: 'Not enought ' + pokemon.name + ' in stock: ' + pokemon.stock
				})
			}

			return buyPokemon.buy(pokemon, card, req.body.quantity)
				.then(body => {
					res.send(body)
				}).catch(err => {
					console.log(err)
					throw new Error('Something goes wrong')
				})
		})
		.catch(next)
});

module.exports = app
