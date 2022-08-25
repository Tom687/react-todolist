const dotenv = require('dotenv');

// Safety net 2 : If uncaught exceptions
process.on('uncaughtException', err => {
	console.log('Unchaught Exception. Shutting down…');
	console.log(err.name, err.message);
	// Shut down server
	process.exit(1);
});

// Setting env variables
dotenv.config({ path: './config.env' });

const app = require('./app');

// Listening server
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
	console.log(`App running on port ${port}…`);
});


// TODO : Pourquoi "Safety net 2" est au dessus et le "Safety net 1" ici (en bas) ?
// Safety net 1 : If server error appears | Unhandled Rejection Promise
process.on('unhandledRejection', err => {
	console.log('Unhandled Rejection. Shutting down…');
	console.log(err.name, err.message);
	// Shut down server // TODO : Pouruoi server.close ici et pas sur l'autre ?
	server.close(() => {
		process.exit(1);
	});
});