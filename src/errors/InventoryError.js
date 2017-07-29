class InventoryError extends Error {
  constructor (message) {
    super(message)
    this.name = 'InventoryError'
    this.message = message
  }
}

module.exports = InventoryError
