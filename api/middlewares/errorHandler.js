const AppError = require('../utils/appError');

// Postgres errors
const handleDuplicatePSQL = err => {
	//const message = `Duplicate field value : ${value}. Please use another value !`;
	const message = `Duplicate field value on table : ${err.table}. \n Duplicate key value violates unique constraint ${err.constraint} : ${err.detail}`;
	console.log('handleDuplicateFieldsDB - detail : ', err.detail);
	return new AppError(message, 400);
};

// TODO : A revoir ? Code différent selon data type
const handleCastErrorPostgresDB = (err, ee) => { // TODO : Modifier err et ee ?
	const message = `Invalid value on a ${err.routine} field : ${ee.message}`;
	return new AppError(message, 400);
};


// JWT || Token errors
// TODO : Tester les erreurs (doit lancer en PROD)
// JWT Errors (TODO : Voir l'implémentation ? Retour au client ?)
const handleJWTError = () =>
	new AppError('Invalid token. Please signin again.', 401);

const handleJWTExpiredError = () =>
	new AppError('Your token has expired. Please signin again.', 401);



// Error handlers
const sendErrorDev = (err, res) => {
	res.status(err.statusCode).json({
		status: err.status,
		error: err,
		message: err.message,
		stack: err.stack
	});
};

const sendErrorProd = (err, res) => {
	console.log('sendErrorProd');
	// Operational, trusted error : send message to client
	if (err.isOperational) {
		console.log('err.isOperational');
		res.status(err.statusCode).json({
			status: err.status,
			message: err.message,
		});
	}
	// Programming or other unknow error : don't leak error details to client
	else {
		// Log error
		console.log('ERROR : ', err);
		console.log('!err.isOperational')
		
		// Send generic message
		res.status(500).json({
			status: 'error',
			message: 'Something went wrong !',
		});
	}
};

module.exports = (err, req, res, next) => {
	err.statusCode = err.statusCode || 500;
	err.status = err.status || 'error';
	
	if (process.env.NODE_ENV === 'development') {
		sendErrorDev(err, res);
	}
	else if (process.env.NODE_ENV === 'production') {
		let error = { ...err };
		
		// JWT errors
		if (error.name === 'JsonWebTokenError') error = handleJWTError();
		if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();
		
		// TODO : Erreurs PSQL ?
		if (error.code === '23505') error = handleDuplicatePSQL(error);
		// TODO : Code différent selon le data type
		if (error.code === '22001') error = handleCastErrorPostgresDB(error);
		
		sendErrorProd(error, res);
	}
};