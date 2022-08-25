import React/*, { useEffect, useState } */from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

import './FilterLink.css';

// TODO : Comment faire le onClick ici ? (différencier activeFilter de filter ici et pas dans Footer.js ?)
const FilterLink = ({ filter, onClick, activeFilter, children }) => {
	/*const [active, setActive] = useState(false);
	
	const dispatch = useDispatch();
	
	function filterLinkClick(filter) {
		if (active) {
			setActive(false);
		}
		dispatch(setVisibilityFilter(filter));
	}*/
	
	return (
		<button
			// TODO : onClick => setVisibilityFilter
			//onClick={() => filterLinkClick(filter)}
			onClick={onClick}
			//className="filter-link"
			className={clsx('filter-link', { 'active': activeFilter === filter })}
		>
			{ children }
		</button>
	);
};

FilterLink.propTypes = {
	filter: PropTypes.oneOf([
		'SHOW_ALL',
		'SHOW_ACTIVE',
		'SHOW_COMPLETED'
	]).isRequired,
	activeFilter: PropTypes.oneOf([ // TODO : Comment mettre null ? Retirer isRequired ?
		'SHOW_ALL',
		'SHOW_ACTIVE',
		'SHOW_COMPLETED'
	]),
	onClick: PropTypes.func.isRequired,
	children: PropTypes.string.isRequired,
};

export default FilterLink;