import AppError from '../utils/appError.js';
import catchAsync from '../middlewares/catchAsync.js';
import db from '../utils/postgresDB.js';
import moment from 'moment';

export const insertTodo = catchAsync(async (req, res, next) => {
	const { title } = req.body;
	
	if (!title)
		return next(new AppError('Il manque des infos pour insérer le todo en DB', 400));

	const [insertedTodo] = await db('todos').insert({
		id_member: res.locals.user.id,
		title,
		created_on: moment(), // TODO : Voir si moment() donne la bonne heure ? Utiliser locale ?
	}, ['id']);

	res.status(201).json({
		status: 'success',
		message: 'Todo créé et inséré en DB avec succès',
		id: insertedTodo.id,
	});
});

export const getTodos = catchAsync(async (req, res, next) => {
	const todos = await db('todos').select('id', 'id_user AS memberId', 'title', 'completed', 'created_on AS createdOn', 'done_on AS doneOn')
		.where({ id_user: res.locals.user.id })
		.orderBy('id', 'asc');
	
	res.status(200).json({
		status: 'success',
		todos,
		message: 'Todolist récupérée avec succès depuis la DB',
	});
});


export const editTodo = catchAsync(async (req, res, next) => {
	await db('todos').where({ id: req.params.id })
		.update(req.body);
	
	res.status(200).json({
		status: 'success',
		message: 'Todo modifié avec succès',
	});
});

export const toggleAllTodos = catchAsync(async (req, res, next) => {
	await db('todos').where({ id_user: res.locals.user.id })
		.update({ completed: req.body.completed });
	
	res.status(200).json({
		status: 'success',
		message: 'Toggle',
	})
});


export const deleteTodo = catchAsync(async (req, res, next) => {
	await db('todos').where({ id: req.params.id }).del();
	
	res.status(200).json({
		status: 'success',
		message: 'Todo supprimé avec succès',
	});
});