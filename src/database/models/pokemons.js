const InventoryError = require('../../errors').InventoryError
const models = require('./')

const Payment = models.payments

module.exports = (sequelize, DataTypes) => {
  const Pokemon = sequelize.define('pokemons', {
    name: DataTypes.STRING,
    price: DataTypes.FLOAT,
    stock: DataTypes.INTEGER
  }, {
    classMethods: {
      associate () {
      },
      getWithLockForUpdate: (pokemonId, t) =>
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
    },
    instanceMethods: {
      decreaseStock (quantity) {
        if (this.stock < quantity) {
          throw new InventoryError(this.name, this.stock)
        }

        this.stock -= quantity
        return this.save()
      },

      increaseStock (quantity) {
        this.stock += quantity
        return this.save()
      }
    }
  })

  return Pokemon
}
