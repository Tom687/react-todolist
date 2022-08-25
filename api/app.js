const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const cors = require('cors');

// TODO : Voir si conflit avec l'autre redisClient ?  || TODO : Voir si on peut séparer la logique de session ?
const redis = require('redis');
const session = require('express-session');
let RedisStore = require('connect-redis')(session);
let redisClient = redis.createClient(process.env.REDIS_URI);

const globalErrorHandler = require('./middlewares/errorHandler');

const app = express();

// TODO : Essaie redis session | Voir si on peut séparer la logique de session dans un middleware ou autre ?
app.use(session({
	store: new RedisStore({ client: redisClient }),
	secret: process.env.EXPRESS_SESSION_SECRET,
	resave: false,
	saveUninitialized: true
}));


// TODO : PUG ou EJS ?
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'views', 'build'))); // TODO: Modifier en build et pas build2
// Middlewares
// Serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.use(helmet());

if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'));
}

const limiter = rateLimit({
	max: 100,
	windowMs: 60 * 60 * 1000, // 1 hour (in ms)
	message: 'Too many requests from this IP. Try again in 1 hour'
});

app.use('/api', limiter); // TODO : Ajuster la route
// JSON / Body parser
app.use(express.json({ limit: '10kb' })); // Body size limit // TODO : Voir + haut ? Pour les images par ex ?
// Parsing URL encoded data
app.use(express.urlencoded({ extended: true, limit: '10kb' })); // TODO : Ajuster la limit ?
// Cookie parser
app.use(cookieParser()); // TODO : Utilité ?
// Date sanitization against XSS
app.use(xss());
// Prevent parameter pollution (HPP)
/*app.use(hpp({ // TODO : Voir params ? // TODO : Ajuster les paramètres selon ceux qu'on accepte en URL
 whitelist: ['duration', 'ratingsQuantity', 'ratingsAverage', 'maxGroupSize', 'difficulty', 'price']
 }));*/

app.use(
	cors({
		credentials: true,
		origin: "http://localhost:3001",
	})
);


// TODO : Middleware pour pouvoir utiliser axios depuis CDN (voir Browserify si mieux ? Ou PARCEL ?)
// FIXME : Voir unsafe-inline ? Ajuster * ou l'URL voulue. Comment pour plusieurs URLs ?
app.use(function(req, res, next) {
	//res.setHeader( 'Content-Security-Policy', "script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js" );
	res.setHeader( 'Content-Security-Policy', "script-src 'self' 'unsafe-inline' *" );
	//res.setHeader( 'Content-Security-Policy', "default-src *; style-src 'self' * 'unsafe-inline'; script-src 'self'
	// * 'unsafe-inline' 'unsafe-eval'" );
	//res.setHeader('Content-Security-Policy', 'script-src https://cdnjs.cloudflare.com');
	next();
});


const viewRoutes = require('./routes/views');
const authRoutes = require('./routes/auth');
const todosRoutes = require('./routes/todos');

app.use('/', viewRoutes);
app.use('/', authRoutes);
app.use('/todos', todosRoutes);

app.use(globalErrorHandler);

module.exports = app;