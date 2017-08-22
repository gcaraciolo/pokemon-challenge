class InventoryError extends Error {
  constructor (pokemoName, pokemonStock) {
    super()
    const message = `Not enough ${pokemoName} in stock: ${pokemonStock}`
    this.name = 'InventoryError'
    this.message = message
  }
}

module.exports = InventoryError
