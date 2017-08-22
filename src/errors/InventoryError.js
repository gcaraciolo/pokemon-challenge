class InventoryError extends Error {
  constructor (pokemoName, pokemonStock) {
    super()
    const msg = `Not enough ${pokemoName} in stock: ${pokemonStock}`
    this.name = 'InventoryError'
    this.message = msg
  }
}

module.exports = InventoryError
