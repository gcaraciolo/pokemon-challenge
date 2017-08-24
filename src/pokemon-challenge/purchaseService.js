const Purchase = require('./purchase')

function PurchaseService (pokemonRepository) {
  this.pokemonRepository = pokemonRepository
}

PurchaseService.prototype = {
  purchase ({ name, quantity }, card) {
    return this.pokemonRepository.getByName(name)
      .then((pokemon) => {
        const purchase = new Purchase(pokemon, quantity)

        return purchase.prepare()
          .then((payment) => {
            return purchase.make(card)
              .then(transaction => {
                return purchase.finalize(payment, transaction)
                  .then(() => transaction)
              })
          })
      })
  }
}

module.exports = PurchaseService
