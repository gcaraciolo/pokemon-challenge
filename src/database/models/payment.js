module.exports = (sequelize, DataTypes) => {
  const Payment = sequelize.define('payment', {
    status: {
      type: DataTypes.STRING,
      defaultValue: 'processing'
    },
    quantity: DataTypes.INTEGER
  }, {
    tableName: 'payments',
    classMethods: {
      associate (models) {
        Payment.belongsTo(models.pokemon, {
          foreignKey: 'pokemon_id',
          as: 'pokemon',
          onDelete: 'cascade'
        })
      }
    }
  })

  Payment.createWithinTransaction = function (pokemonId, quantity, transaction) {
    return Payment.create({
      pokemon_id: pokemonId,
      quantity: quantity
    }, transaction)
  }

  Payment.setFailedWithinTransaction = function (paymentId, transaction) {
    return Payment.update({
      status: 'failed'
    }, {
      where: {
        id: paymentId
      }
    }, transaction)
  }

  Payment.prototype.confirm = function () {
    this.status = 'paid'
    return this.save()
  }

  return Payment
}
