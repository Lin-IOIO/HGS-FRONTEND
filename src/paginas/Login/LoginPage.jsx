import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexto/conAutenticacion'; // Asegúrate que la ruta sea correcta
import Boton from '../../componentes/UI/Boton';
import './LoginPage.css';

// --- Configuración de Simulación ---
const simularLoginAPI = async (email, password) => {
    // Simulación de espera de red
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (email === 'coordinador@test.com' && password === 'password123') {
        return { 
            success: true, 
            token: 'jwt-coordinador-token-12345',
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

    throw new Error('Credenciales inválidas');
};

const ROLE_REDIRECTS = {
    'coordinador': '/coordinador/inicio', 
    'docente': '/docente/inicio',      
    'admin': '/admin/inicio',             
};

// --- Componente Principal ---
const LoginPage = () => {
    const [email, setEmail] = useState('coordinador@test.com'); 
    const [password, setPassword] = useState('password123'); 
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth(); 

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await simularLoginAPI(email, password);
            const role = response.user.role;
            const token = response.token; 
            
            localStorage.setItem('authToken', token);

            const roleForContext = role.charAt(0).toUpperCase() + role.slice(1);

            login({ 
                rol: roleForContext, 
                nombre: response.user.nombre,
                apellido: response.user.apellido,
            }); 
            
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
        <div className="login-page-container">
            
            {/* SECCIÓN IZQUIERDA: LOGO */}
            <div className="left-section">
                <div className="brand-content">
                    <h1 className="brand-logo">LOGO</h1>
                    <p className="brand-subtitle">Learning system</p>
                </div>
            </div>

            {/* SECCIÓN DERECHA: FORMULARIO */}
            <div className="right-section">
                <div className="login-card">
                    <h2 className="form-title">Iniciar Sesión</h2>
                    
                    <form onSubmit={handleLogin}>
                        <div className="input-group">
                            <label htmlFor="email">Email</label>
                            <input 
                                id="email" 
                                type="email" 
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label htmlFor="password">Contraseña</label>
                            <input 
                                id="password" 
                                type="password" 
                                placeholder="Contraseña"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div className="forgot-password-container">
                            <a href="#" className="forgot-link">Recuperar contraseña</a>
                        </div>

                        {error && <div className="error-message">{error}</div>}

                        <button type="submit" className="ui-boton-principal" disabled={isLoading}>
                            {isLoading ? 'Cargando...' : 'Iniciar Sesión'}
                        </button>
                    </form>
                </div>
            </div>

        </div>
    );
};

export default LoginPage;