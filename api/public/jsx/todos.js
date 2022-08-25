import axios from 'axios';
import { showAlert } from './alerts';

export const insertTodo = async (title) => {
	try {
		const res = await axios.post('http://localhost:3000/todos', {
			title,
			// TODO : createdOn ici ?
		});
		
		if (res.data.status === 'success' || res.status === 200) { // TODO : Un ou l'autre ou les 2 ?
			showAlert('success', 'Todo ajouté avec succès !');
			
			/*window.setTimeout(() => {
				location.assign('/todos');
			}, 2000);*/
		}
	}
	catch (err) {
		// FIXME : err.response.data.message n'existe pas. Juste err.response.data (qui est du HTML)
		console.log('ERR', err.response);
		if (err.response.data.message)
			showAlert('error', err.response.data.message); // TODO : Checker d'abord l'existance de err.res.data.msg ?
		else
			showAlert('error', 'ERREUR TODO');
	}
};