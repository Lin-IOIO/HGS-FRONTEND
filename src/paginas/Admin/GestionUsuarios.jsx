import React, { useState, useEffect  } from 'react';
import { API } from 'apis/constantes.js';
import { useGet } from 'hooks/useGet.js';
import { useDelete } from '../../hooks/useDelete';
import { useNavigate } from 'react-router-dom';
import Boton from '../../componentes/UI/Boton';
import './GestionUsuarios.css'; 

const GestionUsuarios = () => {

    const urlUsuarios = `${API}/usuarios`;
    const [dataUsuarios, loading, error] = useGet(urlUsuarios, []);
    const { ejecutarEliminacion, cargando: eliminando, error: errorEliminar } = useDelete();
    const [usuarios, setUsuarios] = useState([]);

    const navigate = useNavigate();
    const [busqueda, setBusqueda] = useState('');
    const [modalAbierto, setModalAbierto] = useState(false);
    const [usuarioAEliminar, setUsuarioAEliminar] = useState(null);
    const [mensajeExito, setMensajeExito] = useState(false);

    useEffect(() => {
        if (dataUsuarios) {
            setUsuarios(dataUsuarios);
        }
    }, [dataUsuarios]);

    const handleMostrarConfirmacion = (usuario) => {
        setUsuarioAEliminar(usuario);
        setModalAbierto(true);
    };

   
 const handleConfirmarEliminacion = async () => {
        if (!usuarioAEliminar) return;

        console.log(`Eliminando usuario con ID: ${usuarioAEliminar.id}`);
        const urlParaBorrar = `${API}/usuarios/${usuarioAEliminar.id}`;
        const exito = await ejecutarEliminacion(urlParaBorrar);

        if (exito) {
            const nuevaLista = usuarios.filter(u => u.id !== usuarioAEliminar.id);
            setUsuarios(nuevaLista);
            setMensajeExito(true);
            setModalAbierto(false);
            setUsuarioAEliminar(null);

            setTimeout(() => {
                setMensajeExito(false);
            }, 3000);
        } else {
            console.error("No se pudo eliminar el usuario");
        }
    };
    const handleCancelarEliminacion = () => {
        setModalAbierto(false);
        setUsuarioAEliminar(null);
    };

    const handleAgregarUsuario = () => {
        navigate('/admin/usuarios/crear');
    };

    const handleEditarUsuario = (usuario) => {
        navigate('/admin/usuarios/editar', { state: { usuarioAEditar: usuario } });
    };

    const criterio = busqueda.toLowerCase();
    const usuariosFiltrados = usuarios.filter(usuario => 
        (`${usuario.nombre} ${usuario.apellido}`.toLowerCase().includes(criterio)) ||
        (usuario.nombre || '').toLowerCase().includes(criterio) ||
        (usuario.apellido || '').toLowerCase().includes(criterio)
    );

    if (loading) {
        return <div className="gestion-usuarios-container"><p>Cargando usuarios...</p></div>;
    }

    if (error) {
        return (
            <div className="gestion-usuarios-container">
                <p className="error-msg">{error}</p>
                <Boton onClick={() => window.location.reload()}>Reintentar</Boton>
            </div>
        );
    }

    return (
        <div className="gestion-usuarios-container">
            {mensajeExito && (
                <div className="alerta-exito">
                    ✅ ¡Usuario **{usuarioAEliminar?.nombre}** eliminado con éxito! 
                </div>
            )}
            
            <h1 className="titulo-usuarios">Lista de Usuarios</h1>
            {/* <div className="barra-busqueda-container">
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
            </div> */}

            <hr className="divisor-usuarios" />

            <div className="usuarios-grid">
                {usuariosFiltrados.map((usuario) => (
                    <div key={usuario.id} className="usuario-card">
                        <p className="usuario-rol">{usuario.rol}</p>
                        <h3 className="usuario-nombre">{usuario.nombre} {usuario.apellido}</h3>
                        <p className="usuario-dato">DNI: {usuario.DNI}</p>
                        <p className="usuario-dato">Email: {usuario.correo_electronico}</p>
                        
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

            <div className="footer-actions">
                <Boton 
                    onClick={handleAgregarUsuario} 
                    className="btn-agregar-usuario-grande"
                >
                    Agregar usuario
                </Boton>
            </div>
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
