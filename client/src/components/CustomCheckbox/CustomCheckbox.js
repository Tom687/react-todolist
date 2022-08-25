import React, { useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

import './CustomCheckbox.css';

const CustomCheckbox = ({ onClick, done }) => {
	const [isChecked, setIsChecked] = useState(false);
	
	// TODO : Si !done, le checkbox ne peut pas avoir la class .checked
	
	function onChange() {
		console.log('ISCHECKED', isChecked, 'DONE', done)
		// TODO : Voir un meilleur moyen pour le check ?
		//  => Pire des cas : isChecked = false et done = true (qd on repasse à undone après un edit sur un done)
		/*if (!isChecked || !done) {
		 setIsChecked(true);
		 }*/
		
		// TODO : Comprendre le fonctionnement ? (en rapport avec toggleAllTodos de TodoSlic  e.js)
		if (!done) {
			setIsChecked(false);
		}
		else if (done || isChecked) {
			setIsChecked(false);
		}
		/*else if (!done || !isChecked) {
			setIsChecked(true);
		}*/
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
				//onChange={() => setIsChecked(!isChecked)}
				onChange={() => onChange()}
				className={clsx('custom-checkbox')}
			/>
			<span
				// TODO : Voir meilleur moyen pour le .checked ?
				className={clsx('custom-visible-checkbox', { 'checked': isChecked || done })}
				//onClick={() => setIsChecked(!isChecked)}
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