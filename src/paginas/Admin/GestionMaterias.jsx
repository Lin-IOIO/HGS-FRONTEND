import React from 'react';
import { useEffect, useState } from 'react';
import { useParams } from 'wouter';
import { useNavigate } from 'react-router-dom';
import { API } from 'apis/constantes.js';
import { useGet } from 'hooks/useGet.js';
import { useDelete } from '../../hooks/useDelete';
import Boton from '../../componentes/UI/Boton.jsx';
import './GestionMaterias.css';

const colores = ['#ff7f7f', '#f8c07f', '#7fdbff', '#7fffbf', '#d27fff', '#ff7fe1']

const GestionMaterias = () => {
    const urlMaterias = `${API}/materias`;
    const [materias, loading, error] = useGet(urlMaterias, []);
    const [materiasState, setMaterias] = useState([]);
    const { ejecutarEliminacion } = useDelete();
    const [modalAbierto, setModalAbierto] = useState(false);
    const [materiaAEliminar, setMateriaAEliminar] = useState(null);
    const [mensajeExito, setMensajeExito] = useState(false);

    let { idCurso } = useParams();
    const navigate = useNavigate();
    const nombreCurso = idCurso ? idCurso.replace('-', ' ') : 'Gestión de Materias';

    useEffect(() => {
        if (materias) {
            setMaterias(materias);
        }
    }, [materias]);

    const handleCrearMateria = () => {
        navigate('/admin/materias/crear');
    };

    const handleModificarMateria = (materia) => {
        navigate('/admin/materias/editar', { state: { materiaAEditar: materia } });
    };

    const handleMostrarConfirmacion = (materia) => {
        setMateriaAEliminar(materia);
        setModalAbierto(true);
    };
    const handleCancelarEliminacion = () => {
        setModalAbierto(false);
        setMateriaAEliminar(null);
    };

    const handleConfirmarEliminacion = async () => {
        if (!materiaAEliminar) return;

        console.log(`Eliminando materia con ID: ${materiaAEliminar.id}`);
        const urlParaBorrar = `${API}/materias/${materiaAEliminar.id}`;

        const exito = await ejecutarEliminacion(urlParaBorrar);

        if (exito) {
            const nuevaLista = materiasState.filter(m => m.id !== materiaAEliminar.id);
            setMaterias(nuevaLista);

            setMensajeExito(true);
            setModalAbierto(false);
            setMateriaAEliminar(null);

            setTimeout(() => {
                setMensajeExito(false);
            }, 3000);
        } else {
            console.error("No se pudo eliminar la materia");
        }
    };

    if (loading) {
        return <div className="gestion-materias-container"><p>Cargando materias...</p></div>;
    }
    if (error) {
        return (
            <div className="inicio-cursos-container">
                <p className="error-msg">{error}</p>
                <Boton onClick={() => window.location.reload()}>Reintentar</Boton>
            </div>
        );
    }

    // if (!materias || materias.length === 0) {
    //     return (
    //         <div className="gestion-materias-container">
    //             <header className="materias-header">
    //                 <h1 className="curso-titulo-grande">{nombreCurso}</h1>
    //             </header>
    //             <section className="materias-listado-section">
    //                 <div className="materias-listado-header">
    //                     <h2 className="materias-subtitulo">Materias Asignadas:</h2>
    //                     <Boton onClick={handleCrearMateria} className="ui-boton-principal">
    //                         <i className="fas fa-plus"></i>  Nueva Materia
    //                     </Boton>
    //                 </div>
    //                 <p>Actualmente no hay materias asignadas.</p>
    //             </section>
    //         </div>
    //     );
    // }

    return (
        <div className="gestion-materias-container">
            {mensajeExito && (
                <div className="alerta-exito" style={{
                    padding: '10px', backgroundColor: '#d4edda', color: '#155724',
                    marginBottom: '15px', borderRadius: '5px', textAlign: 'center'
                }}>
                    ✅ ¡Materia eliminada con éxito!
                </div>
            )}
            <header className="materias-header">
                <h1 className="curso-titulo-grande">{nombreCurso}</h1>
            </header>

            <section className="materias-listado-section">
                <div className="materias-listado-header">
                    <h2 className="materias-subtitulo">Materias Asignadas:</h2>
                    <Boton onClick={handleCrearMateria} className="ui-boton-principal">
                        <i className="fas fa-plus"></i>  Nueva Materia
                    </Boton>
                </div>

                {materias.length === 0 ? (
                    <p>Actualmente no hay materias asignadas.</p>
                ) : (
                    <div className="materias-grid">
                        {materias.map((materia, index) => (
                            <div key={materia.id} className="materia-card">
                                <div className="materia-info-header" style={{ backgroundColor: colores[index % colores.length] }}>
                                    <span className="materia-nombre">{materia.nombre}</span>
                                    <div style={{ float: 'right', display: 'flex', gap: '5px' }}>
                                        <Boton
                                            onClick={() => handleModificarMateria(materia)}
                                            className="btn-agregar-plan"
                                            style={{ backgroundColor: 'white', color: '#333', padding: '5px 10px', fontSize: '0.8rem' }}
                                            title="Modificar"
                                        >
                                            <i className="fas fa-edit"></i>
                                        </Boton>
                                        <Boton
                                            onClick={() => handleMostrarConfirmacion(materia)}
                                            className="btn-agregar-plan"
                                            style={{ backgroundColor: 'white', color: '#e74c3c', padding: '5px 10px', fontSize: '0.8rem' }}
                                            title="Eliminar"
                                        >
                                            <i className="fas fa-trash-alt"></i>
                                        </Boton>
                                    </div>

                                </div>
                                <div className="materia-info-footer">
                                    Profesor/a:
                                    <span style={{ fontWeight: materia.profesor ? 'normal' : 'italic', color: materia.profesor ? '#333' : '#e74c3c' }}>
                                        {materia.profesor || 'Sin Asignar'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
            {modalAbierto && (
                <div className="modal-backdrop">
                    <div className="modal-content">
                        <h3>Confirmar Eliminación</h3>
                        <p>¿Estás seguro de que deseas eliminar la materia <strong>{materiaAEliminar?.nombre}</strong>?</p>
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

export default GestionMaterias;