import '@babel/polyfill';
import { login } from './login';
import { showAlert } from './alerts';
import { insertTodo } from './todos';

const loginForm = document.getElementById('login-form');

if (loginForm) {
	loginForm.addEventListener('submit', event => {
	  event.preventDefault();
	  
	  const email = document.getElementById('email').value;
	  const password = document.getElementById('password').value;
	  
	  if (!email) {
	  	alert.innerText = 'Email';
	  	//showAlert('Error', 'Email non saisi');
	  }
	  if (!password) {
		  alert.innerText = 'MDP';
	  	//showAlert()
	  }
	  
		login(email, password);
	});
}


/*
const addTodoForm = document.getElementById('add-todo-form');

if (addTodoForm) {
	addTodoForm.addEventListener('submit', event => {
	  event.preventDefault();
	  
	  const title = document.getElementById('add-todo-input').value;
	  
	  if (!title.trim()) {
	  	alert.innerText = 'Todo incomplet';
	  }
	  
	  insertTodo(title.trim());
	});
}*/
