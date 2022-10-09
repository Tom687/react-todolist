import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

import './FilterLink.css';

const FilterLink = ({ filter, onClick, activeFilter, children }) => {
	return (
		<button
			onClick={onClick}
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