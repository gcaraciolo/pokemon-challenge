const { FinancialTransactionError } = require('../errors')
const Operator = require('./operator')
const Invoice = require('./invoice')
const PaymentService = require('./paymentService')
const pagarmeHelper = require('../utils/pagarmeHelper')

function Checkout (pokemonRepository, paymentRepository) {
  this.pokemonRepository = pokemonRepository
  this.paymentRepository = paymentRepository
}

Checkout.prototype = {
  // TODO: refactoring
  execute ({ name, quantity }, card) {
    return this.pokemonRepository.getByName(name).then((pokemon) => {
      const operator = new Operator(pokemon, quantity, this.pokemonRepository, this.paymentRepository)
      const invoice = new Invoice(pokemon, quantity)

      return operator.prepare().then((payment) => {
        return pagarmeHelper.createClient().then(client => {
          const paymentService = new PaymentService(client)

          return paymentService.doTransaction(card, invoice).then(transaction => {
            if (transaction.status !== 'paid') {
              return operator.abort(payment).then(() =>
                Promise.reject(new FinancialTransactionError(transaction))
              )
            }

            return payment.confirm().then(() => transaction)
          })
        })
      })
    })
  }
}

module.exports = Checkout
