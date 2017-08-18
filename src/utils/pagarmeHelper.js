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
      }).then(client => {
        this.client = client
      })
  }
}

module.exports = PagarmeHelper
