const router = require('express').Router();
const viewsController = require('../controllers/views');
const authController = require('../controllers/auth');
const authMiddlewares = require('../middlewares/auth');

router.get('/connexion', viewsController.getLoginPage);
router.get('/todoList', authMiddlewares.isLoggedIn, viewsController.getTodosPage);

module.exports = router;