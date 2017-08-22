const errorFormat = (message) => {
  return { message: message }
}

class ApiError extends Error {
  constructor (messages = []) {
    super()
    // TODO: this.name when serialized should not appear
    this.errors = messages.map(errorFormat)
  }
}

module.exports = ApiError
