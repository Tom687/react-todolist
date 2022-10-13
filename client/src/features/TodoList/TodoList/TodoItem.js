import React, { useCallback, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { editTodo, removeTodo, toggleTodo } from './TodoSlice';
import CustomCheckbox from '../../../components/CustomCheckbox/CustomCheckbox';
import axios from 'axios';
import InlineEditInput from '../../../components/form/inlineEditInput';
import styled from 'styled-components';

const TodoItem = ({ id, text, todo, onEditingTodo }) => {
	const dispatch = useDispatch();

	const [isEditingActive, setIsEditingActive] = useState(false);
	
	const wrapperRef = useRef(null);

	const handleTodoDblClick = useCallback(() => setIsEditingActive(true),
		[setIsEditingActive]
	);
	
	// TODO : Y'a t'il un intérêt à utiliser useCallback ici ? Permet de ne pas avoir le warning "promise not used" mais à part ça ?
	const onEdit = useCallback(async (newTodoText) => {
		console.log({newTodoText})
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
					[newTodoText.name]: newTodoText.value.trim()
				});
				
				// TODO : Utilité de ce code ? Afficher message de succès ? Sinon inutile
				if (res.status === 200 || res.data.status === 'success') {
					console.log('edit success', res.data);
					dispatch(editTodo({ id: todo.id, text: newTodoText.value.trim() }));
				}
			}
		}
		catch (err) {
			// TODO : Comment afficher erreur avec alerte "générale" ?
			// TODO : Faire 2 try / catch pour catch err si suppr ou si edit ? Ou un seul pour les 2 est bon ?
			console.error('Err edit todo', err);
		}
	}, []);
	
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
			const status = !todo.completed;
			let done_on;
			
			// TODO : Fixer la date pour avoir la bonne du client (ici on a -1h avec new Date())
			if (status) done_on = new Date();
			else done_on = null;
			
			const res = await axios.put('/todos/' + todo.id, {
				completed: status,
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
	
	const [inputValue, setInputValue] = useState(text);
	
	return (
		<ItemWrapper
			ref={wrapperRef}
			completed={todo.completed}
			isEditing={isEditingActive}
			onDoubleClick={handleTodoDblClick}
		>
			<CustomCheckbox
				onClick={() => changeTodoStatus()}
				done={todo.completed}
			/>
			<InlineEditInput
				initialValue={inputValue}
				setInitialValue={setInputValue}
				name="title"
				onSave={onEdit}
				//{ ...register('title') }
			/>
			<DeleteButton
				className="delete-todo"
				onClick={() => deleteTodo()}
			>
				&times;
			</DeleteButton>
		</ItemWrapper>
	);
};

TodoItem.propTypes = {
	todo: PropTypes.shape({
		id: PropTypes.number.isRequired,
		text: PropTypes.string.isRequired,
		completed: PropTypes.bool.isRequired
	}).isRequired
};

const ItemWrapper = styled.li`
  cursor: pointer;
  position: relative;
  font-size: 1.65rem;
  transition: color 0.35s;
  border-bottom: 1px solid #e6e6e6;
  padding: 0.75rem 1rem;
  /*height: 63px;*/
  font-weight: 300;
  line-height: 1.4;
  display: flex;
	padding-right: 2rem;
	
	&:last-child {
    border-bottom: none;
  }

  &:hover .delete-todo {
    display: block;
    position: absolute;
    top: 5px;
    right: 0.5rem;
  }
	
	${props => !props.completed} {
    text-decoration: line-through rgba(222, 72, 72, 0.65);
    color: #d9d9d9;
    transition: color 0.35s;
	}
	
	${props => !props.isEditing} {
		input[type="text"] {
      /*margin-left: 3.5rem;*/
      /*height: fit-content;*/
      /*width: 100%;
			\theight: 100%;*/
      line-height: 1.4;
      border: 1px solid #999;
      -webkit-box-shadow: inset 0 -1px 5px 0 rgba(0, 0, 0, 0.2);
      box-shadow: inset 0 -1px 5px 0 rgba(0, 0, 0, 0.2);
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      padding-left: 0.95rem;
      /*padding-bottom: 3px;*/
      /* TODO : Normalement pas besoin de pos:r et bottom:40px pour que l'input soit centré */
      position: relative;
      display: flex;
      /*flex-grow: 1;*/
      width: 95%;
      /*bottom: 40px;*/
			align-self: center;
			height: 100%;
		}

    input:focus {
      outline: none;
    }
	}
	
	label {
    display: inline-block;
    width: 90%;
	}
`;

const DeleteButton = styled.button`
  display: none;
  color: #cc9a9a;
  font-size: 2rem;
  font-weight: 400;
  text-decoration: none;
  cursor: pointer;
	
	&:hover {
    color: #af5b5e
  }
`;

export default TodoItem;