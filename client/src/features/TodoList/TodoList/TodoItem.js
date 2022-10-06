import React, { useCallback, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';

//import styles from './TodoItem.module.css';
import './TodoItem.css';
import { useDispatch } from 'react-redux';
import { editTodo, removeTodo, toggleTodo } from './TodoSlice';
import CustomCheckbox from '../../../components/CustomCheckbox/CustomCheckbox';
import axios from 'axios';
import useKeyPress from '../../../hooks/useKeyPress';
import useOnClickOutside from '../../../hooks/useOnClickOutside';
//import './InlineEdit.css';

// TODO : Voir si mieux de passer "text" en props ou le chercher via un sélecteur ? VOIR POUR ID => id étant ds une func
/*
* TODO :
*  => Faire en sorte que l'input (en mode editing) prenne tout le li sans rien faire bouger
* */
// TODO : Unifier Redux et API (completed = true / false au front et "fait" / "non" au back. Text au front et title au back pour le titre,…)
const TodoItem = ({ id, text, todo, onEditingTodo }) => {
	const dispatch = useDispatch();

	const [isEditingActive, setIsEditingActive] = useState(false);
	const [editingValue, setEditingValue] = useState(text);
	
	const wrapperRef = useRef(null);
	const inputRef = useRef(null);
	
	const enter = useKeyPress('Enter');
	const escape = useKeyPress('Escape');
	
	useOnClickOutside(wrapperRef, () => {
		if (isEditingActive) {
			if (editingValue.trim() !== todo.text) {
				onEditingTodo(id, editingValue.trim());
				edit2(editingValue.trim());
			}
			setIsEditingActive(false);
		}
	});
	
	const onEnter = useCallback(() => {
		if (enter) {
			if (editingValue.trim() !== todo.text) {
				onEditingTodo(id, editingValue.trim());
				edit2(editingValue.trim());
			}
			setIsEditingActive(false);
		}
	}, [enter, editingValue, onEditingTodo]);
	
	const onEscape = useCallback(() => {
		if (escape) {
			setEditingValue(text);
			setIsEditingActive(false)
		}
	}, [escape, editingValue, onEditingTodo]);
	
	useEffect(() => {
		if (isEditingActive)
			inputRef.current.focus();
	}, [isEditingActive]);
	
	useEffect(() => {
		if (isEditingActive) {
			onEnter();
			onEscape();
		}
	}, [onEnter, onEscape, isEditingActive]);
	
	const handleTodoDblClick = useCallback(() => setIsEditingActive(true),
		[setIsEditingActive]
	);
	
	// TODO : Y'a t'il un intérêt à utiliser useCallback ici ? Permet de ne pas avoir le warning "promise not used" mais à part ça ?
	const edit2 = useCallback(async (newTodoText) => {
		try {
			if (newTodoText.length === 0) {
				// TODO : Utiliser obj config pour l'ID du todo ?
				// TODO : Utiliser config authorizationToken ?
				const res = await axios.delete('/todos/' + todo.id);
				
				if (res.status === 200 || res.data.status === 'success') {
					dispatch(removeTodo(todo.id));
				}
			}
			else {
				const res = await axios.put('/todos/' + todo.id, {
					title: newTodoText.trim()
				});
				
				// TODO : Utilité de ce code ? Afficher message de succès ? Sinon inutile
				if (res.status === 200 || res.data.status === 'success') {
					console.log('edit success', res.data);
					//dispatch(editTodo({ id: todo.id, text: newTodoText.trim() }));
				}
			}
		}
		catch (err) {
			// TODO : Comment afficher erreur avec alerte "générale" ?
			// TODO : Faire 2 try / catch pour catch err si suppr ou si edit ? Ou un seul pour les 2 est bon ?
			console.error('Err edit todo', err);
		}
	}, []);
	
	
	// TODO : trim() ne fonctionne pas (on peut ajouter un espace à la fin ou début du todo en editant)
	const edit = async () => {
		const newTodoText = editingValue.trim();
		
		try {
			if (newTodoText.length === 0) {
				// TODO : Utiliser obj config pour l'ID du todo ?
				// TODO : Utiliser config authorizationToken ?
				const res = await axios.delete('/todos/' + todo.id);
				
				if (res.status === 200 || res.data.status === 'success') {
					dispatch(removeTodo(todo.id));
				}
			}
			else {
				const res = await axios.put('/todos/' + todo.id, {
					title: newTodoText.trim()
				});
				
				// TODO : Utilité de ce code ? Afficher message de succès ? Sinon inutile
				if (res.status === 200 || res.data.status === 'success') {
					console.log('edit success', res.data);
					//dispatch(editTodo({ id: todo.id, text: newTodoText.trim() }));
				}
			}
		}
		catch (err) {
			// TODO : Comment afficher erreur avec alerte "générale" ?
			// TODO : Faire 2 try / catch pour catch err si suppr ou si edit ? Ou un seul pour les 2 est bon ?
			console.error('Err edit todo', err);
		}
	};
	
	const deleteTodo = async () => {
		try {
			const res = await axios.delete('/todos/' + todo.id);
			
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
			
			const res = await axios.put('/todos/' + todo.id, {
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
	
	
	// TODO : Quand on sort de isEditing, le .checked de checkbox disparait mais le style du li reste (= done)
	// TODO : Si todo.completed : ajouter .checked sur CustomCheckbox
	return (
		<li
			ref={wrapperRef}
			// TODO : Si un todo n'est pas class .done, il ne peut pas être checked dans CustomCheckbox
			className={clsx('todo-item', { 'done': todo.completed }, { 'editing': isEditingActive })}
		>
			<CustomCheckbox
				onClick={() => changeTodoStatus()}
				done={todo.completed}
			/>
			<label
				// TODO : Revoir le css du label ?
				onDoubleClick={handleTodoDblClick}
				className={`inline-text_copy inline-text_copy--${
					!isEditingActive ? "active" : "hidden"
				}`}
			>{
				// TODO : Retourner le nom du todo => Chercher dans le state => selector ? Ou en props ?
				todo.text
			}</label>
			<input
				ref={inputRef}
				value={editingValue}
				// TODO : Voir pourquoi on utilise pas la syntaxe normale : (e) => setIsEditingValue(e.target.value)
				onChange={e => setEditingValue(e.target.value)}
				className={`inline-text_input inline-text_input--${
					isEditingActive ? "active" : "hidden"
				}`}
			/>
			<button
				// TODO : Pourquoi utiliser ::after pour afficher le contenu (comme &times; ?) (comme ça dans todo-mvc-css)
				className="delete-todo"
				onClick={() => deleteTodo()}
			>
				&times;
			</button>
		</li>
	);
};

TodoItem.propTypes = {
	todo: PropTypes.shape({
		id: PropTypes.number.isRequired,
		text: PropTypes.string.isRequired,
		completed: PropTypes.bool.isRequired
	}).isRequired
};

export default TodoItem;