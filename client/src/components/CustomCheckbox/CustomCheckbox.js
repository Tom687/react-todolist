import React, { useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

import './CustomCheckbox.css';

const CustomCheckbox = ({ onClick, done }) => {
	const [isChecked, setIsChecked] = useState(false);
	
	function onChange() {
		if (!done) {
			setIsChecked(false);
		}
		else if (done || isChecked) {
			setIsChecked(false);
		}
		else {
			setIsChecked(!isChecked);
		}
	}
	return (
		<div
			className={clsx('custom-checkbox-container')}
			onClick={onClick}
		>
			<input
				type="checkbox"
				checked={isChecked}
				onChange={() => onChange()}
				className={clsx('custom-checkbox')}
			/>
			<span
				// TODO : Voir meilleur moyen pour le .checked ?
				className={clsx('custom-visible-checkbox', { 'checked': isChecked || done })}
				onClick={() => onChange()}
			></span>
		</div>
	);
};

CustomCheckbox.propTypes = {
	onClick: PropTypes.func.isRequired,
	done: PropTypes.bool.isRequired,
};

export default CustomCheckbox;