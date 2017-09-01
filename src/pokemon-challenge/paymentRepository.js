function PaymentRepository (paymentModel) {
  this.paymentModel = paymentModel
}

PaymentRepository.prototype = {
  create (pokemonId, quantity, transaction) {
    return this.paymentModel.create({
      pokemon_id: pokemonId,
      quantity: quantity
    }, transaction)
  }
}

PaymentRepository.prototype.abort = function (paymentId, transaction) {
  return this.paymentModel.update({
    status: 'failed'
  }, {
    where: {
      id: paymentId
    }
  }, transaction)
}
module.exports = PaymentRepository
