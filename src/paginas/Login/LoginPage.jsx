import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../contexto/conAutenticacion'; // Importar useAuth
import Input from '../../componentes/UI/Input';
import Boton from '../../componentes/UI/Boton';
import './LoginPage.css';

const API_BASE_URL = 'http://tu-backend.com/api'; 

const simularLoginAPI = async (email, password) => {
    // Aquí es donde harías tu llamada con Axios:
    // const response = await axios.post(`${API_BASE_URL}/login`, { email, password });
    
    // --- Lógica simulada de tu API para fines de demostración ---
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (email === 'coordinador@test.com' && password === 'password123') {
        return { 
            success: true, 
            token: 'jwt-coordinador-token-12345',
            // NUEVO: Añadimos un campo de nombre completo para el contexto
            user: { role: 'coordinador', nombre: 'José Román', apellido: 'Giaccomo' } 
        };
    }
    
    if (email === 'docente@test.com' && password === 'password123') {
        return { 
            success: true, 
            token: 'jwt-docente-token-54321',
            user: { role: 'docente', nombre: 'Ana María', apellido: 'Pérez' }
        };
    }

    if (email === 'admin@test.com' && password === 'password123') {
        return { 
            success: true, 
            token: 'jwt-admin-token-98765',
            user: { role: 'admin', nombre: 'Administrador', apellido: 'Sistema' }
        };
    }

    // Falla de autenticación
    throw new Error('Credenciales inválidas');
};
// --------------------------------------------------------


// --- Mapeo de Roles y Redirecciones ---
const ROLE_REDIRECTS = {
    'coordinador': '/coordinador/inicio', 
    'docente': '/docente/inicio',      
    'admin': '/admin/inicio',             
};

const LoginPage = () => {
    const [email, setEmail] = useState('coordinador@test.com'); 
    const [password, setPassword] = useState('password123'); 
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    // NUEVO: Usar el hook de autenticación
    const { login } = useAuth(); 

    const handleLogin = async (e) => {
        e.preventDefault();
        
        setIsLoading(true);
        setError('');

        try {
            // 1. Llamada a tu API de Backend
            const response = await simularLoginAPI(email, password);
            
            const role = response.user.role;
            const token = response.token; 
            
            // 2. Guardar el token 
            localStorage.setItem('authToken', token);

            // 3. **CLAVE: Llama a la función 'login' del contexto**
            // Se transforma el rol a mayúscula inicial para coincidir con el Contexto/RutaProtegida
            const roleForContext = role.charAt(0).toUpperCase() + role.slice(1);

            // Le pasamos el rol y el nombre/apellido del usuario al contexto
            login({ 
                rol: roleForContext, 
                nombre: response.user.nombre,
                apellido: response.user.apellido,
            }); 
            
            // 4. Redireccionar basado en el rol (usando el rol en minúsculas)
            const redirectPath = ROLE_REDIRECTS[role];

            if (redirectPath) {
                navigate(redirectPath);
            } else {
                setError(`Rol de usuario no reconocido: ${role}`);
                localStorage.removeItem('authToken'); 
            }

        } catch (err) {
            console.error("Error de inicio de sesión:", err);
            setError(err.message || 'Error desconocido al iniciar sesión.');

        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-container">
            {/* Barra lateral azul oscura (Diseño de la izquierda) */}
            <div className="sidebar-brand">
                <div className="logo-section">
                    <span className="logo-text-main">LOGO</span>
                    <span className="logo-text-sub">Learning system</span>
                </div>
            </div>

            {/* Contenedor del formulario (Diseño de la derecha) */}
            <div className="login-form-wrapper">
                <div className="login-card">
                    <h1 className="login-title">Iniciar Sesión</h1>
                    
                    <form onSubmit={handleLogin} className="login-form">
                        
                        {/* Campo de Email */}
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input 
                                id="email" 
                                type="email"
                                placeholder="Email (coordinador@test.com)"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        {/* Campo de Contraseña */}
                        <div className="form-group">
                            <label htmlFor="password">Contraseña</label>
                            <input 
                                id="password" 
                                type="password"
                                placeholder="Contraseña (password123)"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <a href="#" className="forgot-password">Recuperar contraseña</a>
                        </div>
                        
                        {/* Mensaje de Error */}
                        {error && <p className="error-message">{error}</p>}

                        {/* Botón de Inicio de Sesión */}
                        <button 
                            type="submit" 
                            className="btn-login" 
                            disabled={isLoading}
                        >
                            {isLoading ? 'Cargando...' : 'Iniciar Sesión'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;