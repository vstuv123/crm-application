import { createContext, useContext, useState } from 'react';

// eslint-disable-next-line
export const userContext = createContext();

// eslint-disable-next-line
const UserProvider = ({ children }) => {
    const [auth, setAuth] = useState({user: null, token: null});
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const value = {
        auth,
        setAuth,
        isAuthenticated,
        setIsAuthenticated,
        loading,
        setLoading
    }

    return (
        <userContext.Provider value={value}>
            { children }
        </userContext.Provider>
    )
}

// eslint-disable-next-line
export const useAuth = () => useContext(userContext);
export default UserProvider;
