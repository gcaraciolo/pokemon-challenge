class FinancialTransactionError extends Error {
  constructor (transaction, error) {
    super('transaction error')
    this.name = 'FinancialTransactionError'
    this.transaction = transaction
    this.error = error
  }
}

module.exports = FinancialTransactionError
