import React, { useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';

//import styles from './TodoItem.module.css';
import './TodoItem.css';
import { useDispatch } from 'react-redux';
import { editTodo, removeTodo, toggleTodo } from './TodoSlice';
import CustomCheckbox from '../../../components/CustomCheckbox/CustomCheckbox';
import axios from 'axios';

// TODO : Voir si mieux de passer "text" en props ou le chercher via un sélecteur ? VOIR POUR ID => id étant ds une func
/*
* TODO :
*  => Faire en sorte que l'input (en mode editing) prenne tout le li sans rien faire bouger
* */
// TODO : Unifier Redux et API (completed = true / false au front et "fait" / "non" au back. Text au front et title au back pour le titre,…)
const TodoItem = ({ /*id, text*/ todo }) => {
	const dispatch = useDispatch();
	
	const [isEditing, setIsEditing] = useState(false);
	const [isEditingValue, setIsEditingValue] = useState(todo.text);
	
	/*const edit = (e) => {
		const newTodoText = isEditingValue.trim();
		if (isEditing) {
			// TODO : Voir si on utiliser e.nativeEvent.type est dangereux ?
			if (e.which === 13 || e.nativeEvent.type === 'blur') {
				if (newTodoText.length === 0) {
					dispatch(removeTodo(todo.id));
				}
				else {
					dispatch(editTodo({ id: todo.id, text: newTodoText }));
				}
				//dispatch(editTodo(todo.id));
				setIsEditing(false);
			}
		}
	};*/
	
	// TODO : trim() ne fonctionne pas (on peut ajouter un espace à la fin ou début du todo en editant)
	const edit = async (e) => {
		const newTodoText = isEditingValue.trim();
		
		if (isEditing) {
			try {
				if (e.which === 13 || e.nativeEvent.type === 'blur') {
					if (newTodoText.length === 0) {
						// TODO : Utiliser obj config pour l'ID du todo ?
						// TODO : Utiliser config authorizationToken ?
						const res = await axios.delete('http://localhost:3000/todos/' + todo.id);
						
						if (res.status === 200 || res.data.status === 'success') {
							console.log('removed success', res.data);
							dispatch(removeTodo(todo.id));
						}
					}
					else {
						const res = await axios.put('http://localhost:3000/todos/' + todo.id, {
							title: newTodoText.trim()
						});
						
						if (res.status === 200 || res.data.status === 'success') {
							console.log('edit success', res.data);
							dispatch(editTodo({ id: todo.id, text: newTodoText.trim() }));
						}
					}
					setIsEditing(false);
				}
			}
			catch (err) {
				// TODO : Comment afficher erreur avec alerte "générale" ?
				// TODO : Faire 2 try / catch pour catch err si suppr ou si edit ? Ou un seul pour les 2 est bon ?
				console.error('Err edit todo', err);
			}
			// TODO : Voir si on utiliser e.nativeEvent.type est dangereux ?
		}
	};
	
	const deleteTodo = async () => {
		try {
			const res = await axios.delete('http://localhost:3000/todos/' + todo.id);
			
			if (res.status === 200 || res.data.status === 'success') {
				dispatch(removeTodo(todo.id));
			}
		}
		catch (err) {
			console.error('Err deleteTodo', err);
		}
	};
	
	// TODO : Modifier la date "done_on" si on passe le status à "fait" et le suppr si on passe à "non"
	const changeTodoStatus = async () => {
		try {
			const status = todo.completed ? 'non': 'fait';
			let done_on;
			
			// TODO : Fixer la date pour avoir la bonne du client (ici on a -1h avec new Date())
			if (status === 'fait') done_on = new Date();
			else done_on = null;
			
			const res = await axios.put('http://localhost:3000/todos/' + todo.id, {
				status,
				done_on
			});
			
			if (res.status === 200 || res.data.status === 'success') {
				dispatch(toggleTodo(todo.id));
			}
		}
		catch (err) {
			console.error('Err changeTodoStatus', err);
		}
	};
	
	const editingInput = () => {
	
	};
	
	// TODO : Quand on sort de isEditing, le .checked de checkbox disparait mais le style du li reste (= done)
	if (isEditing) {
		return (
			<li
				className={clsx('todo-item', 'editing')}
				//onClick={() => dispatch(toggleTodo(todo.id))}
			>
				<input
					type="text"
					value={isEditingValue}
					onChange={e => setIsEditingValue(e.target.value)}
					onBlur={e => edit(e)}
					// TODO : Changer le outline du :focus (background-color ?)
					autoFocus={true}
					onKeyDown={e => edit(e)}
				/>
			</li>
		)
	}
	else {
		// TODO : Si todo.completed : ajouter .checked sur CustomCheckbox
		return (
			<li
				// TODO : Si un todo n'est pas class .done, il ne peut pas être checked dans CustomCheckbox
				className={clsx('todo-item', { 'done': todo.completed })}
				//onClick={() => dispatch(toggleTodo(todo.id))}
				// TODO : Si on utilise <label> pour le texte de l'item, placer le onDblClick sur label ?
				//onDoubleClick={() => setIsEditing(true)}
			>
				<CustomCheckbox 
					onClick={() => changeTodoStatus()}
					done={todo.completed}
				/>
				<label
					// TODO : Revoir le css du label ?
					onDoubleClick={() => setIsEditing(true)}
				>{
					// TODO : Retourner le nom du todo => Chercher dans le state => selector ? Ou en props ?
					todo.text
				}</label>
				<button
					// TODO : Pourquoi utiliser ::after pour afficher le contenu (comme &times; ?) (comme ça dans todo-mvc-css)
					className="delete-todo"
					onClick={() => deleteTodo()}
				>
					&times;
				</button>
			</li>
		)
	}
	
	/*return (
		<li
			className={clsx('todo-item', { 'done': todo.completed })}
			onClick={() => dispatch(toggleTodo(todo.id))}
			onDoubleClick={() => setIsEditing(true)}
		>
			{
				isEditing &&
				<input type="text" value={todo.text} onChange={e => setIsEditingValue(e.target.value)} />
			}
			{
				// TODO : Retourner le nom du todo => Chercher dans le state => selector ? Ou en props ?
				todo.text
			}
			<button
				// TODO : Pourquoi utiliser ::after pour afficher le contenu (comme &times; ?) (comme ça dans todo-mvc-css)
				className="delete-todo"
				onClick={() => dispatch(removeTodo(todo.id))}
				onDoubleClick={() => doubleClickTodo(todo.id)}
			>
				&times;
			</button>
		</li>
	);*/
};

TodoItem.propTypes = {
	todo: PropTypes.shape({
		id: PropTypes.number.isRequired,
		text: PropTypes.string.isRequired,
		completed: PropTypes.bool.isRequired
	}).isRequired
};

export default TodoItem;