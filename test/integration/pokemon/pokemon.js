const expect = require('../../chaiSettings').expect
const chai = require('../../chaiSettings').chai

const models = require('../../../src/database/models')
const Pokemon = models.pokemons
const Payment = models.payments

// TODO: refactoring

context('/pokemons', function () {
  describe('POST /', function () {
    context('with valid input', function () {
      const pikachu = {
        name: 'pikachu',
        price: 13.34,
        stock: 12
      }

      beforeEach(function () {
        this.result = chai.request(app)
          .post('/pokemons')
          .send(pikachu)
      })

      afterEach(function () {
        return Pokemon.sync({ force: true })
      })

      it('should return a pokemon', function () {
        return this.result.then((res) => {
          const response = JSON.parse(res.text)

          expect(response).to.contain.keys(pikachu)
          expect(response).to.have.property('createdAt')
          expect(response).to.have.property('updatedAt')
        })
      })

      it('should return status 201', function () {
        return this.result.then((res) => {
          expect(res).to.have.status(201)
        })
      })
    })

    context('with invalid input', function () {
      it('should return status 400', function () {
        const pikachu = {
          price: 13.23,
          stock: 1
        }

        return chai.request(app)
          .post('/pokemons')
          .send(pikachu)
          .catch(err => {
            expect(err).to.have.status(400)
          })
      })

      context('should return a list of errors', function () {
        it('when missing name', function () {
          const pikachu = {
            price: 13.23,
            stock: 1
          }

          return chai.request(app)
            .post('/pokemons')
            .send(pikachu)
            .catch(err => {
              const response = JSON.parse(err.response.error.text)

              expect(response.errors).to.be.an('array')
              expect(response.errors[0]).to.eql({
                message: 'name is required and can only contain letters with 1 to 255 characters',
                parameter_name: 'name',
                type: 'invalid_parameter'
              })
            })
        })

        it('when missing price', function () {
          const pikachu = {
            name: 'pikachu',
            stock: 1
          }

          return chai.request(app)
            .post('/pokemons')
            .send(pikachu)
            .catch(err => {
              const response = JSON.parse(err.response.error.text)

              expect(response.errors).to.be.an('array')
              expect(response.errors[0]).to.eql({
                message: 'price must be a decimal number',
                parameter_name: 'price',
                type: 'invalid_parameter'
              })
            })
        })

        it('when missing stock', function () {
          const pikachu = {
            name: 'pikachu',
            price: 13.23
          }

          return chai.request(app)
            .post('/pokemons')
            .send(pikachu)
            .catch(err => {
              const response = JSON.parse(err.response.error.text)

              expect(response.errors).to.be.an('array')
              expect(response.errors[0]).to.eql({
                message: 'stock must be a integer',
                parameter_name: 'stock',
                type: 'invalid_parameter'
              })
            })
        })
      })
    })
  })

  describe('GET /', function () {
    context('with no-one pokemon registered', function () {
      it('should return an empty list', function () {
        return chai.request(app)
          .get('/pokemons')
          .then((res) => {
            const response = JSON.parse(res.text)

            expect(response).to.be.an('array').that.is.empty
          })
      })
    })

    context('with one pokemon registered', function () {
      beforeEach(function () {
        return Pokemon.create({ name: 'pikachu', price: 13.4, stock: 1 })
      })

      afterEach(function () {
        return Pokemon.sync({ force: true })
      })

      it('should return a list with one item', function () {
        const pikachu = { name: 'pikachu', price: 13.4, stock: 1 }

        return chai.request(app)
          .get('/pokemons')
          .then((res) => {
            const response = JSON.parse(res.text)

            expect(response).to.be.an('array').that.is.not.empty
            expect(response[0]).to.contain.keys(pikachu)
            expect(response[0]).to.have.property('createdAt')
            expect(response[0]).to.have.property('updatedAt')
          })
      })
    })

    context('with multiple pokemon registered', function () {
      beforeEach(function () {
        return Promise.all([
          Pokemon.create({ name: 'pikachu', price: 13.4, stock: 1 }),
          Pokemon.create({ name: 'bulbasour', price: 15.3, stock: 2 })
        ])
      })

      afterEach(function () {
        return Pokemon.sync({ force: true })
      })

      it('should return a list with multiple items', function () {
        const pikachu = { name: 'pikachu', price: 13.4, stock: 1 }
        const bulbasaur = { name: 'bulbasour', price: 15.3, stock: 2 }

        return chai.request(app)
          .get('/pokemons')
          .then((res) => {
            const response = JSON.parse(res.text)

            expect(response).to.be.an('array').that.is.not.empty
            expect(response).to.containSubset([pikachu, bulbasaur])
          })
      })
    })
  })

  describe('POST /buy', function () {
    context('with invalid input', function () {
      it('should return status 400', function () {
        const form = {
          quantity: 1
        }

        return chai.request(app)
          .post('/pokemons/buy')
          .send(form)
          .catch(err => {
            expect(err).to.have.status(400)
          })
      })

      context('should return a list of errors', function () {
        it('when missing name', function () {
          const form = {
            quantity: 1
          }

          return chai.request(app)
            .post('/pokemons/buy')
            .send(form)
            .catch(err => {
              const response = JSON.parse(err.response.error.text)

              expect(response.errors).to.be.an('array')
              expect(response.errors[0]).to.eql({
                message: 'name is required and can only contain letters with 1 to 255 characters',
                parameter_name: 'name',
                type: 'invalid_parameter'
              })
            })
        })

        it('when missing quantity', function () {
          const form = {
            name: 'pikachu'
          }

          return chai.request(app)
            .post('/pokemons/buy')
            .send(form)
            .catch(err => {
              const response = JSON.parse(err.response.error.text)

              expect(response.errors).to.be.an('array')
              expect(response.errors[0]).to.eql({
                message: 'quantity is required and must be an integer',
                parameter_name: 'quantity',
                type: 'invalid_parameter'
              })
            })
        })
      })
    })

    context('with valid input', function () {
      beforeEach(function () {
        return Pokemon.create({ name: 'pikachu', price: 13.4, stock: 1 })
      })

      afterEach(function () {
        return Pokemon.sync({ force: true })
          .then(() => Payment.sync({ force: true }))
      })

      context('with pokemon missing stock', function () {
        it('should return not enough error', function () {
          const form = {
            name: 'pikachu',
            quantity: 2
          }

          return chai.request(app)
            .post('/pokemons/buy')
            .send(form)
            .catch(err => {
              const response = JSON.parse(err.response.error.text)

              expect(response.errors).to.be.an('array')
              expect(response.errors[0]).to.eql({
                message: 'Not enough pikachu in stock: 1'
              })
            })
        })
      })

      context('with pokemon in stock', function () {
        this.timeout(0)

        it('should return pagarme transaction info and have status 200', function () {
          const form = {
            name: 'pikachu',
            quantity: 1
          }

          return chai.request(app)
            .post('/pokemons/buy')
            .send(form)
            .then(res => {
              expect(res).to.have.status(200)
              expect(res.body).to.contains.keys({
                status: 'paid',
                object: 'transaction'
              })
            })
        })
      })
    })
  })
})
