import AppError from '../utils/appError.js';

const requireUser = (req, res, next) => {
	const user = res.locals.user;
 
	if (!user)
    return next(new AppError('- Veuillez vous connecter pour voir cette page', 403));
	
	return next();
};

export default requireUser;