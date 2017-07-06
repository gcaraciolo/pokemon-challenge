const pagarme = require('pagarme')
const constants = require('./constants')

function getPagarmeClient() {
	return pagarme
		.client
		.connect({
			api_key: constants.PAGARME_API_KEY
		})
}

module.exports = {
	getPagarmeClient
}
