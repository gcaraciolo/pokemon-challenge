const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const models = require('../../../src/database/models')
const StockHandler = require('../../../src/pokemon/stockHandler')

const Pokemon = models.pokemons

const expect = chai.expect

chai.use(chaiAsPromised)

describe('StockHandler', function () {
  let pokemon

  beforeEach(function () {
    return Pokemon.create({ name: 'Pikachu', price: 13.5, stock: 7 })
      .then(aPokemon => {
        pokemon = aPokemon
      })
  })

  afterEach(function () {
    return pokemon.destroy()
  })

  context('called in a race condition', function () {
    let stockHandler

    beforeEach(function () {
      stockHandler = new StockHandler(pokemon.id)
    })

    context('to increase stock', function () {
      beforeEach(function () {
        return Promise.all([
          stockHandler.add(1),
          stockHandler.add(2)
        ])
      })

      it('should add to stock', function () {
        return expect(stockHandler.inStock()).to.eventually.be.equal(10)
      })
    })

    context('to decrease stock', function () {
      beforeEach(function () {
        return Promise.all([
          stockHandler.remove(3),
          stockHandler.remove(4)
        ])
      })

      it('should remove from stock', function () {
        return expect(stockHandler.inStock()).to.eventually.be.equal(0)
      })
    })
  })
})
