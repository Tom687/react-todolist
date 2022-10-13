import express from 'express';
import { getTodos, insertTodo, editTodo, deleteTodo, toggleAllTodos } from '../controllers/todos.js';
import requireUser from '../middlewares/requireUser.js';

const router = express.Router();

router.get('/', requireUser, getTodos);
router.post('/', requireUser, insertTodo);
router.put('/', requireUser, toggleAllTodos);
router.put('/:id', requireUser, editTodo);
router.delete('/:id', requireUser, deleteTodo);

export default router;