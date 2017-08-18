const expect = require('chai').expect
const models = require('../../../src/database/models')
const StockHandler = require('../../../src/pokemon/stockHandler')

const Pokemon = models.pokemons

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

  describe('handle race condition', function () {
    it('should remove from stock', function () {
      const stockHandler = new StockHandler(pokemon.id)

      return Promise.all([
        stockHandler.remove(3),
        stockHandler.remove(4)
      ]).then(() => stockHandler.inStock())
        .then((stock) => {
          expect(stock).to.equal(0)
        })
    })

    it('should add to stock', function () {
      const stockHandler = new StockHandler(pokemon.id)

      return Promise.all([
        stockHandler.add(1),
        stockHandler.add(2)
      ]).then(() => stockHandler.inStock())
        .then((stock) => {
          expect(stock).to.equal(10)
        })
    })
  })
})
