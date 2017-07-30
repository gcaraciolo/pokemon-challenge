const apiError = (errors = []) => ({
  errors: errors.map(error => ({
    message: error.msg,
    parameter_name: error.param,
    type: 'invalid_parameter'
  }))
})

module.exports = apiError
