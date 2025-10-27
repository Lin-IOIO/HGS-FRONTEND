import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { NavLink } from 'react-router-dom'; 
import './BarraLateral.css';

// Estructura de navegación basada en la imagen (para el rol de Admin/Secretario)
const navItems = [
    { name: 'Inicio', path: '/inicio', icon: 'fas fa-home' },
    { name: 'Cursos', path: '/cursos', icon: 'fas fa-graduation-cap' },
    { name: 'Usuarios', path: '/usuarios', icon: 'fas fa-users' }, // Para GestionUsuarios
];

const SideBar = () => {
    const { user } = useAuth();
    
    // Aquí podrías agregar lógica para cambiar 'navItems' basado en user.rol
    // Por ejemplo: if (user.rol === 'Profesor') { usar otro array de enlaces }

    return (
        <nav className="sidebar">
            <ul className="sidebar-menu">
                {navItems.map((item) => (
                    <li key={item.name} className="sidebar-item">
                        <NavLink 
                            to={item.path} 
                            className={({ isActive }) => 
                                isActive ? 'sidebar-link active' : 'sidebar-link'
                            }
                        >
                            <i className={item.icon}></i> 
                            <span>{item.name}</span>
                        </NavLink>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default SideBar;