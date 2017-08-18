const expect = require('chai').expect
const models = require('../../../src/database/models')

const Payment = models.payments
const Pokemon = models.pokemons

describe('PaymentModel', function () {
  let payment
  let pokemon

  beforeEach(function () {
    return Pokemon.create({ name: 'Pikachu', price: 13.5, stock: 5 })
      .then(aPokemon => {
        pokemon = aPokemon
        return Payment.create({ pokemon_id: pokemon.id, quantity: 2 })
          .then(aPayment => {
            payment = aPayment
          })
      })
  })

  afterEach(function () {
    return Promise.all([
      pokemon.destroy(),
      payment.destroy()
    ])
  })

  describe('#create()', function () {
    it('should have status equals processing', function () {
      expect(payment.status).to.equal('processing')
    })
  })

  describe('#confirm()', function () {
    it('should confirm a payment', function () {
      payment.confirm().then(() => {
        expect(payment.status).to.equal('paid')
      })
    })
  })

  describe('#abort()', function () {
    it('should fail a payment', function () {
      payment.abort().then(() => {
        expect(payment.status).to.equal('failed')
      })
    })
  })
})
