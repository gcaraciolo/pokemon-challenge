const parameterError = (errors = []) => ({
  errors: errors.map(error => ({
    message: error.msg,
    parameter_name: error.param,
    type: 'invalid_parameter'
  }))
})

const controllerError = (messages = []) => ({
  errors: messages.map(message => ({
    message
  }))
})

module.exports = {
  parameterError,
  controllerError
}
