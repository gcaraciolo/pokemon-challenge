const InventoryError = require('../../pokemon/inventoryError')

module.exports = function(sequelize, DataTypes) {
	var Pokemon = sequelize.define('pokemon', {
		name: {
			type: DataTypes.STRING,
			allowNull: false
		},
		price: {
			type: DataTypes.FLOAT,
			allowNull: false
		},
		stock: {
			type: DataTypes.INTEGER,
			allowNull: true,
			defaultValue: 1
		}
	}, {
		classMethods: {
			associate: function(models) {
			},
			updatePokemonStock: (pokemonId, quantity) =>
				sequelize.transaction(t => 
					Pokemon
						.findOne({
							where: {
								id: pokemonId
							}
						}, { transaction: t })
						.then(pokemon => {
							pokemon.checkInventory(quantity)
							Pokemon
								.update({
									stock: pokemon.stock - quantity
								}, {
									where: {
										id: pokemonId
									}
								}, { transaction: t })
							}
						)
				)
		},
		instanceMethods: {
			checkInventory: function(quantity) {
				if (this.stock < quantity) {
					throw new InventoryError('Not enought ' + this.name + ' in stock: ' + this.stock)
				}
			}
		}
	});

	return Pokemon;
};
