const pagarmeClient = require('../pagarmeClient')

const checkTransaction = transaction => {
	if (transaction.status !== 'paid') {
		throw new Error('Error when bought pokemon: ' + pokemon.name 
			+ '. Transaction status: ' + transaction.status)
	}
	return transaction
}

const buyPokemon = (client, pokemon, quantity, cardHash) =>
	client.transactions.create({
		amount: pokemon.price * quantity * 100, //multiplied by 100 due to pagarme interface
		card_hash: cardHash,
		metadata: {
			product: 'pokemon',
			name: pokemon.name,
			quantity: quantity
		}
	})

const updatePokemonStock = (pokemon, quantity) => {
	pokemon.stock = pokemon.stock - quantity;
	return pokemon.save()
}

const processPurchase = (client, pokemon, quantity, card) =>
	client.security
		.encrypt(card)
		.then(cardHash => buyPokemon(client, pokemon, quantity, cardHash))
		.then(transaction => checkTransaction(transaction))

const buy = (pokemon, quantity, card) => 
	pagarmeClient
		.getPagarmeClient()
		.then(client => processPurchase(client, pokemon, quantity, card))
		.then(transaction => {
			return updatePokemonStock(pokemon, quantity).then(() => transaction)
		})

module.exports = {
	buy
}
