import React from 'react';
import { useAuth } from '../../contexto/conAutenticacion';
import { NavLink } from 'react-router-dom'; 
import './SideBar.css';

// (Tus constantes ITEMS_ADMIN e ITEMS_COORDINADOR siguen aquí igual que antes...)
const ITEMS_ADMIN = [
    { name: 'Inicio', path: '/admin/inicio', icon: 'fas fa-home' },
    { name: 'Cursos', path: '/admin/cursos', icon: 'fas fa-graduation-cap' },
    { name: 'Usuarios', path: '/admin/usuarios', icon: 'fas fa-users' },
];

const ITEMS_COORDINADOR = [
    { name: 'Inicio', path: '/coordinador/inicio', icon: 'fas fa-home' },
];


const SideBar = () => {
    const { user } = useAuth();

    // Lógica de selección de menú (igual que antes)
    let navItemsToRender = [];
    if (user) {
        const rol = user.rol.toLowerCase();
        if (rol === 'admin' || rol === 'secretario') {
            navItemsToRender = ITEMS_ADMIN;
        } else if (rol === 'coordinador') {
            navItemsToRender = ITEMS_COORDINADOR;
        }
    }

    return (
        <nav className="sidebar">
            {/* --- NUEVA SECCIÓN: PERFIL --- */}
            <div className="sidebar-profile-section">
                {/* Icono grande de usuario */}
                <i className="fas fa-user-circle profile-main-icon"></i>
                {/* Línea divisoria */}
                <div className="profile-separator"></div>
            </div>

            {/* --- SECCIÓN DEL MENÚ (Ligeramente modificada) --- */}
            <ul className="sidebar-menu">
                {navItemsToRender.map((item) => (
                    <li key={item.path} className="sidebar-item">
                        <NavLink 
                            to={item.path} 
                            // Quitamos la lógica de 'active' compleja por ahora para limpiar el diseño
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