const pagarme = require('pagarme')
const constants = require('../../constants')

class PagarmeHelper {
  constructor () {
    this.client = undefined
  }

  createClient () {
    return pagarme
      .client
      .connect({
        api_key: constants.PAGARME_API_KEY
      })
  }

  parseValue (value) {
    return value * 100
  }
}

module.exports = PagarmeHelper
