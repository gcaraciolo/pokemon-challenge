const InventoryError = require('../../errors').InventoryError
const models = require('./')

const Payment = models.payment

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
			getPokemonWithLockForUpdate: (pokemonId, t) =>
				Pokemon
					.findOne({
						where: {
							id: pokemonId
						},
						lock: {
							level: t.LOCK.UPDATE,
							of: Payment
						}
					})
			,
			decreasePokemonStock: (pokemon, quantity) =>
				Pokemon
					.update({
						stock: pokemon.stock - quantity
					}, {
						where: {
							id: pokemon.id
						}
					})
			,
			increasePokemonStock: (pokemon, quantity) =>
				Pokemon
					.update({
						stock: pokemon.stock + quantity
					}, {
						where: {
							id: pokemon.id
						}
					})
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
