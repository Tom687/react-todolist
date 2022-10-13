class AppError extends Error {
	constructor(message, statusCode) {
		super(message);
		
		this.statusCode = statusCode;
		this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
		this.isOperational = true; // If we should display error on front-end or not
		
		Error.captureStackTrace(this, this.constructor); // Keep the error stacktrace
	}
}

export default AppError;