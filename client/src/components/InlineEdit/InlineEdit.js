import React, { useState, useEffect, useRef, useCallback } from 'react';
import useKeyPress from '../../hooks/useKeyPress';
import useOnClickOutside from '../../hooks/useOnClickOutside';

import './InlineEdit.css';

function InlineEdit(props) {
	const [isInputActive, setIsInputActive] = useState(false);
	const [inputValue, setInputValue] = useState(props.text);
	
	// Get the wrapping span node
	const wrapperRef = useRef(null);
	const textRef = useRef(null);
	const inputRef = useRef(null);
	
	const enter = useKeyPress('Enter');
	const esc = useKeyPress('Escape');
	
	const { onSetText } = props;
	
	// This hook takes a ref to watch and a Fn to run if the click happened outside
	useOnClickOutside(wrapperRef, () => {
		if (isInputActive) {
			// Save the value and close the editor
			onSetText(inputValue);
			setIsInputActive(false);
		}
	});
	
	const onEnter = useCallback(() => {
		if (enter) {
			onSetText(inputValue);
			setIsInputActive(false);
		}
	}, [enter, inputValue, onSetText]);
	
	const onEsc = useCallback(() => {
		if (esc) {
			setInputValue(props.text);
			setIsInputActive(false);
		}
	}, [esc, inputValue, onSetText]);
	
	// Focus the cursor in the input field on edit start
	useEffect(() => {
		if (isInputActive) {
			inputRef.current.focus();
		}
	}, [isInputActive]);
	
	useEffect(() => {
		if (isInputActive) {
			// if Enter is pressed, save the text and close the editor
			onEnter();
			// if Escape is pressed, revert the text and close the editor
			onEsc();
		}
	}, [onEnter, onEsc, isInputActive]); // Watch the Enter and Escape key presses
	
	//const handleInputChange = useCallback(
	//	event => {
	//		// sanitize the input a little
	//		setInputValue(DOMPurify.sanitize(event.target.value));
	//	},
	//	[setInputValue]
	//);
	
	
	const handleSpanClick = useCallback(() => setIsInputActive(true),
		[setIsInputActive]
	);
	
	return (
		<span className="inline-text" ref={wrapperRef}>
			<span
				ref={textRef}
				onClick={handleSpanClick}
				className={`inline-text_copy inline-text_copy--${
					!isInputActive ? "active" : "hidden"
				}`}
			>
				{ props.text }
			</span>
			
			<input
				ref={inputRef}
				// set the width to the input length multiplied by the x height
				// it's not quite right but gets it close
				style={{ width: Math.ceil(inputValue.length * 0.9) + "ex" }}
				value={inputValue}
				onChange={e => {
					setInputValue(e.target.value);
				}}
				className={`inline-text_input inline-text_input--${
					isInputActive ? "active" : "hidden"
				}`}
			/>
		</span>
	);
}

export default InlineEdit;