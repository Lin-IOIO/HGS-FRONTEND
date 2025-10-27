import React from 'react';
import { useAuth } from '../../context/AuthContext'; // Importar el hook de contexto
import './header.css'; // Asume que tienes un archivo CSS para estilos

const Header = () => {
    // Obtener la información del usuario del contexto
    const { user } = useAuth();

    // Lógica para formatear el saludo
    const getSaludo = () => {
        if (!user) return "Hola, Invitado";
        
        const { titulo, nombre, apellido } = user;
        
        // El formato deseado: "Hola, Secretario/a José Román Giaccomo"
        return `Hola, ${titulo} ${nombre} ${apellido}`;
    };

    return (
        <header className="header">
            <div className="header-brand-logo">
                {/* Ícono de la aplicación o logo */}
                <i className="fas fa-school"></i> 
            </div>
            <div className="header-welcome-message">
                <h1>{getSaludo()}</h1>
            </div>
            {/* Opcional: Aquí podrías poner un botón de Cerrar Sesión */}
        </header>
    );
};

export default Header;