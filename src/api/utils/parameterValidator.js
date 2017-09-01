const parameterErrorFactory = (error) => {
  return {
    message: error.msg,
    parameter_name: error.param,
    type: 'invalid_parameter'
  }
}

const parameterValidator = (validate) => {
  return (req, res, next) => {
    validate(req)
    req.getValidationResult().then(result => {
      if (result.isEmpty()) {
        return next()
      }

      req.errors = result.useFirstErrorOnly().array().map(parameterErrorFactory)
      next(new Error('invalid_parameter'))
    }).catch(next)
  }
}

module.exports = parameterValidator
