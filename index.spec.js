const request = require('supertest');
const app = require('./index');

const iso8601Regex = /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/

//TODO: [bug] test is not closing the program.
afterAll(() => {
	app.close();
})

test('pokemons.list', () => {
	return new Promise(resolve => {
		setTimeout(() => {
			request(app).get('/get-pokemons').then((response) => {
				expect(response.body.length).toBe(0)
				resolve()
			});
		}, 1000)
	})
})

test('pokemons.create', () => {
	return new Promise(resolve => {
		setTimeout(() => {
			const picachu = {
				name: 'picachu',
				price: 15.56,
				stock: 3
			}

			request(app)
			.put('/create-pokemons')
			.type('Application/json')
			.send(picachu)
			.then(response => {
				expect(response.body).toMatchObject(picachu)
				resolve()
			})
		}, 1000)
	})
})

test('pokemons.list after create ', () => {
	return new Promise(resolve => {
		setTimeout(() => {
			const pokemons = [{
				id: 1,
				name: 'picachu',
				price: 15.56,
				stock: 3,
				createdAt: expect.stringMatching(iso8601Regex),
				updatedAt: expect.stringMatching(iso8601Regex)
			}]

			request(app)
			.get('/get-pokemons')
			.then((response) => {
				expect(response.body.length).toBe(1)
				expect(response.body).toEqual(expect.arrayContaining(pokemons))
				resolve()
			});
		}, 1000)
	})	
})

test('pokemons.buy', () => {
	return new Promise(resolve => {
		setTimeout(() => {
			const pokemonToBuy = {
				name: 'picachu',
				quantity: 2
			}

			request(app)
			.post('/buy-pokemons')
			.type('Application/json')
			.send(pokemonToBuy)
			.then((response) => {
				expect(response.body).toHaveProperty('status', 'paid')
				resolve()
			})
		}, 1000)
	})
})

test('pokemons.list after bought ', () => {
	return new Promise(resolve => {
		setTimeout(() => {
			const pokemons = [{
				id: 1,
				name: 'picachu',
				price: 15.56,
				stock: 1,
				createdAt: expect.stringMatching(iso8601Regex),
				updatedAt: expect.stringMatching(iso8601Regex)
			}]

			request(app)
			.get('/get-pokemons')
			.then((response) => {
				expect(response.body.length).toBe(1)
				expect(response.body).toEqual(expect.arrayContaining(pokemons))
				resolve()
			});
		}, 1000)
	})	
})

