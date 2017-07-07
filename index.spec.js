const request = require('supertest');
const app = require('./index');

const iso8601Regex = /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/
const idRegex = /\d+/

beforeAll(() => {
	return new Promise(resolve => {
		setTimeout(() => {
			resolve()
		}, 1000)
	})
})

//TODO: [bug] test is not closing the program.
afterAll(() => {
	app.close();
})

test('pokemons.list', () => {
	return request(app).get('/get-pokemons').then((response) => {
		expect(response.body.length).toBe(0)
	});
})

test('pokemons.create', () => {
	const picachu = {
		name: 'picachu',
		price: 15.56,
		stock: 3
	}

	return request(app)
		.put('/create-pokemons')
		.type('Application/json')
		.send(picachu)
		.expect(200)
		.then(response => {
			expect(response.body).toMatchObject(picachu)
		})
})

test('pokemons.create with invalid params', () => {
	const picachu = {
		price: 'adsas',
		stock: '!#@!$'
	}

	return request(app)
		.put('/create-pokemons')
		.type('Application/json')
		.send(picachu)
		.expect(400)
		.then(response => {
			expect(response.body).toHaveProperty('errors')
			expect(response.body).toEqual(expect.objectContaining({
				status: 400,
				statusText: 'Bad Request',
				errors: [{
					field: 'name',
					location: 'body',
					messages: [
						'\"name\" is required'
					],
					types: [
						'any.required'
					]
				}, {
					field: 'price',
					location: 'body',
					messages: [
						'\"price\" must be a number'
					],
					types: [
						'number.base'
					]
				}, {
					field: 'stock',
					location: 'body',
					messages: [
						'\"stock\" must be a number'
					],
					types: [
						'number.base'
					]
				}]
			}))
		})
})

test('pokemons.list after create ', () => {
	const pokemons = [{
		id: expect.stringMatching(idRegex),
		name: 'picachu',
		price: 15.56,
		stock: 3,
		createdAt: expect.stringMatching(iso8601Regex),
		updatedAt: expect.stringMatching(iso8601Regex)
	}]

	return request(app)
		.get('/get-pokemons')
		.expect(200)
		.then((response) => {
			expect(response.body.length).toBe(1)
			expect(response.body).toEqual(expect.arrayContaining(pokemons))
		});
})

test('pokemons.buy', () => {
	const pokemonToBuy = {
		name: 'picachu',
		quantity: 2
	}

	return request(app)
		.post('/buy-pokemons')
		.type('Application/json')
		.send(pokemonToBuy)
		.expect(200)
		.then((response) => {
			expect(response.body).toHaveProperty('status', 'paid')
			expect(response.body).toHaveProperty('amount', 3112)
		})
})

test('pokemons.buy not found', () => {
	const pokemonToBuy = {
		name: 'bulbasaur',
		quantity: 3
	}

	return request(app)
		.post('/buy-pokemons')
		.type('Application/json')
		.send(pokemonToBuy)
		.expect(404)
		.then((response) => {
			expect(response.body).toHaveProperty('error')
			expect(response.body.error).toEqual(expect.stringContaining('not found'))
		})
})

test('pokemons.buy with invalid params', () => {
	const pokemonToBuy = {
		quantity: 2.15
	}

	return request(app)
		.post('/buy-pokemons')
		.type('Application/json')
		.send(pokemonToBuy)
		.expect(400)
		.then((response) => {
			expect(response.body).toHaveProperty('errors')
			expect(response.body).toEqual(expect.objectContaining({
				status: 400,
				statusText: 'Bad Request',
				errors: [{
					field: 'name',
					location: 'body',
					messages: [
						'\"name\" is required'
					],
					types: [
						'any.required'
					]
				}, {
					field: 'quantity',
					location: 'body',
					messages: [
						'\"quantity\" must be an integer'
					],
					types: [
						'number.integer'
					]
				}]
			}))
		})
})

test('pokemons.list after bought ', () => {
	const pokemons = [{
		id: expect.stringMatching(idRegex),
		name: 'picachu',
		price: 15.56,
		stock: 1,
		createdAt: expect.stringMatching(iso8601Regex),
		updatedAt: expect.stringMatching(iso8601Regex)
	}]

	return request(app)
		.get('/get-pokemons')
		.expect(200)
		.then((response) => {
			expect(response.body.length).toBe(1)
			expect(response.body).toEqual(expect.arrayContaining(pokemons))
		})
})

test('pokemons.buy not enough ', () => {
	const pokemonToBuy = {
		name: 'picachu',
		quantity: 5
	}

	return request(app)
		.post('/buy-pokemons')
		.type('Application/json')
		.send(pokemonToBuy)
		.expect(400)
		.then((response) => {
			expect(response.body).toHaveProperty('error')
			expect(response.body.error).toEqual(expect.stringContaining('Not enought picachu in stock: '))
		})
})
