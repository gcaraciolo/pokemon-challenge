const errors = require('../../errors')
const NotFoundError = errors.NotFoundError

function PokemonRepository (pokemonModel) {
  this.pokemonModel = pokemonModel
}

PokemonRepository.prototype = {
  getById (id) {
    return this.pokemonModel.findById(id)
      .then(pokemon => {
        if (!pokemon) throw new NotFoundError(`${id} not found`)
        return pokemon
      })
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
  }).then(pokemon => {
    if (!pokemon) throw new NotFoundError(`${name} not found`)
    return pokemon
  })
}

module.exports = PokemonRepository
