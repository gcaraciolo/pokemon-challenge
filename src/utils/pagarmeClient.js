const pagarme = require('pagarme')
const constants = require('../../constants')

const getPagarmeClient = () =>
  pagarme
    .client
    .connect({
      api_key: constants.PAGARME_API_KEY
    })

const parseValue = value =>
  value * 100

module.exports = {
  getPagarmeClient,
  parseValue
}
