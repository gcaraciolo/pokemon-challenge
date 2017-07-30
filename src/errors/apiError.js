const parameterError = (errors = []) => ({
  errors: errors.map(error => ({
    message: error.msg,
    parameter_name: error.param,
    type: 'invalid_parameter'
  }))
})

const controllerError = (errors = []) => ({
  errors
})

module.exports = {
  parameterError,
  controllerError
}
