import React, { useState } from 'react';

import './Footer.css';
import FilterLink from './FilterLink';
import { setVisibilityFilter, VisibilityFilters } from './FilterSlice';
import { useDispatch, useSelector } from 'react-redux';
import { selectUndoneTodosNumber } from '../TodoList/TodoSlice';

const Footer = () => {
	const [activeFilter, setActiveFilter] = useState(null);
	const dispatch = useDispatch();
	
	const undoneTodosNumber = useSelector(selectUndoneTodosNumber);
	const todosLeftWord = undoneTodosNumber > 1 ? 'tâches restantes' : 'tâche restante';
	
	function toggleFilter(filter) {
		setActiveFilter(filter);
		dispatch(setVisibilityFilter(filter));
	}
	
	return (
		<div className="footer">
			<span className="undone-todos">
				{ undoneTodosNumber || 'Aucune' } { todosLeftWord }
			</span>
			<div className="filters">
				<FilterLink
					filter={VisibilityFilters.SHOW_ALL}
					onClick={() => toggleFilter(VisibilityFilters.SHOW_ALL)}
					activeFilter={activeFilter}
				>
					Tous
				</FilterLink>
				<FilterLink
					filter={VisibilityFilters.SHOW_COMPLETED}
					onClick={() => toggleFilter(VisibilityFilters.SHOW_COMPLETED)}
					activeFilter={activeFilter}
				>
					Faits
				</FilterLink>
				<FilterLink
					filter={VisibilityFilters.SHOW_ACTIVE}
					onClick={() => toggleFilter(VisibilityFilters.SHOW_ACTIVE)}
					activeFilter={activeFilter}
				>
					A faire
				</FilterLink>
			</div>
			
		</div>
	);
};

export default Footer;