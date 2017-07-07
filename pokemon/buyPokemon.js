const Promise = require('bluebird')

const pagarmeClient = require('../pagarmeClient')
const PaymentError = require('./paymentError')

const Pokemon = require('../database/models').pokemon
const sequelize = require('../database/models').sequelize

const checkTransaction = transaction => {
	if (transaction.status !== 'paid') {
		throw new PaymentError(transaction)
	}
	return transaction
}

const buyPokemon = (client, pokemon, quantity, cardHash) =>
	client.transactions
		.create({
			amount: pokemon.price * quantity * 100, //multiplied by 100 due to pagarme interface
			card_hash: cardHash,
			metadata: {
				product: 'pokemon',
				name: pokemon.name,
				quantity: quantity
			}
		})

const handlePaymentError = error => {
	console.error('handle payment error')
	throw new Error('Some goes wrong with the payment')
}

const processPurchase = (client, pokemon, quantity, card) =>
	client.security
		.encrypt(card)
		.then(cardHash => buyPokemon(client, pokemon, quantity, cardHash))

const buy = (pokemon, quantity, card) =>
	Pokemon.updatePokemonStock(pokemon.id, quantity)
		.then(() => pagarmeClient.getPagarmeClient())
		.then(client => processPurchase(client, pokemon, quantity, card))
		.then(transaction => checkTransaction(transaction))
		.catch(PaymentError, error => handlePaymentError(error))

module.exports = {
	buy
}
