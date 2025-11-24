import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Boton from '../../componentes/UI/Boton'; // Tu componente Boton
import './GestionUsuarios.css'; // Estilos nuevos

// Datos simulados iniciales (usa un estado real para datos en una app real)
const usuariosIniciales = [
    { id: 1, nombre: 'Juliana', apellido: 'Esquivero Vargas', dni: '47588663', email: 'juliesquiv@gmail.com', rol: 'Profesor/a' },
    { id: 2, nombre: 'Juliana', apellido: 'Esquivero Vargas', dni: '47588663', email: 'juliesquiv@gmail.com', rol: 'Profesor/a' },
    { id: 3, nombre: 'Juliana', apellido: 'Esquivero Vargas', dni: '47588663', email: 'juliesquiv@gmail.com', rol: 'Profesor/a' },
    { id: 4, nombre: 'Juliana', apellido: 'Esquivero Vargas', dni: '47588663', email: 'juliesquiv@gmail.com', rol: 'Profesor/a' },
    { id: 5, nombre: 'Juliana', apellido: 'Esquivero Vargas', dni: '47588663', email: 'juliesquiv@gmail.com', rol: 'Profesor/a' },
    { id: 6, nombre: 'Juliana', apellido: 'Esquivero Vargas', dni: '47588663', email: 'juliesquiv@gmail.com', rol: 'Profesor/a' },
];

const GestionUsuarios = () => {
    const navigate = useNavigate();
    const [busqueda, setBusqueda] = useState('');
    // Estado para gestionar la lista de usuarios
    const [usuarios, setUsuarios] = useState(usuariosIniciales);
    // Estado para el modal de confirmación
    const [modalAbierto, setModalAbierto] = useState(false);
    // Estado para saber qué usuario se va a eliminar
    const [usuarioAEliminar, setUsuarioAEliminar] = useState(null);
    // Estado para el mensaje de éxito
    const [mensajeExito, setMensajeExito] = useState(false);


    // 1. Maneja la apertura del modal al presionar "Eliminar"
    const handleMostrarConfirmacion = (usuario) => {
        setUsuarioAEliminar(usuario);
        setModalAbierto(true);
    };

    // 2. Maneja la acción de eliminación (al confirmar en el modal)
    const handleConfirmarEliminacion = () => {
        // Lógica de eliminación: En una app real, aquí llamarías a una API
        console.log(`Eliminando usuario con ID: ${usuarioAEliminar.id}`);
        
        // Simulación: Filtra la lista para quitar el usuario
        const nuevaLista = usuarios.filter(u => u.id !== usuarioAEliminar.id);
        setUsuarios(nuevaLista);

        // Ocultar modal y mostrar mensaje de éxito
        setModalAbierto(false);
        setUsuarioAEliminar(null);
        setMensajeExito(true);

        // Ocultar el mensaje de éxito después de 3 segundos
        setTimeout(() => {
            setMensajeExito(false);
            // Opcional: Redirigir o recargar si fuera necesario, 
            // pero ya se actualizó la lista en el estado 'usuarios'.
        }, 3000);
    };

    // 3. Maneja la cancelación (al cancelar en el modal o cerrarlo)
    const handleCancelarEliminacion = () => {
        setModalAbierto(false);
        setUsuarioAEliminar(null);
    };

    // Funciones existentes
    const handleAgregarUsuario = () => {
        navigate('/admin/usuarios/crear');
    };

    const handleEditarUsuario = (usuario) => {
        navigate('/admin/usuarios/editar', { state: { usuarioAEditar: usuario } });
    };

    const usuariosFiltrados = usuarios.filter(usuario => 
        (usuario.nombre.toLowerCase() + ' ' + usuario.apellido.toLowerCase()).includes(busqueda.toLowerCase()) ||
        usuario.dni.includes(busqueda) ||
        usuario.email.toLowerCase().includes(busqueda.toLowerCase())
    );

    return (
        <div className="gestion-usuarios-container">
            {/* Mensaje de Éxito */}
            {mensajeExito && (
                <div className="alerta-exito">
                    ✅ ¡Usuario **{usuarioAEliminar?.nombre}** eliminado con éxito! 
                </div>
            )}
            
            <h1 className="titulo-usuarios">Lista de Usuarios</h1>
            
            {/* Barra de Búsqueda (código omitido por brevedad, es el mismo) */}
            <div className="barra-busqueda-container">
                <div className="input-wrapper">
                    <span className="search-placeholder">Buscar</span>
                    <i className="fas fa-search search-icon"></i>
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
                {usuariosFiltrados.map((usuario) => (
                    <div key={usuario.id} className="usuario-card">
                        <p className="usuario-rol">{usuario.rol}</p>
                        {/* Se muestra el nombre completo */}
                        <h3 className="usuario-nombre">{usuario.nombre} {usuario.apellido}</h3>
                        <p className="usuario-dato">DNI: {usuario.dni}</p>
                        <p className="usuario-dato">Email: {usuario.email}</p>
                        
                        <div className="card-actions">
                            <button 
                                className="btn-editar-usuario"
                                onClick={() => handleEditarUsuario(usuario)}
                            >Editar</button>
                            {/* NUEVO BOTÓN ELIMINAR */}
                            <button 
                                className="btn-eliminar-usuario"
                                onClick={() => handleMostrarConfirmacion(usuario)}
                            >Eliminar</button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Botón Agregar (Al final y centrado) (código omitido por brevedad, es el mismo) */}
            <div className="footer-actions">
                <Boton 
                    onClick={handleAgregarUsuario} 
                    className="btn-agregar-usuario-grande"
                >
                    Agregar usuario
                </Boton>
            </div>

            {/* Modal de Confirmación */}
            {modalAbierto && (
                <div className="modal-backdrop">
                    <div className="modal-content">
                        <h3>Confirmar Eliminación</h3>
                        <p>¿Estás seguro de que deseas eliminar al usuario {usuarioAEliminar?.nombre} {usuarioAEliminar?.apellido}?</p>
                        <div className="modal-actions">
                            <button 
                                className="btn-modal-cancelar"
                                onClick={handleCancelarEliminacion}
                            >Cancelar</button>
                            <button 
                                className="btn-modal-confirmar"
                                onClick={handleConfirmarEliminacion}
                            >Confirmar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GestionUsuarios;