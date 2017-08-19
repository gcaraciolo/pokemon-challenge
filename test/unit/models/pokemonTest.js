const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const models = require('../../../src/database/models')
const InventoryError = require('../../../src/errors').InventoryError

const expect = chai.expect
const Pokemon = models.pokemons

chai.use(chaiAsPromised)

describe('PokemonModel', function () {
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
        return expect(pokemon.stock).to.equal(2)
      })
    })

    it('should throw InventoryError when quantity is greater than stock', function () {
      expect(pokemon.decreaseStock(8)).to.eventually.be.rejectedWith(InventoryError)
    })
  })

  describe('#increaseStock()', function () {
    it('should increase stock', function () {
      return pokemon.increaseStock(3).then(() => {
        return expect(pokemon.stock).to.equal(8)
      })
    })
  })
})
