import AppError from '../utils/appError.js';

const handleDuplicatePSQL = err => {
	//const message = `Duplicate field value : ${value}. Please use another value !`;
	const message = `Duplicate field value on table : ${err.table}. \n Duplicate key value violates unique constraint ${err.constraint} : ${err.detail}`;

	return new AppError(message, 400);
};

const handleCastErrorPostgresDB = (err, ee) => {
	const message = `Invalid value on a ${err.routine} field : ${ee.message}`;
	
	return new AppError(message, 400);
};

// JWT Errors (TODO : Voir l'implémentation ? Retour au client ?)
const handleJWTError = () =>
	new AppError('Invalid token. Please signin again.', 401);

const handleJWTExpiredError = () =>
	new AppError('Your token has expired. Please signin again.', 401);


const sendErrorDev = (err, res) => {
	res.status(err.statusCode).json({
		status: err.status,
		error: err,
		message: err.message,
		stack: err.stack
	});
};

const sendErrorProd = (err, res) => {
	// Operational, trusted error : send message to client
	if (err.isOperational) {
		res.status(err.statusCode).json({
			status: err.status,
			message: err.message
		});
	}
	
	// Programming or other unknow error : don't leak error details to client
	else {
		// Log error
		console.log('Error from sendErrorProd - errorHandler.js :', err);
		
		// Send generic message
		res.status(500).json({
			status: 'error',
			message: 'Something went wrong'
		});
	}
};

const globalErrorHandler = (err, req, res, next) => {
	err.statusCode = err.statusCode || 500;
	err.status = err.status || 'error';
	
	if (process.env.NODE_ENV === 'development') {
		//let error = { ...err };
		//if (error.code === '23505') error = handleDuplicatePSQL(error);
		//if (error.code === '22001') error = handleCastErrorPostgresDB(error,err);
		
		sendErrorDev(err, res);
	}
	else if (process.env.NODE_ENV === 'production') {
		// TODO : Définir les différents types d'erreur de la DB (cast, validation ?) et créer des handlers pour chacun
		let error = { ...err };
		
		// JWT errors
		if (error.name === 'JsonWebTokenError') error = handleJWTError();
		if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();
		
		// Postgres errors
		if (error.code === '23505') error = handleDuplicatePSQL(error);
		if (error.code === '22001') error = handleCastErrorPostgresDB(error);
		
		sendErrorProd(error, res);
	}
};

export default globalErrorHandler;