const Promise = require('bluebird')

const pagarmeClient = require('../pagarmeClient')
const PaymentError = require('./paymentError')
const InventoryError = require('./inventoryError')

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

const checkInventory = (pokemon, quantity) => {
	if (pokemon.stock < quantity) {
		throw new InventoryError('Not enought ' + pokemon.name + ' in stock: ' + pokemon.stock)
	}
	return pokemon
}

const updatePokemonStock = (pokemon, quantity) =>
	sequelize.transaction(t => 
		Pokemon
			.findOne({
				where: {
					id: pokemon.id
				}
			}, { transaction: t })
			.then(pokemon => checkInventory(pokemon, quantity))
			.then(pokemon => 
				Pokemon
					.update({
						stock: pokemon.stock - quantity
					}, {
						where: {
							id: pokemon.id
						}
					}, { transaction: t })
			)
	)

const buy = (pokemon, quantity, card) =>
	updatePokemonStock(pokemon, quantity)
		.then(() => pagarmeClient.getPagarmeClient())
		.then(client => processPurchase(client, pokemon, quantity, card))
		.then(transaction => checkTransaction(transaction))
		.catch(PaymentError, error => handlePaymentError(error))

module.exports = {
	buy
}
