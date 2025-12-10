import React from 'react';
import { useAuth } from '../../contexto/conAutenticacion';
import { NavLink, useNavigate } from 'react-router-dom'; 
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
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    let navItemsToRender = [];
    if (user) {
        const rol = user.rol;
        if (rol === 'admin' || rol === 'secretario') {
            navItemsToRender = ITEMS_ADMIN;
        } else if (rol === 'coordinador') {
            navItemsToRender = ITEMS_COORDINADOR;
        }
    }

    const handleLogout = () => {
        logout();
        navigate('/');
    }
    return (
        <nav className="sidebar">
            <div className="sidebar-profile-section">
                <i className="fas fa-user-circle profile-main-icon"></i>
                <div className="profile-separator"></div>
            </div>
            <ul className="sidebar-menu">
                {navItemsToRender.map((item) => (
                    <li key={item.path} className="sidebar-item">
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
                <li className="sidebar-item logout-item">
                    <span
                        onClick={handleLogout} 
                        className="sidebar-link" 
                    >
                        <i className="fas fa-sign-out-alt"></i>
                        <span>Cerrar Sesión</span>
                    </span>
                </li>
            </ul>
        </nav>
    );
};

export default SideBar;