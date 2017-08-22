const PurchaseHandler = require('./purchaseHandler')

// mock card
const card = {
  card_number: '4024007138010896',
  card_expiration_date: '1050',
  card_holder_name: 'Ash Ketchum',
  card_cvv: '123'
}

function PurchaseService (pokemonRepository) {
  this.pokemonRepository = pokemonRepository
}

PurchaseService.prototype = {
  purchase ({ name, quantity }) {
    return this.pokemonRepository.getByName(name)
      .then((pokemon) => {
        const purchaseHandler = new PurchaseHandler(pokemon, card, quantity)

        return purchaseHandler.preparePurchase()
          .then(() => purchaseHandler.makePurchase())
          .then(transaction => {
            return purchaseHandler.finalizePurchase(transaction)
          })
      })
  }
}

module.exports = PurchaseService
