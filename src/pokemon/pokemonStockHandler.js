const models = require('../database/models')

const sequelize = models.sequelize
const Sequelize = models.Sequelize
const Pokemon = models.pokemon
const Payment = models.payment

const removeFromPokemonStock = (pokemonId, quantity) =>
	sequelize
		.transaction({
			isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.READ_COMMITTED
		}, t =>
			Pokemon.getPokemonWithLockForUpdate(pokemonId, t)
				.then(pokemon => {
					pokemon.checkInventory(quantity)
					return Pokemon.decreasePokemonStock(pokemon, quantity)
				})
				.then(() => Payment.createPayment(pokemonId, quantity))
		)

const revertPokemonStock = (payment, status) =>
	sequelize
		.transaction({
			isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.READ_COMMITTED
		}, t =>
			Pokemon.getPokemonWithLockForUpdate(payment.pokemon_id, t)
				.then(pokemon => Pokemon.increasePokemonStock(pokemon, payment.quantity))
				.then(() => Payment.cancelPayment(payment, status))
		)

module.exports = {
	removeFromPokemonStock,
	revertPokemonStock
}
