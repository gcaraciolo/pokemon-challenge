const Promise = require('bluebird')

const buyPokemon = require('./buyPokemon')
const models = require('../database/models')
const InventoryError = require('../errors').InventoryError

const Pokemon = models.pokemon

const createPokemons = () =>
	Pokemon.create({
		name: 'picachu',
		price: 15.53,
		stock: 2
	})

beforeAll(() => 
	models.sequelize
		.sync()
		.then(() => models.sequelize.query('TRUNCATE TABLE pokemons'))
		.then(() => createPokemons())
)

test('pokemon.buy concurrent bought', () => {
	const card = {
		card_number: '4024007138010896',
		card_expiration_date: '1050',
		card_holder_name: 'Ash Ketchum',
		card_cvv: '123'
	}

	function processBuyPokemon() {
		return Pokemon
			.findOne({
				where: {
					name: 'picachu'
				}
			})
			.then(pokemon => buyPokemon.buy(pokemon, 1, card))
	}

	expect.assertions(2)

	return Promise.all([
			processBuyPokemon(),
			processBuyPokemon(),
			processBuyPokemon()
		])
		.catch(InventoryError, error => {
			expect(error.name).toBe('InventoryError')
		})
		.then(() => Pokemon.findOne({
			where: {
				name: 'picachu'
			}
		}))
		.then(pokemon => {
			expect(pokemon.stock).toBe(0)
		})
		.catch(error => console.log(error))
})

afterAll(() =>
	models.sequelize.query('TRUNCATE TABLE pokemons')
)
