const jwt = require('jsonwebtoken');
const redisClient = require('../config/redisClient');

// TODO : Utilisé lorsqu'on utilise Redis pour le session managment


// TODO : Ajuster les infos du payload
exports.signToken = (id, email, role) => {
	const jwtPayload = { id, email, role };
	return jwt.sign(jwtPayload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN }); // TODO : expires ?
};

// TODO : .resolve() utile ?
const setToken = (token, userId) => {
	return Promise.resolve(redisClient.set(token, userId));
};

// TODO : Ajuster selon les infos de user ?
exports.createSessions = (user) => {
	const { id, email, role } = user;
	const token = signToken(id, email, role);
	return setToken(token, id)
		.then(() => {
			return { status: 'success', userId: id, token };
		})
		.catch(err => console.log(`Error createSessions() - /helpers/jwtSessions.js : ${err}`));
};

// TODO : Promisification utile ? Essayer avec catchAsync plutôt ?
// TODO : Pour .protect, on devrait retourner true / false (ou l'id qu'on renvoi en Promise ?)
exports.getAuthTokenIdPromise = (req, res) => {
	const { authorization } = req.headers;
	
	if (!authorization) {
		return Promise.reject('Accès non authorisé');
	}
	
	const authToken = authorization.split(' ')[1];
	
	return new Promise((resolve, reject) => {
		redisClient.get(authToken, (err, reply) => {
			if (err || !reply) {
				reject('Accès non authorisé - Token non identifié');
			}
			
			resolve({ id: reply });
		});
	});
};