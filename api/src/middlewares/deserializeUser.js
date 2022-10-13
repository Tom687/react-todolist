import lodash from 'lodash';
import { verifyJwt } from '../utils/jwt.js';
const { get } = lodash;

const deserializeUser = (req, res, next) => {
  const accessToken = get(req, 'cookies.accessToken') ||
                      get(req, 'headers.authorization', '')
                        .replace(/^Bearer\s/, '');
  
  // TODO : Retirer erreur ici pour éviter de bloquer les requetes login ?
  if (!accessToken)
    return next();
  
  const { decoded, valid } = verifyJwt(accessToken);
  
  if (decoded) {
    res.locals.user = decoded;
    return next();
  }
  
  else return next();
};

export default deserializeUser;