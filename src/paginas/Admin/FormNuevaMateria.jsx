import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { API } from '../../apis/constantes.js';
import { usePost } from '../../hooks/usePost.js';
import { usePut } from '../../hooks/usePut.js';
import { useGet } from '../../hooks/useGet.js';
import Boton from '../../componentes/UI/Boton.jsx';
import './FormNuevaMateria.css';
import Notificacion from '../../componentes/UI/Notificacion.jsx';

const PROFESOR_NO_ASIGNADO = 'No Asignado';

const FormNuevaMateria = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const urlAsignaturas = `${API}/asignaturas`;
    const [dataAsignaturas, loadingAsignaturas, errorAsignaturas] = useGet(urlAsignaturas, []);

    const urlProfesores = `${API}/usuarios/profesores`; 
    const [dataProfesores, loadingProfesores, errorProfesores] = useGet(urlProfesores, []);

    const { ejecutarPost, cargando: creando, error: errorCrear } = usePost();
    const { ejecutarPut, cargando: actualizando, error: errorActualizar } = usePut();

    const materiaAEditar = location.state?.materiaAEditar; 
    const modoEdicion = !!materiaAEditar;

    const [asignaturaId, setAsignaturaId] = useState(materiaAEditar?.asignatura_id || '');
    const [profesorAsignadoId, setProfesorAsignadoId] = useState(materiaAEditar?.id_profesor_asignado || ''); 
    const [busquedaProfesor, setBusquedaProfesor] = useState('');
    const [notificacion, setNotificacion] = useState(null);

    // ⚠️ Asegúrate de que este ID se pase correctamente al componente
    const [cursoId, setCursoId] = useState(location.state?.cursoId || 17); 

    const profesoresFiltrados = dataProfesores?.filter((profesor) => {
        const nombreCompleto = `${profesor.nombre} ${profesor.apellido}`.toLowerCase();
        return nombreCompleto.includes(busquedaProfesor.toLowerCase());
    }) || [];

    const nombreProfesorActual = dataProfesores?.find(p => p.id === profesorAsignadoId);
    const nombreCompletoProfesorActual = nombreProfesorActual 
        ? `${nombreProfesorActual.nombre} ${nombreProfesorActual.apellido}`
        : '';
        
    const handleSubmit = async (e) => {
        e.preventDefault();

        const finalAsignaturaId = asignaturaId; 

        if (!finalAsignaturaId) {
            setNotificacion({
                mensaje: 'Debe seleccionar una materia (asignatura).',
                tipo: 'error',
            });
            return;
        }
        
        const idProfesorFinal = profesorAsignadoId === PROFESOR_NO_ASIGNADO ? null : profesorAsignadoId;

        const datosMateria = {
            asignatura_id: finalAsignaturaId,
            pertenece_a_id_curso: cursoId,
            id_profesor_asignado: idProfesorFinal,
        };

        let exito = false;
        let mensajeExito = '';
        let mensajeError = '';

        if (modoEdicion) {
            const url = `${API}/materias/${materiaAEditar.id}`; 
            exito = await ejecutarPut(url, datosMateria);
            mensajeExito = 'Materia modificada exitosamente.';
            mensajeError = errorActualizar?.message || 'Error al actualizar la materia.';
        } else {
            const url = `${API}/materias`; 
            exito = await ejecutarPost(url, datosMateria);
            mensajeExito = `Materia creada y profesor ${idProfesorFinal ? 'asignado' : 'no asignado'} exitosamente.`;
            mensajeError = errorCrear?.message || 'Error al crear la materia.';
        }

        if (exito) {
            setNotificacion({ mensaje: mensajeExito, tipo: 'exito' });
            setTimeout(() => {
                navigate(-1);
            }, 800);
        } else {
            setNotificacion({ mensaje: mensajeError, tipo: 'error' });
        }
    };

    const handleProfesorSelect = (profesor) => {
        setProfesorAsignadoId(profesor.id);
        setBusquedaProfesor(`${profesor.nombre} ${profesor.apellido}`);
    };

    const handleNoAsignado = () => {
        setProfesorAsignadoId(null);
        setBusquedaProfesor(PROFESOR_NO_ASIGNADO);
    }
    
    const handleCancelar = () => {
        navigate(-1); 
    };

    if (loadingAsignaturas || loadingProfesores || creando || actualizando) {
        return <div className="nueva-materia-container"><p>Cargando datos...</p></div>;
    }

    if (errorAsignaturas || errorProfesores) {
        return (
            <div className="nueva-materia-container">
                <p className="error-msg">Error al cargar datos: {errorAsignaturas || errorProfesores}</p>
                <Boton onClick={() => window.location.reload()}>Reintentar</Boton>
            </div>
        );
    }
    
    return (
        <>
            {notificacion && (
                <Notificacion
                    mensaje={notificacion.mensaje}
                    tipo={notificacion.tipo}
                    alCerrar={() => setNotificacion(null)}
                />
            )}

            <div className="nueva-materia-container">
                <h1 className="titulo-formulario-materia">
                    {modoEdicion ? 'Modificar Materia Asignada' : 'Asignar Nueva Materia'}
                </h1>
                
                <form onSubmit={handleSubmit}>
                    <div className="form-group-materia">
                        <label htmlFor="materia">Materia (Asignatura)</label>
                        <select
                            id="materia"
                            value={asignaturaId}
                            onChange={(e) => setAsignaturaId(e.target.value)}
                            className="form-input-materia"
                            style={{ cursor: 'pointer' }}
                            disabled={modoEdicion} 
                        >
                            <option value="" disabled>Seleccione una materia (asignatura)</option>
                            {dataAsignaturas.map((asignatura) => (
                                <option key={asignatura.id} value={asignatura.id}>{asignatura.nombre}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group-materia">
                        <label htmlFor="profesor">Profesor Asignado (Opcional)</label>
                        <div className="custom-selector-wrapper">
                            <input
                                type="text"
                                id="profesor"
                                value={busquedaProfesor || (profesorAsignadoId === null ? PROFESOR_NO_ASIGNADO : nombreCompletoProfesorActual)}
                                
                                onChange={(e) => {
                                    setBusquedaProfesor(e.target.value);
                                    setProfesorAsignadoId(''); 
                                }}
                                placeholder="Buscar Profesor o seleccionar 'No Asignado'"
                                className="form-input-materia profesor-input"
                                autoComplete="off"
                            />
                            <i className="fas fa-search search-icon"></i>
                            {(busquedaProfesor.length > 0 || !profesorAsignadoId) && (
                                <ul className="profesor-dropdown">
                                    <li
                                        onClick={handleNoAsignado}
                                        className="dropdown-item dropdown-item-no-profesor"
                                        style={{ fontWeight: 'bold', borderBottom: '1px solid #eee' }}
                                    >
                                        {PROFESOR_NO_ASIGNADO}
                                    </li>
                                    {profesoresFiltrados.length > 0 ? (
                                        profesoresFiltrados.map((profesor) => (
                                            <li
                                                key={profesor.id}
                                                onClick={() => handleProfesorSelect(profesor)}
                                                className="dropdown-item"
                                            >
                                                {`${profesor.nombre} ${profesor.apellido}`}
                                            </li>
                                        ))
                                    ) : (
                                        busquedaProfesor.length > 0 && (
                                            <li className="dropdown-item-disabled">
                                                No se encontraron profesores.
                                            </li>
                                        )
                                    )}
                                </ul>
                            )}
                        </div>
                    </div>
                    
                    <div className="form-actions-materia">
                        <Boton type="submit" className="ui-boton-principal" disabled={creando || actualizando}>
                            {creando || actualizando ? 'Guardando...' : 'Guardar'}
                        </Boton>
                        <Boton
                            type="button"
                            onClick={handleCancelar}
                            style={{ marginLeft: '10px' }}
                            variante="secundaria"
                            className="ui-boton-principal"
                        >
                            Cancelar
                        </Boton>
                    </div>
                </form>
            </div>
        </>
    );
};

export default FormNuevaMateria;