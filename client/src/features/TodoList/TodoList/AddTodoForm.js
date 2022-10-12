import React, { useState } from 'react';
//import PropTypes from 'prop-types';
import axios from 'axios';

import { useDispatch } from 'react-redux';
import { addTodo, toggleAllTodos } from './TodoSlice';
import styled from 'styled-components';
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
	
	// FIXME : Pourquoi le todo qu'on insère est completed = true ?
	
	// TODO : Car ID retourné depuis DB et utilisé dans Redux, on ne pourra pas utiliser en mode "invité"
	//  => Créer une autre Fn qui, si on n'est pas connecté, fait seulement submitTodo() sans le backend (et qui utilise l'ancienne Fn Redux qui créer l'ID sur le tas)
	async function submitBackend(e) {
		e.preventDefault();
		
		if (!todo.trim())
			return;
		
		try {
			const response = await axios.post('/todos', {
				title: todo.trim(),
			});

			if (response.data.status === 'success' || response.status === 201) {
				dispatch(addTodo({ text: todo.trim(), id: response.data.id }));

				setTodo('');
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
		<HeaderWrapper>
			<ToggleButton
				onClick={() => dispatch(toggleAllTodos())}
			>❯</ToggleButton>
			<StyledForm
				// TODO : Revoir les champs controlés (besoin que de onChange et name ? Value aussi non ?)
				onSubmit={(e) => submitBackend(e)}
				id="add-todo-form"
			>
				<input
					type="text"
					placeholder="Ajouter une chose à faire"
					id="add-todo-input"
					name="todo"
					onChange={e => setTodo(e.target.value)}
					value={todo} // TODO : value=todo ?
				/>
			</StyledForm>
		</HeaderWrapper>
	);
};

const HeaderWrapper = styled.div`
  position: relative;
`;

const ToggleButton = styled.button`
  cursor: pointer;
  color: rgba(0, 0, 0, 0.2);
  position: absolute;
  top: 0;
  left: 8px;
  font-size: 1.5rem;
  height: 47px;
  width: 47px;
  transform: rotate(90deg);
	
	&:focus {
    outline: none;
    color: rgba(175, 91, 94, 0.6);
  }
`;

const StyledForm = styled.form`
  width: 100%;
  text-align: center;

  > input {
    width: 100%;
    border: 1px solid #e6e6e6;
    -webkit-box-shadow: inset 0 -2px 1px rgba(0, 0, 0, 0.03);
    box-shadow: inset 0 -2px 1px rgba(0, 0, 0, 0.03);
    padding: 0.5rem 1rem;
    font-size: 1.5rem;
    font-weight: 300;
    padding-left: 4.5rem;
  }

  > input:focus {
    /*outline-color: #af3b5e;*/ /* rgba(175, 59, 94, 1) */
    outline: none;
    background-color: rgba(175, 91, 94, 0.3); /* rgba(175, 91, 94, 1) */
  }
`;

export default AddTodoForm;