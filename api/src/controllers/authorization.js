import AppError from '../utils/AppError.js';
import catchAsync from '../middlewares/catchAsync.js';
import db from '../utils/postgresDB.js';
import config from 'config';
import lodash from 'lodash';
import { signJwt, verifyJwt } from '../utils/jwt.js';

const { get } = lodash;

const accessTokenCookieOptions = {
	maxAge: 900000 * 2, // 30min
	httpOnly: true,
	domain: 'localhost', // TODO : Add to config file so we can change it when going in production
	path: '/',
	sameSite: 'lax', // TODO : Good pratice ?
	secure: false, // TODO : Add to config file so we can change it to true in production
};

// Get user
// Create session
// Create access & refresh token
// Set cookies with tokens
// Send back tokens
export const loginAccessToken = catchAsync(async (req, res, next) => {
	console.log('------')
	const [ user ] = await db('users').select('id', 'name', 'email', 'role')
		.where({ email: req.body.email });
	
	console.log({user})
	
	if (!user) {
		return next(new AppError('Invalid user', 401));
	}
	
	const accessToken = signJwt(
		{ ...user },
		{ expiresIn: config.get('accessTokenTtl') },
	);
	
	res.cookie('accessToken', accessToken, accessTokenCookieOptions);
	
	return res.json({
		status: 'success',
		accessToken,
		user,
	});
});