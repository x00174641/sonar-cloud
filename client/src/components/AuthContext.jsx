import React, { createContext, useState, useContext, useEffect } from 'react';
import useJwtDecode from '../hooks/TokenDecoder';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const token = localStorage.getItem('accessToken');
    const decodedToken = useJwtDecode(token);

    useEffect(() => {
        if (decodedToken) {
            const currentTime = Date.now() / 1000;
            if (decodedToken.exp > currentTime) {
                setIsAuthenticated(true);
            } else {
                setIsAuthenticated(false);
                localStorage.removeItem('accessToken');
            }
        } else {
            setIsAuthenticated(false);
        }
    }, [decodedToken]);

    return (
        <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
};
