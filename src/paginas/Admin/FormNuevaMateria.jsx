import React, { useState, useEffect, useMemo } from 'react';
import { useRoute } from 'wouter';
import { API } from '../../apis/constantes.js';
import { usePost } from '../../hooks/usePost.js';
import { usePut } from '../../hooks/usePut.js';
import { useGet } from '../../hooks/useGet.js';
import Boton from '../../componentes/UI/Boton.jsx';
import './FormNuevaMateria.css';
import Notificacion from '../../componentes/UI/Notificacion.jsx';

const FormNuevaMateria = () => {
    const [, paramsCrear] = useRoute('/admin/materias/:idCurso/crear');
    const [matchEditar, paramsEditar] = useRoute('/admin/materias/editar/:idCursoMateria');

    const idCurso = paramsCrear?.idCurso;
    const idCursoMateria = paramsEditar?.idCursoMateria;
    const modoEdicion = Boolean(matchEditar && idCursoMateria);

    const urlMaterias = `${API}/materias`;
    const [dataMaterias, loadingMaterias, errorMaterias] = useGet(urlMaterias, []);

    const urlProfesores = `${API}/usuarios/profesores`; 
    const [dataProfesores, loadingProfesores, errorProfesores] = useGet(urlProfesores, []);

    const urlCursoMaterias = modoEdicion ? `${API}/curso-materias` : null;
    const [cursoMaterias, loadingCursoMaterias] = useGet(urlCursoMaterias, []);

    const materiaAEditar = useMemo(() => {
        if (!modoEdicion || !Array.isArray(cursoMaterias)) return null;
        return cursoMaterias.find((cm) => String(cm.id) === String(idCursoMateria)) || null;
    }, [modoEdicion, cursoMaterias, idCursoMateria]);

    const { ejecutarPost, cargando: creando, error: errorCrear } = usePost();
    const { ejecutarPut, cargando: actualizando, error: errorActualizar } = usePut();

    const [materiaId, setMateriaId] = useState(materiaAEditar?.id_materia || '');
    const [profesorAsignadoId, setProfesorAsignadoId] = useState(materiaAEditar?.id_profesor || ''); 
    const [busquedaProfesor, setBusquedaProfesor] = useState('');
    const [notificacion, setNotificacion] = useState(null);

    useEffect(() => {
        if (materiaAEditar) {
            setMateriaId(materiaAEditar.id_materia || '');
            setProfesorAsignadoId(materiaAEditar.id_profesor || '');
        }
    }, [materiaAEditar]);

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

        const cursoIdFinal = Number(idCurso || materiaAEditar?.id_curso);
        if (!cursoIdFinal) {
            setNotificacion({
                mensaje: 'No se pudo determinar el curso.',
                tipo: 'error',
            });
            return;
        }

        if (!materiaId) {
            setNotificacion({
                mensaje: 'Debe seleccionar una materia.',
                tipo: 'error',
            });
            return;
        }

        if (!profesorAsignadoId) {
            setNotificacion({
                mensaje: 'Debe seleccionar un profesor.',
                tipo: 'error',
            });
            return;
        }

        const datosMateria = {
            id_materia: Number(materiaId),
            id_curso: cursoIdFinal,
            id_profesor: Number(profesorAsignadoId),
        };

        let exito = false;
        let mensajeExito = '';
        let mensajeError = '';

        if (modoEdicion) {
            const url = `${API}/curso-materias/${idCursoMateria}`; 
            exito = await ejecutarPut(url, datosMateria);
            mensajeExito = 'Materia modificada exitosamente.';
            mensajeError = errorActualizar?.message || 'Error al actualizar la materia.';
        } else {
            const url = `${API}/curso-materias`; 
            exito = await ejecutarPost(url, datosMateria);
            mensajeExito = 'Materia asignada exitosamente.';
            mensajeError = errorCrear?.message || 'Error al crear la materia.';
        }

        if (exito) {
            setNotificacion({ mensaje: mensajeExito, tipo: 'exito' });
            setTimeout(() => {
                window.history.back();
            }, 800);
        } else {
            setNotificacion({ mensaje: mensajeError, tipo: 'error' });
        }
    };

    const handleProfesorSelect = (profesor) => {
        setProfesorAsignadoId(profesor.id);
        setBusquedaProfesor(`${profesor.nombre} ${profesor.apellido}`);
    };
    
    const handleCancelar = () => {
        window.history.back(); 
    };

    if (loadingMaterias || loadingProfesores || creando || actualizando || (modoEdicion && loadingCursoMaterias)) {
        return <div className="nueva-materia-container"><p>Cargando datos...</p></div>;
    }

    if (errorMaterias || errorProfesores) {
        return (
            <div className="nueva-materia-container">
                <p className="error-msg">Error al cargar datos: {errorMaterias || errorProfesores}</p>
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
                        <label htmlFor="materia">Materia</label>
                        <select
                            id="materia"
                            value={materiaId}
                            onChange={(e) => setMateriaId(e.target.value)}
                            className="form-input-materia"
                            style={{ cursor: 'pointer' }}
                            disabled={modoEdicion} 
                        >
                            <option value="" disabled>Seleccione una materia</option>
                            {dataMaterias.map((materia) => (
                                <option key={materia.id} value={materia.id}>{materia.nombre}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group-materia">
                        <label htmlFor="profesor">Profesor Asignado</label>
                        <div className="custom-selector-wrapper">
                            <input
                                type="text"
                                id="profesor"
                                value={busquedaProfesor || nombreCompletoProfesorActual}
                                onChange={(e) => {
                                    setBusquedaProfesor(e.target.value);
                                    setProfesorAsignadoId(''); 
                                }}
                                placeholder="Buscar Profesor"
                                className="form-input-materia profesor-input"
                                autoComplete="off"
                            />
                            <i className="fas fa-search search-icon"></i>
                            {busquedaProfesor.length > 0 && (
                                <ul className="profesor-dropdown">
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
                                        <li className="dropdown-item-disabled">
                                            No se encontraron profesores.
                                        </li>
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
