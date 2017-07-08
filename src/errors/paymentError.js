class PaymentError extends Error {
  constructor (data) {
    super(data)
    this.name = 'PaymentError'
    this.data = data
  }
}

module.exports = PaymentError
