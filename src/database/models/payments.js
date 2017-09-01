module.exports = (sequelize, DataTypes) => {
  const Payment = sequelize.define('payments', {
    status: {
      type: DataTypes.STRING,
      defaultValue: 'processing'
    },
    quantity: DataTypes.INTEGER
  }, {
    classMethods: {
      associate (models) {
        Payment.belongsTo(models.pokemons, {
          foreignKey: 'pokemon_id',
          as: 'pokemon',
          onDelete: 'cascade'
        })
      }
    },
    instanceMethods: {
      confirm () {
        this.status = 'paid'
        return this.save()
      }
    }
  })

  return Payment
}
