[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![license](https://img.shields.io/github/license/mashape/apistatus.svg?style=plastic)]()

# Pokemon challenge web
Api for the pokemon-challenge app.

## API documentation
Link: [API documantation](https://gcaraciolo.github.io/pokemon-challenge)

## Project setup
```
$ git clone https://github.com/gcaraciolo/pokemon-challenge.git
$ cd pokemon-challenge
$ npm install
# create database
$ vim .env
# set environment variable values
# run migration
$ npx sequelize db:migrate
# start server
$ node index
```

## Database
* Project tested with Postgres

## Environment variables
| Key | Description | Example |
| ------------- | ------------- | ------------- |
| DB_USER | Database user | computer01 |
| DB_PASSWORD | Database password |  |
| DB_NAME | Database name | pokemons |
| DB_HOST | Database host |  |
| DB_PORT | Database port |  |
| DB_DIALECT | Database dialect used by sequelize | postgres |
| PAGARME_API_KEY | Pagarme API KEY | ak_test_WHgSu2XFmvoopAZMetV3LfA2RfEEQg |
| SERVER_PORT | Api port | 3000 |

## Test

# Unit
Test components
```
$ npm test
```
or
```
$ npm test:unit
```

# Integration
Test api
```
$ npm run test:integration
```

## Generate API documentation
```
$ npm run docs
```
