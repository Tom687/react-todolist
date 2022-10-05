import { createContext, useContext, useState } from 'react';

// https://fatmali.medium.com/use-context-and-custom-hooks-to-share-user-state-across-your-react-app-ad7476baaf32 => TODO Celui là
const AuthContext = createContext({
	currentUser: null,
	setCurrentUser: () => {}
});

export const AuthProvider = ({ user, children }) => {
	const [currentUser, setCurrentUser] = useState(user);
	
	return (
		<AuthContext.Provider value={{ currentUser, setCurrentUser }}>
			{ children }
		</AuthContext.Provider>
	)
}

export const useAuth = () => useContext(AuthContext);