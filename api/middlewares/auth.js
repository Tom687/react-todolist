const AppError = require('../utils/appError');
const catchAsync = require('../middlewares/catchAsync');
const db = require('../config/postgres');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');

// Authorization middleware
exports.protect = catchAsync(async (req, res, next) => {
	// Get token && check if exists // TODO : Redis ?
	let token;
	if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
		token = req.headers.authorization.split(' ')[1];
	}
	else if (req.cookies.jwt) {
		token = req.cookies.jwt;
	}
	
	if (!token)
		return next(new AppError('Vous devez vous connecter', 401));
	
	// Verificate token
	const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET); // Returns promise & awaits it right away
	
	// Check if user exists // TODO : Revoir la vidéo / ce qui est fait dans projet Guio ?
	// TODO : Comment éviter de checker la DB à chaque fois ? Redis ?
	const currentUser = await db('users').select('id', 'name', 'email', 'role', 'joined')
		.where({ id: decoded.id });
	
	if (!currentUser || !currentUser[0])
		return next(new AppError('L\'utilisateur lié à ce token n\'existe plus', 401));
	
	// Put user data on the request
	req.user = currentUser[0];
	res.locals.user = currentUser[0]; // Permet de passer les infos de l'user dans les templates
	
	// FIXME : Créer la session ici ?
	req.session.user = currentUser[0];
	
	next();
});


// FIXME : On utilise pas catchAsync ici ?
// Middleware for restricting users on specific route (based on user role)
exports.restrictTo = (...roles) => (req, res, next) => {
	if (!roles.includes(req.session.user.role)) // | req.user.role ?
		return next(new AppError('Vous n\'avez pas la permission d\'effectuer cette action', 403)); // 403 - Forbidden
};


// Middleware for checking if user is logged in (for rendering pages)
exports.isLoggedIn = async (req, res, next) => {
	if (req.cookies.jwt) {
		try {
			// Verificate token that is stored in cookie
			const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);
			
			// Check if user exists
			const currentUser = await db('users').select('id', 'name', 'email', 'role', 'joined')
				.where({ id: decoded.id });
			
			if (!currentUser || !currentUser[0])
				return next();
			
			// Check if user changed password after the JWT was issued // TODO !
			
			// There is a logged in user
			res.locals.user = currentUser[0];
			// FIXME : Session ici ?
			req.session.user = currentUser[0];
			
			return next();
		}
		catch (err) {
			return next();
		}
	}
};

exports.isLoggedIn2 = (req, res, next) => {
	const authHeader = req.headers.authorization;
	
	if (authHeader) {
		const token = authHeader.split(' ')[1];
		
		jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
			if (err) {
				return res.status(403).json({ status: 'error', message: 'JWT invalide ou non existant' });
			}
			req.user = user;
			next();
		});
	}
	else {
		res.status(401).json({
			status: 'error',
			message: 'JWT invalide ou inexistant (2)'
		});
	}
};