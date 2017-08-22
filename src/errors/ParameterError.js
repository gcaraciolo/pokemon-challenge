

class ParameterError extends Error {
  constructor (errors = []) {
    super()
    this.name = 'ParameterError'
    this.errors = errors.map(errorFormat)
  }
}

module.exports = ParameterError
