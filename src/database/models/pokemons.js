const InventoryError = require('../../errors').InventoryError

module.exports = (sequelize, DataTypes) => {
  const Pokemon = sequelize.define('pokemons', {
    name: DataTypes.STRING,
    price: DataTypes.FLOAT,
    stock: DataTypes.INTEGER
  }, {
    instanceMethods: {
      decreaseStock (quantity) {
        if (this.stock < quantity) {
          return Promise.reject(new InventoryError(this.name, this.stock))
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
