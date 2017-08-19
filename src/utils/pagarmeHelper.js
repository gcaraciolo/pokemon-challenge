const pagarme = require('pagarme')
const constants = require('../../constants')

class PagarmeHelper {
  createClient () {
    return pagarme
      .client
      .connect({
        api_key: constants.PAGARME_API_KEY
      })
  }
}

module.exports = PagarmeHelper
