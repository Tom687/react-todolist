import React, { useState } from 'react';

import './assets/reset.css';
import './assets/general.css';

import './features/TodoList/todos.css';
import AddTodoForm from './features/TodoList/TodoList/AddTodoForm';
import TodoList from './features/TodoList/TodoList/TodoList';
import Footer from './features/TodoList/Filter/Footer';
//import InlineEdit from './components/InlineEdit/InlineEdit';
import axios from 'axios';
import RoleSwitch from './components/auth/roleSwitch';

function App() {
	
	const [storedHeading, setStoredHeading] = useState(
		"Click here to start editing the text!"
	);
	const [storedText, setStoredText] = useState("Here's some more, edit away!");
	
	const logout = async () => {
		const res = await axios.get('/logout');
		console.log('logout res', res);
		setTimeout(() => window.location.replace("http://localhost:3000/connexion"), 5000);
	};
	
	return (
		/*<Grid />*/
		<>
			{/*<Header/>
			 <Cards/>
			 <Accordion
			 title="1er volet"
			 >
			 <p>Ceci est le 1er paragraphe de l'accordion. Il parle du Lion que voici :</p>
			 <p>Le Lion est un spécimène très rare et recherché de nos jours. On l'aime pour ses poils doux et velus.</p>
			 </Accordion>
			 <div className="todos">
			 <AddTodoForm/>
			 <TodoList/>
			 <Footer/>
			 </div>*/}
			<div className="todos">
				{/*<h2>
					 Not editable right here.{" "}
					<InlineEdit
						text={storedHeading}
						onSetText={text => setStoredHeading(text)}
					/>
				</h2>
				<p>
					<InlineEdit text={storedText} onSetText={text => setStoredText(text)} />
				</p>*/}
				<button onClick={() => logout()}>Logout</button>
				<RoleSwitch />
				<AddTodoForm/>
				<TodoList/>
				<Footer/>
			</div>
		</>
	);
}

export default App;