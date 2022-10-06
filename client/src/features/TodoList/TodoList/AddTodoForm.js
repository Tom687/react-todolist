import React, { useState } from 'react';
//import PropTypes from 'prop-types';
import axios from 'axios';

import './AddTodoForm.css';
import { useDispatch } from 'react-redux';
import { addTodo, toggleAllTodos } from './TodoSlice';
// TODO : Voir si on peut import showAlert du bundle.js (back) depuis le build React pour afficher les erreurs "générales" et pas celles du projet séparé ?
//import { showAlert } from '../../public/js/todos.js';

// TODO : Pourquoi render 2 par 2 ? Comment diminuer le nombre de render ?
//let render=0;
const AddTodoForm = () => {
	//render++;console.log('RENDER', render);
	
	const [todo, setTodo] = useState('');
	
	const dispatch = useDispatch();
	
	// FIXME : Pourquoi ici POST /todos est tapé sans utiliser axios ? (donc todo entré en DB). Si on utilise axios, provoque un doublon en DB ? => Parce qu'on utilise axios depuis "le back" (bundle.js)
	function submitTodo(e) {
		e.preventDefault();
		
		if (!todo.trim()) {
			return;
		}
		
		dispatch(addTodo(todo.trim()));
		
		setTodo('');
	}
	
	// TODO : Car ID retourné depuis DB et utilisé dans Redux, on ne pourra pas utiliser en mode "invité"
	//  => Créer une autre Fn qui, si on n'est pas connecté, fait seulement submitTodo() sans le backend (et qui utilise l'ancienne Fn Redux qui créer l'ID sur le tas)
	async function submitBackend(e) {
		e.preventDefault();
		
		if (!todo.trim())
			return;
		
		try {
			const response = await axios.post('/todos', {
				title: todo.trim(),
				completed: todo.completed,
				// TODO : Si todo.completed => status = "fait", sinon "non". Si "fait" => Faire done_on = date.now()
			});

			if (response.data.status === 'success' || response.status === 201) {
				dispatch(addTodo({ text: todo.trim(), id: response.data.id }));

				setTodo('');
				// TODO : dispatch et setTodo() ici ? Comment faire showAlert ici ? (celui du back)
			}
		}
		// TODO : Comment gérer l'err dans "alerts" (js back) depuis le build React ?
		catch (err) {
			if (err.response) {
				console.log('ERR.RES', err.response);
			}
			console.error('ERROR SUBMIT TODO BACKEND : ', err);
		}
	}
	
	return (
		<div className="todos-header">
			<button 
				className="toggle-all-todos"
				onClick={() => dispatch(toggleAllTodos())}
			>❯</button>
			<form
				// TODO : Revoir les champs controlés (besoin que de onChange et name ? Value aussi non ?)
				onSubmit={(e) => submitBackend(e)}
				id="add-todo-form"
				className="add-todo-form"
			>
				<input
					type="text"
					placeholder="Ajouter une chose à faire"
					id="add-todo-input"
					className="add-todo-input"
					name="todo"
					onChange={e => setTodo(e.target.value)}
					value={todo} // TODO : value=todo ?
				/>
				{/*<button
				 type="submit"
				 >
				 Ajouter
				 </button>*/}
			</form>
		</div>
	);
};

export default AddTodoForm;