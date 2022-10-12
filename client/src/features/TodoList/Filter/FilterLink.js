import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const FilterLink = ({ filter, onClick, activeFilter, children }) => {
	return (
		<Button
			onClick={onClick}
			//className={clsx('filter-link', { 'active': activeFilter === filter })}
			isActive={activeFilter === filter}
		>
			{ children }
		</Button>
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

const Button = styled.button`
  cursor: pointer;
  font-size: 1rem;
  padding: 0.1rem 0.25rem;
  border: 1px solid transparent;
  border-radius: 3px;
  margin: 0 0.2rem;
	
	&:hover {
    border: 1px solid #cc9a9a;
	}

	${props => props.isActive} {
    border: 1px solid #af5b5e;
	}

  &:focus {
    outline: none;
    background-color: rgba(175, 91, 94, 0.3);
  }
`;

export default FilterLink;