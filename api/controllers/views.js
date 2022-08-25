const AppError = require('../utils/appError');
const catchAsync = require('../middlewares/catchAsync');
const db = require('../config/postgres');
const path = require('path');

exports.getLoginPage = (req, res) => {
	res.status(200).render('login', {
		title: 'Connexion'
	});
};


exports.getTodosPage = catchAsync(async (req, res, next) => {
	// TODO : Check de req.session.user ? Dans middleware auth ? (protect, isLoggedIn ?)
	//res.status(200).sendFile(path.join(__dirname+'/build/index.html'));
	
	//res.status(200).render('./build/index', { title: 'TODOS' }) // TODO : Si utiliser comme ça, view engine = EJS
	//res.status(200).sendFile('/build/index.html', { root: './' }); // TODO : Fonctionne comme ça mais pas de params
	
	const todos = await db('todos').select('id', 'id_member AS memberId', 'title', 'status', 'created_on AS createdOn', 'done_on AS doneOn')
		.where({ id_member: req.session.user.id });
	
	//console.log('user session', req.session.user);
	//console.log('todos', todos);
	
	res.status(200).render('todos', { user: req.session.user/*, todos: todos*/ });
	
	//res.status(200).render(path.join(__dirname + '/build/index.html'), {
	//	title: 'Todo List',
	//	user: req.session.user
	//});
});