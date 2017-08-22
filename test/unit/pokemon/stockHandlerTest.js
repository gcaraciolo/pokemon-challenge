const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const models = require('../../../src/database/models')
const StockHandler = require('../../../src/pokemon-challenge/pokemon/stockHandler')
const transactionHelper = require('../../../src/utils/transactionHelper')

const Pokemon = models.pokemons

const expect = chai.expect

chai.use(chaiAsPromised)

describe('StockHandler', function () {
  let pokemon
  let stockHandler

  beforeEach(function () {
    return Pokemon.create({ name: 'Pikachu', price: 13.5, stock: 7 })
      .then(aPokemon => {
        pokemon = aPokemon
      })
  })

  afterEach(function () {
    return pokemon.destroy()
  })

  beforeEach(function () {
    stockHandler = new StockHandler(pokemon.id)
  })

  context('when call #add()', function () {
    beforeEach(function () {
      return transactionHelper.openReadCommitted((transaction) => {
        return stockHandler.add(1, transaction)
      })
    })

    it('should add to stock', function () {
      return expect(stockHandler.inStock()).to.eventually.be.equal(8)
    })
  })

  context('when call #remove()', function () {
    beforeEach(function () {
      return transactionHelper.openReadCommitted((transaction) => {
        return stockHandler.remove(3, transaction)
      })
    })

    it('should remove from stock', function () {
      return expect(stockHandler.inStock()).to.eventually.be.equal(4)
    })
  })
})
