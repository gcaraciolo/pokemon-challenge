const Promise = require('bluebird')

const pagarmeClient = require('../pagarmeClient')
const PaymentError = require('../errors').PaymentError
const pokemonStockHandler = require('./pokemonStockHandler')

const Pokemon = require('../database/models').pokemon

const checkTransaction = transaction => {
	if (transaction.status !== 'paid') {
		throw new PaymentError(transaction)
	}
}

const buyPokemon = (client, pokemon, quantity, cardHash) =>
	client.transactions
		.create({
			amount: pagarmeClient.parseValue(pokemon.price * quantity),
			card_hash: cardHash,
			metadata: {
				product: 'pokemon',
				name: pokemon.name,
				quantity: quantity
			}
		})

const handlePaymentError = (error, payment) => console.log(error) ||
	pokemonStockHandler
		.revertPokemonStock(payment)
		.then(() => {
			throw new Error('Some goes wrong with the payment')
		})

const processPurchase = (pokemon, quantity, card, payment) =>
	pagarmeClient
		.getPagarmeClient()
		.then(client => 
			client.security
				.encrypt(card)
				.then(cardHash => buyPokemon(client, pokemon, quantity, cardHash))
		)
		.catch(PaymentError, error => handlePaymentError(error, payment))

const buy = (pokemon, quantity, card) =>
	pokemonStockHandler
		.decreasePokemonStock(pokemon.id, quantity)
		.then(payment => processPurchase(pokemon, quantity, card, payment))
		.then(transaction => {
			checkTransaction(transaction)
			return transaction
		})

module.exports = {
	buy
}
