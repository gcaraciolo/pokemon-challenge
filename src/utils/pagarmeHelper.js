const pagarme = require('pagarme')
const constants = require('../constants')

const createClient = () =>
  pagarme
    .client
    .connect({
      api_key: constants.PAGARME_API_KEY
    })

const parseAmount = (amount) => Math.round(amount * 100)

module.exports = {
  createClient,
  parseAmount
}
