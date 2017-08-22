const express = require('express')
const parameterValidator = require('../utils/parameterValidator')
const pokemonController = require('./pokemonController')

const pokemonRoutes = express.Router()

/**
 * @apiVersion 1.0.1
 * @api {get} /pokemons List
 * @apiName GetPokemons
 * @apiGroup Pokemons
 *
 * @apiSuccess {Object[]} pokemons
 * @apiSuccess {Int} pokemons.id
 * @apiSuccess {String} pokemons.name
 * @apiSuccess {Float} pokemons.price
 * @apiSuccess {Int} pokemons.stock
 * @apiSuccess {Date} pokemons.createdAt
 * @apiSuccess {Date} pokemons.updatedAt
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *    [
 *      {
 *        "id": 10,
 *        "name": "pikachu",
 *        "price": 13.34,
 *        "stock": 12,
 *        "createdAt": "2017-08-07T17:32:40.981Z",
 *        "updatedAt": "2017-08-07T17:32:40.981Z"
 *      }
 *    ]
 */
pokemonRoutes.get('/', pokemonController.list)

/**
 * @apiVersion 1.0.1
 * @api {post} /pokemons Create
 * @apiName PostPokemons
 * @apiGroup Pokemons
 *
 * @apiParam {String} name
 * @apiParam {Float} price
 * @apiParam {Int} stock
 *
 * @apiSuccess {Int} id
 * @apiSuccess {String} name
 * @apiSuccess {Float} price
 * @apiSuccess {Int} stock
 * @apiSuccess {Date} createdAt
 * @apiSuccess {Date} updatedAt
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 201 OK
 *     {
 *       "id": 10,
 *       "name": "pikachu",
 *       "price": 13.34,
 *       "stock": 12,
 *       "createdAt": "2017-08-07T17:32:40.981Z",
 *       "updatedAt": "2017-08-07T17:32:40.981Z"
 *     }
 */
pokemonRoutes.post('/',
  parameterValidator((req) => {
    req.checkBody('name', 'name is required and can only contain letters with 1 to 255 characters')
      .isAlpha().isLength({ min: 1, max: 255 })
    req.checkBody('price', 'price must be a decimal number').isDecimal()
    req.checkBody('stock', 'stock must be a integer').isInt()
  }),
  pokemonController.create
)

/**
 * @apiVersion 1.0.1
 * @api {post} /pokemons Buy pokemon
 * @apiName PostBuyPokemon
 * @apiGroup Pokemons
 *
 * @apiParam {String} name Pokemon's name wanted
 * @apiParam {Int} quantity Number of pokemons items wanted
 *
 * @apiError (Error 4xx) NotEnoughInStock The <code>quantity</code> is greater than items in stock.
 *
 * @apiErrorExample
 *     HTTP/1.1 400 OK
 *     {
 *       "errors": [
 *        {
 *          "message": "Not enough pikachu in stock: 12"
 *        }
 *       ]
 *     }
 */
pokemonRoutes.post('/buy',
  parameterValidator((req) => {
    req.checkBody('name', 'name is required and can only contain letters with 1 to 255 characters')
      .isAlpha().isLength({ min: 1, max: 255 })
    req.checkBody('quantity', 'quantity is required and must be an integer').isInt()
  }),
  pokemonController.buy
)

module.exports = pokemonRoutes
