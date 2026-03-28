import React from 'react';
import { useAuth } from '../../contexto/conAutenticacion';
import { Link, useLocation } from 'wouter';
import './SideBar.css';

const ITEMS_ADMIN = [
    { name: 'Inicio', path: '/admin/inicio', icon: 'fas fa-home' },
    { name: 'Cursos', path: '/admin/cursos', icon: 'fas fa-graduation-cap' },
    { name: 'Usuarios', path: '/admin/usuarios', icon: 'fas fa-users' },
];

const ITEMS_COORDINADOR = [
    { name: 'Inicio', path: '/coordinador/inicio', icon: 'fas fa-home' },
];

const ITEMS_PROFESOR = [
    { name: 'Inicio', path: '/profesor/inicio', icon: 'fas fa-home' },
];


const SideBar = () => {
    const { user, logout } = useAuth();
    const [location, setLocation] = useLocation();

    let navItemsToRender = [];
    if (user) {
        const rol = user.rol;
        if (rol === 'admin') {
            navItemsToRender = ITEMS_ADMIN;
        } else if (rol === 'coordinador') {
            navItemsToRender = ITEMS_COORDINADOR;
        } else if (rol === 'profesor') {
            navItemsToRender = ITEMS_PROFESOR;
        }
    }

    const handleLogout = () => {
        logout();
        setLocation('/');
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
                        <Link
                            to={item.path}
                            className={location.startsWith(item.path) ? 'sidebar-link active' : 'sidebar-link'}
                        >
                            <i className={item.icon}></i> 
                            <span>{item.name}</span>
                        </Link>
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
