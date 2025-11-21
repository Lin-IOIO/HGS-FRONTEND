import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Boton from '../../componentes/UI/Boton'; // Tu componente Boton
import './GestionUsuarios.css'; // Estilos nuevos

// Datos simulados basados en tu imagen
const usuariosSimulados = [
    { id: 1, nombre: 'Juliana Esquivero Vargas', dni: '47588663', email: 'juliesquiv@gmail.com', rol: 'Profesor/a' },
    { id: 2, nombre: 'Juliana Esquivero Vargas', dni: '47588663', email: 'juliesquiv@gmail.com', rol: 'Profesor/a' },
    { id: 3, nombre: 'Juliana Esquivero Vargas', dni: '47588663', email: 'juliesquiv@gmail.com', rol: 'Profesor/a' },
    { id: 4, nombre: 'Juliana Esquivero Vargas', dni: '47588663', email: 'juliesquiv@gmail.com', rol: 'Profesor/a' },
    { id: 5, nombre: 'Juliana Esquivero Vargas', dni: '47588663', email: 'juliesquiv@gmail.com', rol: 'Profesor/a' },
    { id: 6, nombre: 'Juliana Esquivero Vargas', dni: '47588663', email: 'juliesquiv@gmail.com', rol: 'Profesor/a' },
];

const GestionUsuarios = () => {
    const navigate = useNavigate();
    const [busqueda, setBusqueda] = useState('');

    const handleAgregarUsuario = () => {
        // Esta ruta nos llevará al formulario
        navigate('/admin/usuarios/crear');
    };

    return (
        <div className="gestion-usuarios-container">
            <h1 className="titulo-usuarios">Lista de Usuarios</h1>
            
            {/* Barra de Búsqueda */}
            <div className="barra-busqueda-container">
                <div className="input-wrapper">
                   <span className="search-placeholder">Buscar</span>
                   <i className="fas fa-search search-icon"></i>
                   {/* Aquí iría un input real, por ahora simulamos el estilo visual */}
                   <input 
                        type="text" 
                        className="input-busqueda-oculto" 
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                    />
                </div>
            </div>

            <hr className="divisor-usuarios" />

            {/* Grid de Tarjetas */}
            <div className="usuarios-grid">
                {usuariosSimulados.map((usuario, index) => (
                    <div key={index} className="usuario-card">
                        <p className="usuario-rol">{usuario.rol}</p>
                        <h3 className="usuario-nombre">{usuario.nombre}</h3>
                        <p className="usuario-dato">DNI: {usuario.dni}</p>
                        <p className="usuario-dato">Email: {usuario.email}</p>
                        
                        <div className="card-actions">
                            <button className="btn-editar-usuario">Editar</button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Botón Agregar (Al final y centrado) */}
            <div className="footer-actions">
                <Boton 
                    onClick={handleAgregarUsuario} 
                    className="btn-agregar-usuario-grande"
                >
                    Agregar usuario
                </Boton>
            </div>
        </div>
    );
};

export default GestionUsuarios;