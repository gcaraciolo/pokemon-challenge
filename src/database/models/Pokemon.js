const { InventoryError,
  NotFoundError } = require('../../errors')

const checkExists = (data) => {
  return (entity) => {
    if (!entity) throw new NotFoundError(`${data} not found`)
    return entity
  }
}

module.exports = (sequelize, DataTypes) => {
  const Pokemon = sequelize.define('Pokemon', {
    name: DataTypes.STRING,
    price: DataTypes.FLOAT,
    stock: DataTypes.INTEGER
  }, { tableName: 'pokemons' })

  Pokemon.getByIdWithLock = function (pokemonId, transaction) {
    return Pokemon.findOne({
      where: {
        id: pokemonId
      },
      lock: {
        level: transaction.LOCK.UPDATE
      }
    })
  }

  Pokemon.getByName = function (name) {
    return Pokemon.findOne({
      where: {
        name
      }
    }).then(checkExists(name))
  }

  Pokemon.prototype.decreaseStock = function (quantity) {
    if (this.stock < quantity) {
      return Promise.reject(new InventoryError(this.name, this.stock))
    }

    this.stock -= quantity
    return this.save()
  }

  Pokemon.prototype.increaseStock = function (quantity) {
    this.stock += quantity
    return this.save()
  }

  return Pokemon
}
