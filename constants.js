const config = require('dotenv').config;

try {
  config({ path: `${__dirname}/.env` })
} catch (error) {
  console.log('.env file/dotenv lib not found. using env vars from current environment')
}

// Database
module.exports.DB_USER = process.env.DB_USER
module.exports.DB_PASSWORD = process.env.DB_PASSWORD
module.exports.DB_NAME = process.env.DB_NAME
module.exports.DB_HOST = process.env.DB_HOST
module.exports.DB_PORT = process.env.DB_PORT
module.exports.DB_DIALECT = process.env.DB_DIALECT

// Pagarme
module.exports.PAGARME_API_KEY = process.env.PAGARME_API_KEY

// Server
module.exports.SERVER_PORT = process.env.SERVER_PORT || 3000
