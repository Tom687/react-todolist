import axios from 'axios';
import { useAuth } from '../../contexts/auth';

export default function RoleSwitch() {
	const { currentUser, setCurrentUser } = useAuth();
	
	const accessToken = window.localStorage.getItem('accessToken');
	const baseURL =
		      process.env.NODE_ENV === 'production'
		      ? '/api'
		      : 'http://localhost:1337/';
	
	axios.defaults.baseURL = baseURL; //`http://localhost:1337/`;
	axios.defaults.headers = {
		authorization: `Bearer ${accessToken}`,
	};
	
	async function login(email, password) {
		try {
			const res = await axios.post(`auth/login`, {
				email,
				password,
			});
			
			if (res.status === 200 || res.data.status === 'success') {
				if (
					res.data.user.id && res.data.user.email
					&& res.data.accessToken
				) {
					window.localStorage.setItem('accessToken', res.data.accessToken);
					window.localStorage.setItem('user', JSON.stringify(res.data.user));
					
					setCurrentUser({
						...res.data.user,
						accessToken: res.data.accessToken
					});
				}
			}
		}
		catch (err) {
			console.error('err logAsUser', err);
		}
	}
	
	async function logAsRole(role) {
		let email, password;
		
		if (role === 'admin' || role === 'super-admin') {
			email = 'tom.pomarede687@gmail.com';
			password = 'aaa';
		}
		else if (role === 'user') {
			email = 'guio@gmail.com';
			password = 'aaa';
		}
		
		try {
			await login(email, password);
		}
		catch (err) {
			console.error('err logAsUser', err);
		}
	}
	
	async function logAsId(e) {
		const id = e.target.value;
		let email, password;
		
		if (id === '1') {
			email = 'tom.pomarede687@gmail.com';
			password = 'aaa';
		}
		if (id === '2') {
			email = 'a@a.a';
			password = 'aaa';
		}
		if (id === '3') {
			email = 'guio@gmail.com';
			password = 'aaa';
		}
		if (id === '4') {
			email = 't@t.t';
			password = 'aaa';
		}
		
		try {
			await login(email, password);
		}
		catch (err) {
			console.error('err logAsUser', err);
		}
	}
	
	
	return (
		<>
			{
				currentUser
					&& <h2>Salut { currentUser.email } - { currentUser.id }</h2>
			}
			<div>
				<button
					onClick={() => logAsRole('user')}
					type="button"
					className="button"
				>Log as User
				</button>
				<button
					type="button"
					onClick={ () => logAsRole('admin') }
					className="button"
				>Log as Admin
				</button>
				<select
					onChange={(e) => logAsId(e)}
				>
					<option value="1">1</option>
					<option value="2">2</option>
					<option value="3">3</option>
					<option value="4">4</option>
					<option value="5">5</option>
				</select>
			</div>
		</>
	)
}