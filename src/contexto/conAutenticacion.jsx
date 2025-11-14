import { createContext, useContext, useState } from 'react';

// 1. Crear el objeto Contexto
const AuthContext = createContext();

const initialUserData = {
    rol: 'Coordinador', // 'Administrador', 'Coordinador', 'Profesor'
    nombre: 'José Román',
    apellido: 'Giaccomo',
    titulo: 'Coordinador'
};

// 2. Crear el Proveedor (Provider)
export const AuthProvider = ({ children }) => {
    // Usaremos un estado simulado para el ejemplo de inicio
    const [user, setUser] = useState(initialUserData);
    const [isAuthenticated, setIsAuthenticated] = useState(true);

    // Función que se llamaría desde PantallaLogin
    const login = (userData) => {
        setUser(userData);
        setIsAuthenticated(true);
    };

    const logout = () => {
        setUser(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// 3. Crear un Hook para consumir el contexto fácilmente
export const useAuth = () => {
    return useContext(AuthContext);
};