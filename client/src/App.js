import React, { useState } from 'react';

import './assets/reset.css';
import './assets/general.css';

//import './features/TodoList/todos.css';
import AddTodoForm from './features/TodoList/TodoList/AddTodoForm';
import TodoList from './features/TodoList/TodoList/TodoList';
import Footer from './features/TodoList/Filter/Footer';
//import InlineEdit from './components/InlineEdit/InlineEdit';
import axios from 'axios';
import RoleSwitch from './components/auth/roleSwitch';
import styled from 'styled-components';

function App() {
	
	const logout = async () => {
		const res = await axios.get('/logout');
		console.log('logout res', res);
		setTimeout(() => window.location.replace("http://localhost:3000/connexion"), 5000);
	};
	
	return (
		<>
			<Todos>
				<button onClick={() => logout()}>Logout</button>
				<RoleSwitch />
				<AddTodoForm/>
				<TodoList/>
				<Footer/>
			</Todos>
		</>
	);
}

// TODO : Rename !!
const Todos = styled.div`
  display: block;
  margin: 0 auto;
  /*display: flex;
	\tflex-direction: column;
	\talign-items: center;*/
  max-width: 600px;
  /* TODO : Général pas pris en compte (override par les autres .css) */
  line-height: 1.4;
  font: 14px 'Helvetica Neue', Helvetica, Arial, sans-serif;

  button {
    background: none;
    border: 1px solid transparent;
  }
`;

export default App;