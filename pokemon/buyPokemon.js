const pagarmeClient = require('../pagarmeClient')

function buy(pokemon, card, quantity) {
	function buyPokemon(client) {
		return client.security.encrypt(card)
			.then(card_hash => {
				return client.transactions.create({
					amount: pokemon.price * quantity * 100, //multiplied by 100 due to pagarme interface
					card_hash: card_hash,
					metadata: {
						product: 'pokemon',
						name: pokemon.name,
						quantity: quantity
					}
				})
			})
	}

	return pagarmeClient.getPagarmeClient()
		.then(client => buyPokemon(client))
  		.then(transaction => {
  			if (transaction.status !== 'paid') {
				throw new Error('Error when bought pokemon: ' + pokemon.name 
					+ '. Transaction status: ' + transaction.status)
			}
			return transaction
  		})
  		.then(transaction => {
			pokemon.stock = pokemon.stock - quantity;
			return pokemon.save().then(() => transaction)
		})
}

module.exports = {
	buy: buy
}
