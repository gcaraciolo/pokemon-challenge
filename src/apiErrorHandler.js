const ValidationError = require('express-validation').ValidationError

const notFound = (req, res, next) =>
  res.status(404).send('Not Found')

const serverError = (err, req, res, next) => {
  if (err instanceof ValidationError) {
    res.status(err.status).send(err)
  } else {
    console.log(err)
    res.status(500).send('Server error')
  }
}

module.exports = {
  notFound,
  serverError
}
