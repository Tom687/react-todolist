import { createSelector, createSlice } from '@reduxjs/toolkit';

import { VisibilityFilters } from '../Filter/FilterSlice';

const TodoSlice = createSlice({
	name: 'todos',
	// TODO : Voir comment gérer le initState ? Si objet, bug car push (addTodo) ne fonctionne pas et todos récupérés
	//  dans TodoList (useSelector(selectVisibleTodos) bug car todos = objet
	initialState: /*{
		id: '',
		text: '',
		createdOn: '',
		completed: undefined,
	}*/
	[],
	reducers: {
		addTodo(state, action) {
			const { id, text } = action.payload;

			state.push({ id, text, completed: false });
		},
		addTodosFromDB(state, action) {
			let { id, title, status } = action.payload;
			
			status = status === 'fait';
			
			state.push({ id, text: title, completed: status });
		},
		toggleTodo(state, action) {
			const todo = state.find(todo => todo.id === action.payload);
			
			if (todo) {
				todo.completed = !todo.completed;
			}
		},
		toggleAllTodos(state, action) {
			const doneTodos = state.every(todo => todo.completed);

			state.map(todo => todo.completed = !doneTodos);
		},
		editTodo(state, action) {
			const todo = state.find(todo => todo.id === action.payload.id);

			if (todo) {
				todo.text = action.payload.text;
			}
		},
		removeTodo(state, action) {
			return state.filter(todo => todo.id !== action.payload);
		},
		removeAllTodos(state, action) {
			return state = [];
		}
	},
});

const selectTodos = state => state.todos;
const selectFilters = state => state.filters;

export const selectVisibleTodos = createSelector(
	[selectTodos, selectFilters],
	(todos, filter) => {
		switch (filter) {
			case VisibilityFilters.SHOW_ALL:
				return todos;
			case VisibilityFilters.SHOW_ACTIVE:
				return todos.filter(todo => !todo.completed);
			case VisibilityFilters.SHOW_COMPLETED:
				return todos.filter(todo => todo.completed);
			default:
				throw new Error(`Unknown filter : ${filter}`);
		}
	}
);

// TODO : Voir utilité du createSelector ?
export const selectUndoneTodosNumber = createSelector(
	[selectTodos],
	(todos) => {
		return todos.filter(todo => !todo.completed).length;
	}
);

const { actions, reducer } = TodoSlice;

export const { addTodo, addTodosFromDB, toggleTodo, toggleAllTodos, editTodo, removeTodo, removeAllTodos } = actions;

export default reducer;