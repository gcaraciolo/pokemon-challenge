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
          }),
      decreasePokemonStock: (pokemon, quantity) =>
        Pokemon
          .update({
            stock: pokemon.stock - quantity
          }, {
            where: {
              id: pokemon.id
            }
          }),
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
      checkInventory (quantity) {
        if (this.stock < quantity) {
          throw new InventoryError(this.name, this.stock)
        }
      }
    }
  })

  return Pokemon
}
