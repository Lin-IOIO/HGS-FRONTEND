import React from 'react';
import { useAuth } from '../../contexto/conAutenticacion'; 
import './Header.css'; 

const Header = () => {
    const { user } = useAuth();
    const getSaludo = () => {
        if (!user) return "Hola, Invitado";
        
        const { titulo, nombre, apellido } = user;
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