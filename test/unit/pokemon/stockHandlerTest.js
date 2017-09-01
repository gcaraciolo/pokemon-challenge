const expect = require('../../chaiSettings').expect
const models = require('../../../src/database/models')
const Stock = require('../../../src/pokemon-challenge/purchase/stock')
const transactionHelper = require('../../../src/utils/transactionHelper')
const PokemonRepository = require('../../../src/pokemon-challenge/pokemonRepository')

const Pokemon = models.pokemons

describe('StockHandler', function () {
  let pokemon
  let stock

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
    stock = new Stock(pokemon.id, new PokemonRepository(models.pokemons))
  })

  context('when call #add()', function () {
    beforeEach(function () {
      return transactionHelper.openReadCommitted((transaction) => {
        return stock.add(1, transaction)
      })
    })

    it('should add to stock', function () {
      return expect(stock.quantity()).to.eventually.be.equal(8)
    })
  })

  context('when call #remove()', function () {
    beforeEach(function () {
      return transactionHelper.openReadCommitted((transaction) => {
        return stock.remove(3, transaction)
      })
    })

    it('should remove from stock', function () {
      return expect(stock.quantity()).to.eventually.be.equal(4)
    })
  })
})
