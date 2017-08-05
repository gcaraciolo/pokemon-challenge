const parameterValidator = (validate) => {
  return (req, res, next) => {
    validate(req)
    req.getValidationResult().then(result => {
      if (result.isEmpty()) {
        return next()
      }

      req.paramErrors = result
      next(new Error('invalid_parameter'))
    }).catch(next)
  }
}

module.exports = parameterValidator
