const express = require('express')
const bodyParser = require('body-parser')
const expressValidator = require('express-validator')
const cors = require('cors')

const app = express()

app.use(bodyParser.json())
app.use(expressValidator())
app.use(cors())

module.exports = app
