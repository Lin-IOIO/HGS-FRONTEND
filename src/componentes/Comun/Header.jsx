import React from 'react';
import { useAuth } from '../../contexto/conAutenticacion'; // Importar el hook de contexto
import './Header.css'; // Asume que tienes un archivo CSS para estilos

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
            <div className="header-welcome-message">
                <h1>{getSaludo()}</h1>
            </div>
        </header>
    );
};

export default Header;