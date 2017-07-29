// TODO: file name very bad.
const pagarmeClient = require('../pagarmeClient')
const pokemonStockHandler = require('./pokemonStockHandler')

const models = require('../database/models')

const Payment = models.payment

const doTransaction = (client, pokemon, quantity, cardHash) =>
  client.transactions
    .create({
      amount: pagarmeClient.parseValue(pokemon.price * quantity),
      card_hash: cardHash,
      metadata: {
        product: 'pokemon',
        name: pokemon.name,
        quantity
      }
    })

const handlePaymentError = (error, payment, status = 'fail') =>
  pokemonStockHandler
    .revertPokemonStock(payment, status)
    .then(() => {
      throw error
    })

const initializePurchase = (client, pokemon, quantity, card) =>
  client.security
    .encrypt(card)
    .then(cardHash => doTransaction(client, pokemon, quantity, cardHash))

const finalizePurchase = (payment, transaction) => {
  if (transaction.status !== 'paid') {
    throw new Error(`payment error: ${transaction.status}`)
  }

  return Payment
    .confirmPayment(payment, transaction.status)
    .then(() => transaction)
}

const processPurchase = (pokemon, quantity, card, payment) =>
  pagarmeClient
    .getPagarmeClient()
    .then(client => initializePurchase(client, pokemon, quantity, card))
    .then(transaction => finalizePurchase(payment, transaction))
    .catch(error => handlePaymentError(error, payment))

const buy = (pokemon, quantity, card) =>
  pokemonStockHandler
    .removeFromPokemonStock(pokemon.id, quantity)
    .then(payment => processPurchase(pokemon, quantity, card, payment))

module.exports = {
  buy
}
