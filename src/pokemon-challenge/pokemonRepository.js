const errors = require('../errors')
const NotFoundError = errors.NotFoundError

const checkExists = (data) => {
  return (entity) => {
    if (!entity) throw new NotFoundError(`${data} not found`)
    return entity
  }
}

function PokemonRepository (pokemonModel) {
  this.pokemonModel = pokemonModel
}

PokemonRepository.prototype = {
  getById (id) {
    return this.pokemonModel.findById(id)
      .then(checkExists(id))
  },
  list () {
    return this.pokemonModel.findAll()
  },
  create ({ name, price, stock }) {
    return this.pokemonModel.create({
      name,
      price,
      stock
    })
  }
}

PokemonRepository.prototype.getByIdWithLockForUpdate = function (pokemonId, transaction) {
  return this.pokemonModel.findOne({
    where: {
      id: pokemonId
    },
    lock: {
      level: transaction.LOCK.UPDATE
    }
  })
}

PokemonRepository.prototype.getByName = function (name) {
  return this.pokemonModel.findOne({
    where: {
      name
    }
  }).then(checkExists(name))
}

module.exports = PokemonRepository
