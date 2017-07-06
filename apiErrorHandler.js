const paramValidation = require('express-validation');

const apiErrorHandler = (err, req, res, next) => {
	if (err instanceof paramValidation.ValidationError) {
		res.status(err.status).send(err);
	} else {
		console.log(err)
		res.status(500).send('Something broke!');	
	}
}

module.exports = apiErrorHandler;
