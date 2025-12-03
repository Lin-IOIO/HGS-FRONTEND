import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '../../contexto/conAutenticacion'; 
import Boton from '../../componentes/UI/Boton';
import './LoginPage.css';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const API_LOGIN_URL = 'http://localhost:5000/api/login'; 

const loginUser = async (dni, password) => {
    try {
        const body = { documento: dni, password };
        const response = await axios.post(API_LOGIN_URL, body, {
            headers: { 'Content-Type': 'application/json' }
        });

        if (response.status === 200) {
            return response.data; // Devuelve los datos del usuario y el token
        } else {
            throw new Error('Error al iniciar sesión');
        }
    } catch (error) {
        console.error("Error en la llamada a la API:", error);
        throw error; // Re-lanza el error para que el componente lo maneje
    }
};

const ROLE_REDIRECTS = {
    'coordinador': '/coordinador/inicio',
    'docente': '/docente/inicio',
    'admin': '/admin/inicio',
};

export default function LoginPage() {
    const [dni, setDni] = useState('coordinador@test.com');
    const [password, setPassword] = useState('password123');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [, navigate] = useLocation();

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const data = await loginUser(dni, password); 
            const token = data.token;
            const decode = jwtDecode(token)
            console.log(decode)
            const rol = decode.data.rol;
            localStorage.setItem('authToken', token);
            localStorage.setItem('rol', rol);

            const redirectPath = ROLE_REDIRECTS[rol];

            if (redirectPath) {
                navigate(redirectPath);
            } else {
                setError(`Rol de usuario no reconocido: ${rol}`);
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

           
            <div className="left-section">
                <div className="brand-content">
                    <h1 className="brand-logo">LOGO</h1>
                    <p className="brand-subtitle">Learning system</p>
                </div>
            </div>

            
            <div className="right-section">
                <div className="login-card">
                    <h2 className="form-title">Iniciar Sesión</h2>

                    <form onSubmit={handleLogin}>
                        <div className="input-group">
                            <label htmlFor="dni">DNI</label>
                            <input
                                id="dni"
                                type="number"
                                placeholder="Ingrese su DNI - Sin puntos"
                                value={dni}
                                onChange={(e) => setDni(e.target.value)}
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
}