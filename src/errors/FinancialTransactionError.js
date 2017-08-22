class FinancialTransactionError extends Error {
  constructor (transaction) {
    super()
    this.name = 'FinancialTransactionError'
    this.transaction = transaction
  }
}

module.exports = FinancialTransactionError
