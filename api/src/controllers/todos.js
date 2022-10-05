import AppError from '../utils/appError.js';
import catchAsync from '../middlewares/catchAsync.js';
import db from '../utils/postgresDB.js';
import moment from 'moment';

export const insertTodo = catchAsync(async (req, res, next) => {
	const { title, completed } = req.body;

	if (!title || title === 'e')
		return next(new AppError('Il manque des infos pour insérer le todo en DB', 400));
	
	let status, doneOn;
	if (completed === true) {
		status = 'fait';
		doneOn = moment(); // TODO : Voir si moment() donne la bonne heure ? Utiliser locale ?
	}
	else if (completed === false) {
		status = 'non';
		doneOn = undefined;
	}
	
	const [insertedTodo] = await db('todos').insert({
		id_member: req.session.user.id,
		title,
		status,
		created_on: moment(), // TODO : Voir si moment() donne la bonne heure ? Utiliser locale ?
		done_on: doneOn,
	}, ['id']);
	
	res.status(201).json({
		status: 'success',
		message: 'Todo créé et inséré en DB avec succès',
		id: insertedTodo.id
	})
});

export const getTodos = catchAsync(async (req, res, next) => {
	const todos = await db('todos').select('id', 'id_member AS memberId', 'title', 'status', 'created_on AS createdOn', 'done_on AS doneOn')
		.where({ id_member: req.session.user.id })
		.orderBy('id', 'asc'); // TODO : Pour l'ordre, utiliser un champ "position" ?
	
	res.status(200).json({
		status: 'success',
		todos,
		message: 'Todolist récupérée avec succès depuis la DB' // FIXME : Modifier / retirer message
	})
});


export const editTodo = catchAsync(async (req, res, next) => {
	/*const edit = */await db('todos').where({ id: req.params.id })
		.update(req.body);
	
	res.status(200).json({
		status: 'success',
		message: 'Todo modifié avec succès'
	});
});


export const deleteTodo = catchAsync(async (req, res, next) => {
	/*const removed = */await db('todos').where({ id: req.params.id }).del();
	
	res.status(200).json({
		status: 'success',
		message: 'Todo supprimé avec succès'
	});
});