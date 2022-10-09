// https://www.educative.io/answers/how-to-edit-text-on-double-click-in-reactjs

import { useCallback, useEffect, useRef } from 'react';
import useToggle from '../../hooks/useToggle';
import useInput from '../../hooks/useInput';
import useOnClickOutside from '../../hooks/useOnClickOutside';
import useKeyPress from '../../hooks/useKeyPress';
import styled from 'styled-components';

export default function InlineEditInput({
	initialValue,
	setInitialValue,
	elementType = 'input',
	type = 'text',
	rows = 5,
	name,
	onSave,
	//...props
}) {
	const wrapperRef = useRef(null);
	const textRef = useRef(null);
	const inputRef = useRef(null);
	
	const { status: expanded, toggleStatus } = useToggle();
	const { value, onChange } = useInput(initialValue);
	
	const enter = useKeyPress('Enter');
	const esc = useKeyPress('Escape');
	const tab = useKeyPress('Tab');
	
	const setValues = (value) => {
		onChange(value);
		setInitialValue(value);
		
		let target = inputRef;
		target = target.current;
		
		onSave({ name: target.name, value: target.value });
	};
	
	const resetValues = (resetValue) => {
		onChange(resetValue)
	};
	
	const validateAndSetValues = (initialValue, value) => {
		// Save the value and close the editor
		if (value.trim() === '') {
			resetValues(initialValue.trim());
		}
		else if (initialValue !== value.trim()) {
			setValues(value.trim());
		}
		toggleStatus();
	}
	
	useOnClickOutside(wrapperRef, () => {
		if (expanded) {
			validateAndSetValues(initialValue, value);
		}
	});
	
	// Pour save et display après enter : handleFormChange()
	const onEnter = useCallback(() => {
		if (enter && elementType !== 'textarea') {
			validateAndSetValues(initialValue, value);
		}
	}, [enter, value, onChange]);
	
	const onEscape = useCallback(() => {
		if (esc) {
			resetValues(initialValue);
			toggleStatus();
		}
	}, [esc, initialValue]);
	
	const onTab = useCallback(() => {
		if (tab) {
			validateAndSetValues(initialValue, value);
		}
	}, [tab, value, onChange]);
	
	useEffect(() => {
		if (inputRef && inputRef.current && expanded) {
			// Use this to place cursor at the end of the textarea edit box
			if (elementType === 'textarea') {
				inputRef.current.setSelectionRange(value.length, value.length)
			}
			inputRef.current.focus();
		}
	}, [expanded, inputRef]);
	
	useEffect(() => {
		if (expanded) {
			onTab();
			onEnter();
			onEscape();
		}
	}, [onEnter, onEscape, onTab, expanded]);
	
	return (
		
		// Render span element
		<TextWrapper ref={wrapperRef} className="inline-edit">
			{ // Use JavaScript's ternary operator to specify <span>'s inner content
				expanded ? elementType !== 'textarea' ?
			  (
					  <input
						  type={type}
						  name={name}
						  value={value}
						  onChange={onChange}
						  autoFocus
						  ref={inputRef}
					  />
			  ) : (
					 <textarea
						 name={name}
						 value={value}
						 onChange={onChange}
						 rows={rows}
						 autoFocus
						 ref={inputRef}
					 />
			  ) : (
					
				<span
					ref={textRef}
					onDoubleClick={toggleStatus}
					onTouchStart={toggleStatus}
					/*style={{
					display: 'inline-block',
					height: '25px',
					minWidth: '300px',
					}}*/
				>
			{ value }
				</span>
				)
			}
			{/*{
				expanded &&
					<EditIcon type="button" onClick={handleSubmit}>Edit</EditIcon>
			}*/}
		</TextWrapper>
	);
}

// TODO : TextWrapper devrait être un parent ? => Pour pouvoir styliser en dehors d'ici
const TextWrapper = styled.div`
  display: flex;
	/*flex-display: row;*/
	//justify-content: center;
	
	/*input, textarea {
		width: 25%;
	}*/
`;

const EditIcon = styled.button`
	display: flex;
	flex-direction: column;
`;