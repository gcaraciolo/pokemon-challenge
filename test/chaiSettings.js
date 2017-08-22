const chai = require('chai')
const chaiHttp = require('chai-http')
const chaiSubset = require('chai-subset')
const chaiAsPromised = require('chai-as-promised')

chai.use(chaiHttp)
chai.use(chaiSubset)
chai.use(chaiAsPromised)

module.exports = {
  chai,
  expect: chai.expect
}
