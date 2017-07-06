const pagarmeClient = require('../pagarmeClient')

function buyPokemon(pokemon, quantity) {
	const card = {
		card_number: '4024007138010896',
		card_expiration_date: '1050',
		card_holder_name: 'Ash Ketchum',
		card_cvv: '123'
	}

	function buy(client) {
		return client.security.encrypt(card)
			.then(card_hash => {
				return client.transactions.create({
					amount: pokemon.price * quantity * 100, // wrong value? *100
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
		.then(client => buy(client))
  		.then(transaction => {
  			if (transaction.status !== 'paid') {
  				console.log(transaction)
				throw new Error('Error when bought pokemon: ' + pokemon.name)
			}
			return transaction
  		})
}

module.exports = buyPokemon
