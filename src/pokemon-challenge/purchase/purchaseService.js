const PurchaseHandler = require('./purchaseHandler')

function PurchaseService (pokemonRepository) {
  this.pokemonRepository = pokemonRepository
}

PurchaseService.prototype = {
  purchase ({ name, quantity }, card) {
    return this.pokemonRepository.getByName(name)
      .then((pokemon) => {
        const purchaseHandler = new PurchaseHandler(pokemon, quantity)

        return purchaseHandler.preparePurchase()
          .then((payment) => {
            return purchaseHandler.makePurchase(card)
              .then(transaction => {
                return purchaseHandler.finalizePurchase(payment, transaction)
                  .then(() => transaction)
              })
          })
      })
  }
}

module.exports = PurchaseService
