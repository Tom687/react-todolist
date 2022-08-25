import React, { useCallback, useEffect, useRef, useState } from 'react';

import './TodoList.css';
import TodoItempp from './TodoItempp';
import { useDispatch, useSelector } from 'react-redux';
import { addTodo, addTodosFromDB, editTodo, selectVisibleTodos } from './TodoSlice';

import axios from 'axios';
import TodoItem from './TodoItem';

/*
* TODO : Général :
*  => Centrer le tout et mettre un max-width ?
*  => Rendre responsive
*  => Styliser le tout
*
* TODO : AddTodo.js :
*  => Ajouter un bouton "Marquer tout comme fait" (Redux => toggleAll)
*
* TODO : TodoList.js :
*  => Modifier le onClick (Item.js) => Ne pas déclarer comme "done" au click
*   => Ajouter une checkbox pour mettre un item en "done"
*     => Styliser la checkbox (image ? css => .checkbox:cheked + label => Mettre le text de l'item en tant que label ?)
*  => Ajouter "Edit item" (ouvre un input au lieu de l'item, avec son text déjà dedans) pour éditer un item
*   => Fait mais utilise onBlur ou enter pour valider. Si on edit un item et qu'on ne va pas dans l'input, l'input
*  ne s'enlève pas (étant donné qu'il faut passer dedans puis dehors pour le retirer)
* */
//let todos;

const TodoList = () => {
	const dispatch = useDispatch();
	let todos = useSelector(selectVisibleTodos);
	//const [todoss, setTodoss] = useState([]);
	
	/*useEffect(() => {
		(async () => {
			//let response= await fetchData("https://api.coindesk.com/v1/bpi/currentprice.json");
			//setData(response);
			try {
				const res = await axios.get('http://localhost:3000/todos');
				if (res.status === 200 || res.data.status === 'success') {
					//setTodos(res.data.todoss);
					todos = res.data.todos;
					return res.data.todos;
				}
			}
			catch (err) {
				console.error('ERR GETDBTODOS', err);
			}
			
		})();
	}, []);*/
	
	const getDBTodos = async () => {
		try {
			const res = await axios.get('http://localhost:3000/todos');
			if (res.status === 200 || res.data.status === 'success') {
				todos = res.data.todos;
				// TODO : Dispatch tous les todos d'un coup au lieu de loop un à un
				for (let i in todos) {
					dispatch(addTodosFromDB(todos[i]));
				}
				//return res.data.todos;
			}
		}
		catch (err) {
			console.error('ERR GETDBTODOS', err);
		}
	};
	
	// TODO : Utilise useCallback() ici ?
	//const getDb = useCallback(async () => {
	//	try {
	//		const res = await axios.get('http://localhost:3000/todos');
	//		if (res.status === 200 || res.data.status === 'success') {
	//			todos = res.data.todos;
	//			// TODO : Dispatch tous les todos d'un coup au lieu de loop un à un
	//			for (let i in todos) {
	//				dispatch(addTodosFromDB(todos[i]));
	//			}
	//			//return res.data.todos;
	//		}
	//	}
	//	catch (err) {
	//		console.error('ERR GETDBTODOS', err);
	//	}
	//}, []);
	
	useEffect(() => {
		getDBTodos();
	}, []);
	
	// TODO : Comment passer cette Fn dans TodoItem ? Impossible ?
	const modifyTodo = (id, newTitle) => {
		for (let todo of todos) {
			if (todo.id === id && todo.text !== newTitle) {
				dispatch(editTodo({ id, text: newTitle }));
			}
		}
	};
	
	const newTodo = (todo) => {
		return (
			<TodoItem
				key={todo.id}
				id={todo.id}
				text={todo.text}
				onEditingTodo={(id, text) => modifyTodo(id, text)}
				todo={todo}
			/>
		);
	};
	
	return (
		<div className="todolist-container">
			<ul className="todo-list">
				{/*{
					todos.map(todo => (
						<TodoItem key={todo.id} todo={todo} />
					))
				}*/}
				{
					todos.map(newTodo)
				}
			</ul>
		</div>
	);
};

export default TodoList;