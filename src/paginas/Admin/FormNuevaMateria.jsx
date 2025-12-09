import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { useLocation } from 'wouter';
import Boton from '../../componentes/UI/Boton.jsx';
import './FormNuevaMateria.css';
import Notificacion from '../../componentes/UI/Notificacion.jsx';

const materiasPredefinidas = [
    'Matemáticas', 'Lengua y Literatura', 'Historia', 'Geografía',
    'Biología', 'Física', 'Química', 'Inglés', 'Educación Física',
    'Arte', 'Informática', 'Ciudadanía y Participación',
];

const profesoresSimulados = [
    'Juliana Esquivero Vargas', 'Marcelo Mengolini', 'Maria Garcia',
    'Juan Lopez', 'Ana Martinez', 'José Rodriguez', 'Laura Fernández',
    'David Pérez', 'Carmen González', 'Manuel Sánchez', 'Sofia Romero', 'Luis Torres',
];

const PROFESOR_NO_ASIGNADO = 'No Asignado';

const FormNuevaMateria = () => {
    const navigate = useNavigate();
    const location = useLocation();


    const materiaAEditar = location.state?.materiaAEditar;
    const modoEdicion = !!materiaAEditar;

    const initialProfesor = materiaAEditar?.profesor === ''
        ? PROFESOR_NO_ASIGNADO
        : materiaAEditar?.profesor || '';

    const [nombreMateria, setNombreMateria] = useState(materiaAEditar?.nombre || '');
    const [profesorAsignado, setProfesorAsignado] = useState(initialProfesor);
    const [busquedaProfesor, setBusquedaProfesor] = useState('');
    const [notificacion, setNotificacion] = useState(null);

    const profesoresFiltrados = profesoresSimulados.filter((profesor) =>
        profesor.toLowerCase().includes(busquedaProfesor.toLowerCase())
    );

    const handleSubmit = (e) => {
        e.preventDefault();


        if (!nombreMateria) {
            setNotificacion({
                mensaje: 'Debe seleccionar una materia.',
                tipo: 'error',
            });
            return;
        }
        const profesorFinal = profesorAsignado === PROFESOR_NO_ASIGNADO ? '' : profesorAsignado;


        setNotificacion({
            mensaje: modoEdicion
                ? 'Materia modificada exitosamente.'
                : `Materia creada y profesor ${profesorFinal ? 'asignado' : 'no asignado'} exitosamente.`,
            tipo: 'exito',
        });

        setTimeout(() => {
            // Aquí guardarías en la BD
            console.log("Guardando:", {
                id: materiaAEditar?.id,
                nombre: nombreMateria,
                profesor: profesorFinal
            });
            navigate(-1);
        }, 800);
    };

    const handleProfesorSelect = (nombre) => {
        setProfesorAsignado(nombre);
        setBusquedaProfesor('');
    };

    const handleCancelar = () => {
        navigate(-1); // Volver atrás
    };

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
                    {modoEdicion ? 'Modificar Materia' : 'Nueva Materia'}
                </h1>

                <form onSubmit={handleSubmit}>
                    <div className="form-group-materia">
                        <label htmlFor="materia">Materia</label>
                        <select
                            id="materia"
                            value={nombreMateria}
                            onChange={(e) => setNombreMateria(e.target.value)}
                            className="form-input-materia"
                            style={{ cursor: 'pointer' }}
                        >
                            <option value="" disabled>Seleccione una materia</option>
                            {materiasPredefinidas.map((materia, index) => (
                                <option key={index} value={materia}>{materia}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group-materia">
                        <label htmlFor="profesor">Profesor Asignado (Opcional)</label>
                        <div className="custom-selector-wrapper">
                            <input
                                type="text"
                                id="profesor"

                                value={busquedaProfesor || profesorAsignado}

                                onChange={(e) => {
                                    setBusquedaProfesor(e.target.value);
                                    setProfesorAsignado('');
                                }}
                                placeholder="Buscar Profesor o seleccionar 'No Asignado'"
                                className="form-input-materia profesor-input"
                                autoComplete="off"
                            />
                            <i className="fas fa-search search-icon"></i>
                            {(busquedaProfesor.length > 0 || profesorAsignado === '') && (
                                <ul className="profesor-dropdown">
                                    <li
                                        onClick={() => handleProfesorSelect(PROFESOR_NO_ASIGNADO)}
                                        className="dropdown-item dropdown-item-no-profesor"
                                        style={{ fontWeight: 'bold', borderBottom: '1px solid #eee' }}
                                    >
                                        {PROFESOR_NO_ASIGNADO}
                                    </li>
                                    {profesoresFiltrados.length > 0 ? (
                                        profesoresFiltrados.map((profesor, index) => (
                                            <li
                                                key={index}
                                                onClick={() => handleProfesorSelect(profesor)}
                                                className="dropdown-item"
                                            >
                                                {profesor}
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
                        <Boton type="submit" className="ui-boton-principal">
                            Guardar
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