const ValidationError = require('express-validation').ValidationError;

const apiErrorHandler = (err, req, res, next) => {
	if (err instanceof ValidationError) {
		res.status(err.status).send(err);
	} else {
		console.log(err)
		res.status(500).send('Something broke!');	
	}
}

module.exports = apiErrorHandler;
