const buyPokemon = require('./buyPokemon')
const models = require('../database/models')
const InventoryError = require('./inventoryError')

const Pokemon = models.pokemon

const createPokemons = () =>
	Pokemon.create({
		name: 'picachu',
		price: 15.53,
		stock: 2
	})

const dropDatabase = () =>
	Pokemon.destroy({
		where: {},
		truncate: true
	})

beforeAll(() => 
	models.sequelize
		.sync()
		.then(() => dropDatabase())
		.then(() => createPokemons())
)

test('pokemon.buy concurrent bought', () => {
	const card = {
		card_number: '4024007138010896',
		card_expiration_date: '1050',
		card_holder_name: 'Ash Ketchum',
		card_cvv: '123'
	}

	return Pokemon
		.findOne({
			where: {
				name: 'picachu'
			}
		})
		.then(pokemon => Promise.all([
			buyPokemon.buy(pokemon, 1, card),
			buyPokemon.buy(pokemon, 1, card),
			buyPokemon.buy(pokemon, 1, card)
		]))
		.then(() => Pokemon.findOne({
			where: {
				name: 'picachu'
			}
		}))
		.then(pokemon => {
			expect(pokemon.stock).toBeGreaterThanOrEqual(0)
		})
})

afterAll(() =>
	Pokemon.destroy({
		where: {},
		truncate: true
	})
)
