const PurchaseHandler = require('./purchaseHandler')

function PurchaseService (pokemonRepository) {
  this.pokemonRepository = pokemonRepository
}

PurchaseService.prototype = {
  purchase ({ name, quantity }, card) {
    return this.pokemonRepository.getByName(name)
      .then((pokemon) => {
        const purchaseHandler = new PurchaseHandler(pokemon, card, quantity)

        return purchaseHandler.preparePurchase()
          .then(() => purchaseHandler.makePurchase())
          .then(transaction => {
            return purchaseHandler.finalizePurchase(transaction)
              .then(() => transaction)
          })
      })
  }
}

module.exports = PurchaseService
