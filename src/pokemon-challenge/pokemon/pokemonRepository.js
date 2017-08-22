const errors = require('../../errors')
const NotFoundError = errors.NotFoundError

// TODO: base class?
function PokemonRepository (pokemonModel) {
  this.pokemonModel = pokemonModel
}

PokemonRepository.prototype = {
  list () {
    return this.pokemonModel.findAll()
  },
  create ({name, price, stock}) {
    return this.pokemonModel.create({
      name,
      price,
      stock
    })
  }
}

// TODO: find a better way to extend object
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
