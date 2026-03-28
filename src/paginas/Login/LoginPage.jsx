import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexto/conAutenticacion';
import './LoginPage.css';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const API_LOGIN_URL = 'http://localhost:5000/api/login';

const loginUser = async (dni, password) => {
    try {
        const body = { DNI: dni, contrasena: password };
        const response = await axios.post(API_LOGIN_URL, body, {
            headers: { 'Content-Type': 'application/json' }
        });
        return response.data;
    } catch (error) {
        console.error("Error en la llamada a la API:", error);
        throw error;
    }
};

// CORREGIDO: todas las claves en minúscula, consistente con el resto del sistema
const ROLE_REDIRECTS = {
    'coordinador': '/coordinador/inicio',
    'profesor': '/profesor/inicio',
    'admin': '/admin/inicio',
};

export default function LoginPage() {
    const [dni, setDni] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const data = await loginUser(dni, password);
            const token = data.token;
            const decode = jwtDecode(token);
            const rol = decode.data.rol;
            const id = decode.data.id;
            const nombreCompleto = decode.data.usuario || '';
            const partes = nombreCompleto.trim().split(' ');
            const nombre = partes.shift() || '';
            const apellido = partes.join(' ').trim();
            const titulo = rol;

            // CORREGIDO: login() en conAutenticacion ya maneja el localStorage internamente,
            // no hace falta duplicar los setItem aquí
            login({
                token,
                user: { id, rol, nombre, apellido, titulo }
            });

            const redirectPath = ROLE_REDIRECTS[rol];

            if (redirectPath) {
                navigate(redirectPath);
            } else {
                setError(`Rol de usuario no reconocido: ${rol}`);
            }

        } catch (err) {
            console.error("Error de inicio de sesión:", err);
            setError(err.response?.data?.message || 'Error al iniciar sesión. Verifique sus credenciales.');
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
