module.exports = (sequelize, DataTypes) => {
  const Payment = sequelize.define('payments', {
    status: DataTypes.STRING,
    quantity: DataTypes.INTEGER
  }, {
    classMethods: {
      associate (models) {
        Payment.belongsTo(models.pokemons, {
          foreignKey: 'pokemon_id',
          as: 'pokemon'
        })
      },
      createPayment: (pokemonId, quantity) =>
        Payment
          .create({
            pokemon_id: pokemonId,
            quantity
          }),
      confirmPayment: (payment, status) =>
        Payment
          .update({
            status
          }, {
            where: {
              id: payment.id
            }
          }),
      cancelPayment: (payment, status) =>
        Payment
          .update({
            status
          }, {
            where: {
              id: payment.id
            }
          })
    }
  })

  return Payment
}
