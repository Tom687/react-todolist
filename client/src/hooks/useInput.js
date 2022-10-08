import { useState } from 'react';

export default function useInput(initialValue) {
	const [value, setValue] = useState(initialValue);
	
	const handleChange = (e) => {
		//if (e.target && e.target.value) {
		//	setValue(e.target.value);
		//}
		//else {
			setValue(e.target ? e.target.value : e)
		//}
	}
	
	return {
		value,
		onChange: handleChange,
	};
}