class FinancialTransactionError extends Error {
  constructor (transaction) {
    super('transaction error')
    this.name = 'FinancialTransactionError'
    this.transaction = transaction
  }
}

module.exports = FinancialTransactionError
