import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addTodosFromDB, editTodo, removeAllTodos, selectVisibleTodos } from './TodoSlice';
import axios from 'axios';
import TodoItem from './TodoItem';
import { useAuth } from '../../../contexts/auth';
import styled from 'styled-components';

const TodoList = () => {
	const dispatch = useDispatch();
	let todos = useSelector(selectVisibleTodos);
	

	const getDBTodos = async () => {
		try {
			const res = await axios.get('/todos');
			
			if (res.status === 200 || res.data.status === 'success') {
				todos = res.data.todos;
				// TODO : Dispatch tous les todos d'un coup au lieu de loop un à un
				for (let i in todos) {
					dispatch(addTodosFromDB(todos[i]));
				}
			}
		}
		catch (err) {
			console.error('ERR GETDBTODOS', err);
		}
	};
	
	const { currentUser } = useAuth();
	
	useEffect(() => {
		if (currentUser) {
			dispatch(removeAllTodos());
			getDBTodos();
		}
	}, [currentUser]);
	
	// TODO : Comment passer cette Fn dans TodoItem ?
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
		<ListContainer>
			{/*<li>*/}
				{
					todos.map(newTodo)
				}
			{/*</li>*/}
		</ListContainer>
	);
};

const ListContainer = styled.div`
  width: 100%;
  border: 1px solid #e6e6e6;
  border-bottom: none;
`;

const List = styled.li`
  font: 14px 'Helvetica Neue', Helvetica, Arial, sans-serif;
`;

export default TodoList;