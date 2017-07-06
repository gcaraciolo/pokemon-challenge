module.exports = function(sequelize, DataTypes) {
	var Pokemon = sequelize.define('pokemon', {
		name: {
			type: DataTypes.STRING,
			allowNull: false
		},
		price: {
			type: DataTypes.INTEGER,
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
			}
		}
	});

	return Pokemon;
};
