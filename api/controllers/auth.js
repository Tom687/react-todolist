const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const Email = require('../utils/email');
const moment = require('moment');

const AppError = require('../utils/appError');
const catchAsync = require('../middlewares/catchAsync');
const db = require('../config/postgres');

// Function for signin tokens
const signToken = (id) => {
	return jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES_IN
	})
};

// Function for sending status & JSON + creating (signing) JWT
const createSendToken = (user, statusCode, res) => {
	// Log the user in, send JWT
	const token = signToken(user.id, user.email, user.role);
	
	// Setting cookie options
	const cookieOptions = {
		expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
		httpOnly: true
	};
	
	// Putting JWT into Cookies
	if (process.env.NODE_ENV === 'production') cookieOptions.secure = true; // Cookie will show only on https (production)
	res.cookie('jwt', token, cookieOptions);
	
	// Remove password from the output
	user.hash = undefined;
	user.password = undefined;
	
	// Sending status & JSON
	res.status(statusCode).json({
		status: 'success',
		token,
		data: {
			user
		}
	});
};


// TODO : Pas de catchAsync ? Pas de Promise.resolve() | Promise.reject() ?
const handleLogin = async (req, res, next) => {
	const { email, password } = req.body;
	
	if (!email || !password)
		return next(new AppError('Formulaire incomplet', 400));
		// return Promise.reject('Formulaire incomplet');
	
	const user = await db('users').select('id', 'name', 'email', 'role', 'hash')
		.where({ email });
	
	if (!user || !user[0])
		// FIXME : Mauvais identifiants ou user non trouvé ? (pas ce problème avec table login)
		return next(new AppError('Mauvais identifiants', 400));
	
	const isPasswordValid = await bcrypt.compareSync(password, user[0].hash); // FIXME : compareSync() ou compare() ?
	
	if (!isPasswordValid)
		return next(new AppError('Mauvais identifiants', 400));
	
	req.session.user = user[0]; // FIXME : Définition de la session user ici ? Ou middleware auth ?
	
	return Promise.resolve(user[0]);
};


exports.loginAuthentication = catchAsync(async (req, res, next) => {
	const user = await handleLogin(req, res, next);
	
	if (!user)
		return next(new AppError('User not found', 404)); // FIXME : Bonne erreur ? Quant-est-qu'elle apparait ?
	
	createSendToken(user, 200, res);
});


// Middleware for forgetting the password and sending reset link to user - FORGOT PASSWORD
exports.forgotPassword = catchAsync(async (req, res, next) => {
	// Get user based on posted email // TODO : Vérif sur req.body d'abord ?
	const { email } = req.body;
	
	const user = await db('users').select('id', 'name', 'email').where({ email });
	
	if (!user)
		return next(new AppError('Aucun utilisateur trouvé avec cette adresse email', 404));
	
	// Generate random reset password token
	const resetToken = crypto.randomBytes(32).toString('hex');
	const hashedResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
	const resetTokenExpiration = moment().add(30, 'm'); // TODO : Expiration du token en UTC ou locale ?
	
	// TODO : Voir si bonne méthode (mettre une const updateRes pour le AppError)
	const updateRes = await db('users') // TODO : Ajuster selon les tables (login si on a une table login)
		.where({ email })
		.update({ reset_psswd_token: hashedResetToken, reset_psswd_token_expiration: resetTokenExpiration });
	
	if (!updateRes) // TODO : | !updatedRes[0] ?
		return next(new AppError('Adresse email non trouvée', 404));
	
	// TODO : Ajuster URL si on utilise React pour le front et Express back, ou Express partout
	//const resetURL = `${req.protocol}://${req.get('host')}/auth/resetPassword/${resetToken}`;
	//const resetURL = `http://localhost:3001/auth/resetPassword/${resetToken}`;
	const resetURL = `${req.get('origin')}/auth/resetPassword/${resetToken}`;
	
	try {
		// TODO : Créer la fonction Email.sendPasswordReset();
		await new Email(user[0], resetURL).sendPasswordReset();
		
		res.status(200).json({
			status: 'success',
			message: 'Token envoyé à l\'adresse email'
		});
	}
	catch (err) {
		await db('users') // TODO : Ajuster si table 'login'
			.where({ email })
			.update({ reset_psswd_token: null, reset_psswd_token_expiration: null });
	}
});



// TODO : Logout l'user sur les autres sessions si il change de MDP (renouveler le JWT ?)
// TODO : Renvoyer les erreurs au front (token expiré,…)
exports.resetPassword = catchAsync(async (req, res, next) => {
	const { password, confirmPassword } = req.body;
	
	// TODO : Checker req.body pour psswd et confirm ? Checker aussi req.params.token ?
	
	// Get user from token
	const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
	const user = await db('users').select('id', 'name', 'email') // TODO : Ajuster si table 'login'
		.where({ reset_psswd_token: hashedToken });
	
	if (!user[0])
		return next(new AppError('Utilisateur non trouvé ou token non créé', 404));
	
	// TODO : Voir si moment() change selon serveur ? Si oui, forcer la date en UTC
	if (user[0].reset_psswd_token_expiration <= moment())
		return next(new AppError('Le token pour modifier le MDP a expiré', 400));
	
	if (password !== confirmPassword)
		return next(new AppError('Les mots de passe ne correspondent pas', 400));
	
	const hash = bcrypt.hashSync(password, 6); // FIXME : hashSync ou hash ? Pas de await ?
	
	// FIXME : Pourquoi try / catch ici ? Pas sur le tuto natours API ?
	//   => Il utilise createSendToken(user, 200, res) pour renvoyer le status et JSON ?
	try {
		await db('users').where({ reset_psswd_token: hashedToken }) // TODO : Ajuster si table 'login'
			.update({ hash, reset_psswd_token: null, reset_psswd_token_expiration: null });
		
		return res.status(200).json({
			status: 'success',
			message: 'Mot de passe réinitialisé avec succès'
		})
	}
	catch (err) {
		return res.status(400).json(`Erreur resetPassword : ${err}`);
	}
});


exports.logout = catchAsync(async (req, res, next) => {
	// Set token to none and expire after 5 seconds
	res.cookie('jwt', 'none', {
		expires: new Date(Date.now() + 1000), // 5 * 1000 pour 5secs
		httpOnly: true
	});
	
	res.status(200).json({
		status: 'success',
		message: 'Utilisateur déconnecté avec succès'
	});
});