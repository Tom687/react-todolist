import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const FilterLink = ({ filter, onClick, activeFilter, children }) => {
	console.log(activeFilter === filter)
	return (
		<StyledButton
			onClick={onClick}
			//className={clsx('filter-link', { 'active': activeFilter === filter })}
			isActive={activeFilter === filter}
		>
			{ children }
		</StyledButton>
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

const StyledButton = styled.button`
  cursor: pointer;
  font-size: 1rem;
  padding: 0.1rem 0.25rem;
  border: 1px solid transparent;
  border-radius: 3px;
  margin: 0 0.2rem;
	
	&:hover {
    border: 1px solid #cc9a9a;
	}

  &:focus {
    outline: none;
    background-color: rgba(175, 91, 94, 0.3);
  }

  ${props => !props.isActive} {
    border: 1px solid #af5b5e!important;
 	}
`;

export default FilterLink;