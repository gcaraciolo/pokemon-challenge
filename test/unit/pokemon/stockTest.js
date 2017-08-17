const expect = require('chai').expect
const models = require('../../../src/database/models')

const Pokemon = models.pokemons

describe('Stock', function () {
  let pokemon

  beforeEach(function () {
    return Pokemon.create({ name: 'Pikachu', price: 13.5, stock: 5 })
      .then(aPokemon => {
        pokemon = aPokemon
      })
  })

  afterEach(function () {
    return pokemon.destroy()
  })

  describe('#decreaseStock()', function () {
    it('should decrease stock', function () {
      return pokemon.decreaseStock(3).then(() => {
        expect(pokemon.stock).to.equal(2)
      })
    })
  })

  describe('#increaseStock()', function () {
    it('should increase stock', function () {
      return pokemon.increaseStock(3).then(() => {
        expect(pokemon.stock).to.equal(8)
      })
    })
  })
})
