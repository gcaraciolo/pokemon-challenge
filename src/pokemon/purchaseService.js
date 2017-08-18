class PurchaseService {
  constructor (client, card) {
    this.client = client
    this.card = card
  }

  purchase (pokemon, quantity) {
    return Promise.resolve({
      status: 'paid',
      price: pokemon.price * quantity
    })
  }
}

module.exports = PurchaseService
