import app from '../app.js';
import config from 'config';

// Safety net 2 : If there are uncaught exceptions
process.on('uncaughtException', err => {
	console.log('Uncaught Exception. Shutting down…');
	console.log(err.name, err.message);
	// Shutting server down
	process.exit(1); // 0 = success | 1 = Uncaught Exception
});


// Listening server
/*const port = config.get('port') || 3001;
 app.listen(port, () => {
 console.log(`App running on port ${port}…`);
 });*/

const port = config.get('port');

app.listen(port, () => {
	console.log(`App started at http://localhost:${port}`);
	
	// connectDB();
});

// Safety net 1 | If server error appear | Unhandled Rejection Promise
/*
 process.on('unhandledRejection', err => {
 console.log('Unhandled Rejection. Shutting down…');
 console.log(err.name, err.message);
 // Shutting down server // TODO : Pourquoi server.close ici et pas sur l'autre ?
 server.close(() => {
 process.exit(1);
 });
 });*/