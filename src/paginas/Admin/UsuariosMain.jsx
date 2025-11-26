import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Boton from '../../componentes/UI/Boton'; // Tu componente Boton
import './UsuariosMain.css'; 

// URL base de la API (Ajustar según tu backend)
const API_BASE_URL = 'http://localhost:5000/api/usuarios';

const UsuariosMain = () => {
    const navigate = useNavigate();
    const [busqueda, setBusqueda] = useState('');
    const [usuarios, setUsuarios] = useState([]); // Ahora empieza vacío
    const [modalAbierto, setModalAbierto] = useState(false);
    const [usuarioAEliminar, setUsuarioAEliminar] = useState(null);
    const [mensajeExito, setMensajeExito] = useState(false);
    const [mensajeError, setMensajeError] = useState(null);
    const [isLoading, setIsLoading] = useState(true); // Estado de carga inicial

    // ===============================================
    // 1. LÓGICA DE CARGA DE DATOS (GET)
    // ===============================================

    const cargarUsuarios = async () => {
        setIsLoading(true);
        setMensajeError(null);
        const token = localStorage.getItem('authToken');

        if (!token) {
            setMensajeError("Token no encontrado. Redirigiendo al Login.");
            // Esto forzará una redirección a /login si no hay token
            navigate('/login');
            return;
        }

        try {
            const response = await axios.get(API_BASE_URL, {
                headers: {
                    Authorization: `Bearer ${token}` 
                }
            });
            // Asumiendo que response.data es el array de usuarios
            setUsuarios(response.data);
        } catch (error) {
            console.error("Error al cargar usuarios:", error);
            if (error.response && error.response.status === 401) {
                setMensajeError("Sesión expirada o no autorizada. Por favor, inicie sesión de nuevo.");
                // Limpia y redirige si hay error 401
                localStorage.clear();
                navigate('/login');
            } else {
                setMensajeError("Error de conexión al servidor. No se pudieron cargar los usuarios.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    // Efecto para cargar los usuarios al montar el componente
    useEffect(() => {
        cargarUsuarios();
    }, []); 


    // ===============================================
    // 2. LÓGICA DE ELIMINACIÓN DE DATOS (DELETE)
    // ===============================================

    const eliminarUsuarioAPI = async (idUsuario) => {
        const token = localStorage.getItem('authToken');
        setMensajeError(null); // Limpiar errores

        try {
            // Llama a la API para eliminar
            await axios.delete(`${API_BASE_URL}/${idUsuario}`, {
                headers: {
                    Authorization: `Bearer ${token}` 
                }
            });
            
            // Actualización del estado (optimista): filtra la lista localmente
            setUsuarios(prevUsuarios => prevUsuarios.filter(u => u.id !== idUsuario));

            // Muestra mensaje de éxito
            setMensajeExito(true);
            setTimeout(() => setMensajeExito(false), 3000);

        } catch (error) {
            console.error(`Fallo al eliminar el usuario ${idUsuario}:`, error);
            setMensajeError("Error al eliminar el usuario. Intente nuevamente.");
        }
    };

    // ===============================================
    // 3. HANDLERS DE LA UI (Llaman a las funciones API)
    // ===============================================

    // Maneja la acción de eliminación (al confirmar en el modal)
    const handleConfirmarEliminacion = () => {
        if (usuarioAEliminar) {
            // 💡 Aquí se usa el ID del usuario seleccionado
            eliminarUsuarioAPI(usuarioAEliminar.id); 
        }
        setModalAbierto(false);
        // Ojo: setUsuarioAEliminar(null) se maneja en eliminarUsuarioAPI
    };

    // Maneja la apertura del modal al presionar "Eliminar"
    const handleMostrarConfirmacion = (usuario) => {
        setUsuarioAEliminar(usuario);
        setModalAbierto(true);
    };

    // Maneja la cancelación (al cancelar en el modal o cerrarlo)
    const handleCancelarEliminacion = () => {
        setModalAbierto(false);
        setUsuarioAEliminar(null);
    };

    // Funciones de navegación existentes
    const handleAgregarUsuario = () => {
        navigate('/admin/usuarios/crear');
    };

    const handleEditarUsuario = (usuario) => {
        navigate('/admin/usuarios/editar', { state: { usuarioAEditar: usuario } });
    };

    // Filtro de la lista (Lógica de presentación)
    const usuariosFiltrados = usuarios.filter(usuario => 
        (usuario.nombre.toLowerCase() + ' ' + usuario.apellido.toLowerCase()).includes(busqueda.toLowerCase()) ||
        usuario.dni.includes(busqueda) ||
        usuario.email.toLowerCase().includes(busqueda.toLowerCase())
    );

    // ===============================================
    // 4. RENDERING DEL COMPONENTE
    // ===============================================

    return (
        <div className="gestion-usuarios-container">
            {/* Mensaje de Éxito */}
            {mensajeExito && (
                <div className="alerta-exito">
                    ✅ ¡Usuario eliminado con éxito! 
                </div>
            )}
            
            {/* Mensaje de Error */}
            {mensajeError && (
                <div className="alerta-error">
                    ❌ {mensajeError}
                </div>
            )}

            <h1 className="titulo-usuarios">Lista de Usuarios</h1>
            
            {/* Barra de Búsqueda */}
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

            {/* Condicional de Carga y Contenido */}
            {isLoading ? (
                <p className="loading-message">Cargando lista de usuarios...</p>
            ) : usuarios.length === 0 ? (
                 <p className="empty-message">No se encontraron usuarios en el sistema.</p>
            ) : (
                /* Grid de Tarjetas (Lista de Presentación) */
                <div className="usuarios-grid">
                    {usuariosFiltrados.map((usuario) => (
                        <div key={usuario.id} className="usuario-card">
                            <p className="usuario-rol">{usuario.rol}</p>
                            <h3 className="usuario-nombre">{usuario.nombre} {usuario.apellido}</h3>
                            <p className="usuario-dato">DNI: {usuario.dni}</p>
                            <p className="usuario-dato">Email: {usuario.email}</p>
                            
                            <div className="card-actions">
                                <button 
                                    className="btn-editar-usuario"
                                    onClick={() => handleEditarUsuario(usuario)}
                                >Editar</button>
                                <button 
                                    className="btn-eliminar-usuario"
                                    onClick={() => handleMostrarConfirmacion(usuario)}
                                >Eliminar</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Botón Agregar (Al final y centrado) */}
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
                        <p>¿Estás seguro de que deseas eliminar al usuario **{usuarioAEliminar?.nombre} {usuarioAEliminar?.apellido}**?</p>
                        <div className="modal-actions">
                            <button 
                                className="btn-modal-cancelar"
                                onClick={handleCancelarEliminacion}
                            >Cancelar</button>
                            <button 
                                className="btn-modal-confirmar"
                                onClick={handleConfirmarEliminacion} // Llama a la confirmación que usa la API
                            >Confirmar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UsuariosMain;