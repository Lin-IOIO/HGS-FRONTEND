import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

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

    const API_VALIDATE_TOKEN_URL = 'http://localhost:5000/api/middleware/verificarToken';

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

    const validateToken = async () => {
        const token = localStorage.getItem('authToken');
        if (token) {
            try {
                const response = await axios.get(API_VALIDATE_TOKEN_URL, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (response.status >= 200 && response.status < 300) {
                    setUser({
                        id: response.data.user.id,
                        rol: response.data.user.rol,
                        nombre: response.data.user.nombre,
                        apellido: response.data.user.apellido,
                        titulo: response.data.user.rol
                    });
                    setIsAuthenticated(true);
                } else {
                    localStorage.removeItem('authToken');
                    logout();
                }
            } catch (error) {
                console.error("Error al validar el token:", error);
                localStorage.removeItem('authToken');
                logout();
            }
        }
        setIsCheckingAuth(false);
    };

    useEffect(() => {
        validateToken();
    }, []);

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