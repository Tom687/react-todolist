const router = require('express').Router();
const authMiddlewares = require('../middlewares/auth');
const todosController = require('../controllers/todos');


router.get('/', authMiddlewares.protect, todosController.getTodos);
router.post('/', authMiddlewares.protect, todosController.insertTodo);
router.put('/:id', authMiddlewares.protect, todosController.editTodo);
router.delete('/:id', authMiddlewares.protect, todosController.deleteTodo);

module.exports = router;