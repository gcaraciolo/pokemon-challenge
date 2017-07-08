const models = require('../database/models')

const sequelize = models.sequelize
const Sequelize = models.Sequelize
const Pokemon = models.pokemon

const getPokemon = pokemonId =>
	Pokemon
		.findOne({
			where: {
				id: pokemonId
			},
			lock: {
				level: 'update'
			}
		})

const updatePokemonStock = (pokemon, quantity) =>
	Pokemon
		.update({
			stock: pokemon.stock - quantity
		}, {
			where: {
				id: pokemon.id
			}
		})

const decreasePokemonStock = (pokemonId, quantity) =>
	sequelize.transaction({
		isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.READ_COMMITTED
	}, t =>
		getPokemon(pokemonId)
			.then(pokemon => {
				pokemon.checkInventory(quantity)
				return updatePokemonStock(pokemon, quantity)
			})
	)

const revertPokemonStock = (payment) => {
	console.log('should revert payment')
}

module.exports = {
	decreasePokemonStock,
	revertPokemonStock
}
