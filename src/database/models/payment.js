module.exports = function(sequelize, DataTypes) {
	var Payment = sequelize.define('payment', {
		status: {
			type: DataTypes.STRING,
			allowNull: true,
			defaultValue: 'processing'
		},
		quantity: {
			type: DataTypes.INTEGER,
			allowNull: false
		}
	}, {
		classMethods: {
			associate: function(models) {
				Payment.belongsTo(models.pokemon, {
					foreignKey: 'pokemon_id',
					as: 'pokemon'
				})
			},
			createPayment: (pokemonId, quantity) =>
				Payment
					.create({
						pokemon_id: pokemonId,
						quantity: quantity
					})
			,
			confirmPayment: (payment, status) =>
				Payment
					.update({
						status: status
					}, {
						where: {
							id: payment.id
						}
					})
			,
			cancelPayment: (payment, status) =>
				Payment
					.update({
						status: status
					}, {
						where: {
							id: payment.id
						}
					})
		}
	});

	return Payment;
};
