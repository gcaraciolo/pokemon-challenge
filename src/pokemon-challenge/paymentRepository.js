function PaymentRepository (paymentModel) {
  this.paymentModel = paymentModel
}

PaymentRepository.prototype = {
  create ({ pokemonId, quantity }) {
    return this.paymentModel.create({
      quantity,
      pokemon_id: pokemonId
    })
  }
}
module.exports = PaymentRepository
