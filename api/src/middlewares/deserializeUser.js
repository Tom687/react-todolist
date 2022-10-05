import lodash from 'lodash';
import { verifyJwt } from '../utils/jwt.js';
const { get } = lodash;

const deserializeUser = /*catchAsync(async */(req, res, next) => {
  const accessToken = get(req, 'cookies.accessToken') ||
                      get(req, 'headers.authorization', '')
                        .replace(/^Bearer\s/, '');
  
  // TODO : Retirer erreur ici pour éviter de bloquer les requetes login ?
  if (!accessToken)
    return next(/*new AppError('Vous n\'êtes pas authorisés à voir cette page - deserializeUser'), 403*/);
  
  const { decoded, valid } = verifyJwt(accessToken);
  
  if (decoded) {
    res.locals.user = decoded;
    return next();
  }
  
  else return next(/*new AppError('This should not happen - auth middleware', 400)*/);
}/*)*/;

export default deserializeUser;