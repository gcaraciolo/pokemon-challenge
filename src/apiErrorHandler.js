const apiError = require('./errors').apiError

const invalidParameter = (err, req, res, next) => {
  if (err.message !== 'invalid_parameter') {
    return next(err)
  }

  const response = apiError.parameterError(
    req.paramErrors.useFirstErrorOnly().array()
  )

  res.status(400).json(response)
}

const notFound = (req, res, next) => {
  res.status(404).send('Not Found')
}

const serverError = (err, req, res, next) => {
  console.log(err)
  res.status(500).send('Server error')
}

module.exports = {
  invalidParameter,
  notFound,
  serverError
}
