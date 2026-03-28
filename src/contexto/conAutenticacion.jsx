/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

const defaultUser = {
    id: null,
    rol: null,
    nombre: null,
    apellido: null,
    titulo: null
};
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(defaultUser);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    const [token, setToken] = useState('');

    const login = (userData) => {
        localStorage.setItem('authToken', userData.token);
        localStorage.setItem('id', userData.user.id);   
        localStorage.setItem('rol', userData.user.rol);
        localStorage.setItem('nombre', userData.user.nombre);
        localStorage.setItem('apellido', userData.user.apellido);
        setToken(userData.token);

        setUser({
            id: userData.user.id,
            rol: userData.user.rol,
            nombre: userData.user.nombre,
            apellido: userData.user.apellido,
            titulo: userData.user.rol 
        });
        setIsAuthenticated(true);
    };

    const logout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('rol');
        localStorage.removeItem('nombre');
        localStorage.removeItem('apellido');
        setUser(defaultUser);
        setIsAuthenticated(false);
    };

    const validateToken = useCallback(async () => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            setIsCheckingAuth(false);
            return;
        }

        try {
            const decoded = jwtDecode(token);
            const data = decoded?.data || {};
            const nombreCompleto = data.usuario || '';
            const partes = nombreCompleto.trim().split(' ');
            const nombre = partes.shift() || '';
            const apellido = partes.join(' ').trim();

            setToken(token);
            setUser({
                id: data.id ?? null,
                rol: data.rol ?? null,
                nombre,
                apellido,
                titulo: data.rol ?? null
            });
            setIsAuthenticated(true);
        } catch (error) {
            console.error("Error al decodificar el token:", error);
            localStorage.removeItem('authToken');
            logout();
        }
        setIsCheckingAuth(false);
    }, []);

    useEffect(() => {
        validateToken();
    }, [validateToken]);

    if (isCheckingAuth) {
        return <div style={{ padding: '20px', textAlign: 'center' }}>Verificando sesión...</div>;
    }

    return (
        <AuthContext.Provider value={{ user, token, isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
