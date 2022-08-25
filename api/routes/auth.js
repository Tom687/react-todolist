const router = require('express').Router();
const authController = require('../controllers/auth');
const authMiddlewares = require('../middlewares/auth');

router.post('/login', authController.loginAuthentication);
router.get('/logout', authController.logout);

module.exports = router;