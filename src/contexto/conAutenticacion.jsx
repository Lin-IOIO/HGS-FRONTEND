import { createContext, useContext, useState, useEffect } from 'react';

// 1. Crear el objeto Contexto
const AuthContext = createContext();

const initialUserData = {
    rol: null, 
    nombre: null,
    apellido: null,
    titulo: null
};

// 2. Crear el Proveedor (Provider)
export const AuthProvider = ({ children }) => {
    // CAMBIO 1: Inicialización como NO autenticado.
    const [user, setUser] = useState(initialUserData);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    // NUEVO: Estado para manejar la carga inicial mientras se comprueba el token.
    const [isCheckingAuth, setIsCheckingAuth] = useState(true); 

    // CAMBIO 2: La función login recibe los datos del API.
    const login = (userData) => {
        // Mapea los datos del login a la estructura de tu contexto
        const role = userData.rol;
        const nombreCompleto = userData.nombre;

        setUser({
            rol: role, // 'Coordinador', 'Docente', etc.
            nombre: nombreCompleto.split(' ')[0], // Solo el primer nombre
            apellido: nombreCompleto.split(' ').slice(1).join(' '),
            titulo: role
        });
        setIsAuthenticated(true);
    };

    const logout = () => {
        // CAMBIO 3: Limpiar localStorage al cerrar sesión.
        localStorage.removeItem('authToken'); 
        setUser(initialUserData);
        setIsAuthenticated(false);
    };

    // NUEVO: Hook para verificar si existe un token al cargar la app
    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            // **NOTA IMPORTANTE:** En una aplicación real, harías una
            // llamada a la API aquí para validar el token y obtener los datos 
            // del usuario (`setUser(...)`) antes de poner `true`.
            // Por simplicidad, solo ponemos isAuthenticated en true si hay un token.
            // Para que la prueba con las rutas funcione, el usuario ya debería 
            // haber guardado un token y tener sus datos al loguear.
            setIsAuthenticated(true);
        }
        setIsCheckingAuth(false);
    }, []);

    // NUEVO: Pantalla de carga mientras se verifica el token
    if (isCheckingAuth) {
        return <div style={{padding: '20px', textAlign: 'center'}}>Verificando sesión...</div>; 
    }

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