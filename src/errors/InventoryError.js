class InventoryError extends Error {
  constructor (pokemoName, pokemonStock) {
    const msg = `Not enough ${pokemoName} in stock: ${pokemonStock}`
    super(msg)
    this.name = 'InventoryError'
    this.message = msg
  }
}

module.exports = InventoryError
