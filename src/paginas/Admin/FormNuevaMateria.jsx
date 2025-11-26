<<<<<<< HEAD
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios'; // Importamos axios
import Boton from '../../componentes/UI/Boton.jsx';
import './FormNuevaMateria.css';
import Notificacion from '../../componentes/UI/Notificacion.jsx';

// URL base de la API (Ajustar según tu backend)
const API_BASE_URL = 'http://localhost:5000/api'; 

const materiasPredefinidas = [
    'Matemáticas', 'Lengua y Literatura', 'Historia', 'Geografía', 
    'Biología', 'Física', 'Química', 'Inglés', 'Educación Física', 
    'Arte', 'Informática', 'Ciudadanía y Participación',
=======
import React, { useState } from 'react';
import Boton from '../../componentes/UI/Boton.jsx'; 
import './FormNuevaMateria.css'; 
import Notificacion from '../../componentes/UI/Notificacion.jsx';

// 1. DEFINIMOS LAS MATERIAS PRECARGADAS
const materiasPredefinidas = [
    'Matemáticas',
    'Lengua y Literatura',
    'Historia',
    'Geografía',
    'Biología',
    'Física',
    'Química',
    'Inglés',
    'Educación Física',
    'Arte',
    'Informática',
    'Ciudadanía y Participación'
];

const profesoresSimulados = [
    'Juliana Esquivero Vargas',
    'Marcelo Mengolini',
    'Maria Garcia',
    'Juan Lopez',
    'Ana Martinez',
    'José Rodriguez',
    'Laura Fernández',
    'David Pérez',
    'Carmen González',
    'Manuel Sánchez',
    'Sofia Romero',
    'Luis Torres',
>>>>>>> parent of b6d7798 (front completo, creo)
];

const FormNuevaMateria = ({ alGuardar, alCancelar }) => {
    // Inicializamos vacío para obligar al usuario a elegir una opción
    const [nombreMateria, setNombreMateria] = useState(''); 
    const [profesorAsignado, setProfesorAsignado] = useState('');
    const [busquedaProfesor, setBusquedaProfesor] = useState('');
    const [notificacion, setNotificacion] = useState(null);
    
    const profesoresFiltrados = profesoresSimulados.filter(profesor => 
        profesor.toLowerCase().includes(busquedaProfesor.toLowerCase())
    );

<<<<<<< HEAD
const FormNuevaMateria = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Obtener datos de la navegación
    const idCurso = location.state?.idCurso; // ID del curso para el modo CREACIÓN
    const materiaAEditar = location.state?.materiaAEditar; // Datos de la materia para el modo EDICIÓN
    const modoEdicion = !!materiaAEditar;

    // 2. Inicializar estado del formulario
    const initialProfesor = materiaAEditar?.profesor === '' 
        ? PROFESOR_NO_ASIGNADO 
        : materiaAEditar?.profesor || '';

    const [nombreMateria, setNombreMateria] = useState(materiaAEditar?.nombre || '');
    const [profesorAsignado, setProfesorAsignado] = useState(initialProfesor);
    const [busquedaProfesor, setBusquedaProfesor] = useState('');
    
    // Estados de UI y API
    const [notificacion, setNotificacion] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [profesores, setProfesores] = useState([]); // Lista de profesores reales
    const [isLoadingProfesores, setIsLoadingProfesores] = useState(true);

    // ===============================================
    // LÓGICA DE CARGA DE PROFESORES (GET)
    // ===============================================
    useEffect(() => {
        const cargarProfesores = async () => {
            setIsLoadingProfesores(true);
            const token = localStorage.getItem('authToken');
            
            if (!token) {
                setNotificacion({ mensaje: "Token de autenticación no encontrado.", tipo: 'error' });
                setIsLoadingProfesores(false);
                return;
            }

            try {
                // Asumimos el endpoint GET: /api/profesores (debe devolver un array de objetos con 'nombre')
                const response = await axios.get(`${API_BASE_URL}/profesores`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                // Extraer solo los nombres si la API devuelve objetos, sino usar el array directamente
                const nombresProfesores = response.data.map(p => p.nombre); 
                setProfesores(nombresProfesores);

            } catch (error) {
                console.error('Error al cargar profesores:', error);
                setNotificacion({
                    mensaje: 'Error al cargar la lista de profesores.',
                    tipo: 'error'
                });
            } finally {
                setIsLoadingProfesores(false);
            }
        };

        cargarProfesores();
    }, []); // Cargar solo al montar el componente

    // Filtrado de profesores
    const profesoresFiltrados = profesores.filter((profesor) =>
        profesor.toLowerCase().includes(busquedaProfesor.toLowerCase())
    );

    // ===============================================
    // LÓGICA DE SUBMISIÓN (POST/PUT)
    // ===============================================
    const handleSubmit = async (e) => {
        e.preventDefault();
        setNotificacion(null);
        setIsSubmitting(true);

        if (!nombreMateria) {
            setNotificacion({ mensaje: 'Debe seleccionar una materia.', tipo: 'error' });
            setIsSubmitting(false);
            return;
        }
        
        // 1. Normalizar el valor a guardar
        const profesorFinal = profesorAsignado === PROFESOR_NO_ASIGNADO ? '' : profesorAsignado;

        // 2. Construir el payload
        const payload = {
            nombre: nombreMateria,
            profesor: profesorFinal,
            // Solo se incluye idCurso si estamos en modo creación
            ...(modoEdicion ? {} : { idCurso: idCurso }), 
        };

        const token = localStorage.getItem('authToken');
        if (!token) {
            setNotificacion({ mensaje: "Token de autenticación no encontrado.", tipo: 'error' });
            setIsSubmitting(false);
            return;
        }

        const config = { headers: { Authorization: `Bearer ${token}` } };
        
        try {
            let response;
            if (modoEdicion) {
                // PUT para editar
                response = await axios.put(`${API_BASE_URL}/materias/${materiaAEditar.id}`, payload, config);
            } else {
                // Validar idCurso para creación
                if (!idCurso) {
                    setNotificacion({ mensaje: "ID del curso faltante para la creación.", tipo: 'error' });
                    throw new Error("ID del curso faltante");
                }
                // POST para crear
                response = await axios.post(`${API_BASE_URL}/materias`, payload, config);
            }

            const mensajeExito = modoEdicion
                ? `Materia ${nombreMateria} modificada exitosamente.`
                : `Materia ${nombreMateria} creada exitosamente.`;

            setNotificacion({ mensaje: mensajeExito, tipo: 'exito' });

            // Redirigir después de un breve retraso
            setTimeout(() => {
                navigate(-1); // Regresar a la lista de materias
            }, 1500);

        } catch (error) {
            console.error('Error al guardar materia:', error.response?.data || error.message);
            const errorMsg = error.response?.data?.message || "Ocurrió un error al intentar guardar la materia.";
            setNotificacion({ 
                mensaje: `Error: ${errorMsg}`, 
                tipo: 'error' 
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleProfesorSelect = (nombre) => {
        setProfesorAsignado(nombre);
        setBusquedaProfesor('');
    };

    const handleCancelar = () => {
        navigate(-1); // Volver atrás
    };
    
    // Lógica para mostrar/ocultar el dropdown
    const isDropdownVisible = (busquedaProfesor.length > 0 || (profesorAsignado === PROFESOR_NO_ASIGNADO && busquedaProfesor.length === 0));


    // El input del profesor muestra el valor seleccionado si no hay búsqueda activa.
    const displayValue = busquedaProfesor || (profesorAsignado === PROFESOR_NO_ASIGNADO ? '' : profesorAsignado);

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
                    
                    {/* Select de materia */}
                    <div className="form-group-materia">
                        <label htmlFor="materia">Materia</label>
                        <select
                            id="materia"
                            value={nombreMateria}
                            onChange={(e) => setNombreMateria(e.target.value)}
                            className="form-input-materia"
                            style={{ cursor: 'pointer' }}
                            disabled={modoEdicion || isSubmitting} // Deshabilitar si se está editando o enviando
                        >
                            <option value="" disabled>Seleccione una materia</option>
                            {materiasPredefinidas.map((materia, index) => (
                                <option key={index} value={materia}>{materia}</option>
                            ))}
                        </select>
                    </div>

                    {/* Selector de profesor */}
                    <div className="form-group-materia">
                        <label htmlFor="profesor">Profesor Asignado (Opcional)</label>
                        <div className="custom-selector-wrapper">
                            <input
                                type="text"
                                id="profesor"
                                value={displayValue}
                                onChange={(e) => {
                                    setBusquedaProfesor(e.target.value);
                                    // Limpiar la selección si el usuario empieza a escribir
                                    if(e.target.value !== profesorAsignado) setProfesorAsignado(''); 
                                }}
                                placeholder={isLoadingProfesores 
                                    ? "Cargando profesores..." 
                                    : "Buscar Profesor o seleccionar 'No Asignado'"}
                                className="form-input-materia profesor-input"
                                autoComplete="off"
                                disabled={isLoadingProfesores || isSubmitting}
                            />
                            <i className="fas fa-search search-icon"></i>

                            {/* Dropdown de profesores */}
                            {(isDropdownVisible) && (
                                <ul className="profesor-dropdown">
                                    
                                    {/* Opción para indicar que no hay profesor */}
                                    <li
                                        onClick={() => handleProfesorSelect(PROFESOR_NO_ASIGNADO)}
                                        className="dropdown-item dropdown-item-no-profesor"
                                        style={{ fontWeight: 'bold', borderBottom: '1px solid #eee' }}
                                    >
                                        {PROFESOR_NO_ASIGNADO}
                                    </li>
                                    
                                    {/* Lista de profesores filtrados */}
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

                    {/* Acciones */}
                    <div className="form-actions-materia">
                        <Boton 
                            type="submit" 
                            className="ui-boton-principal"
                            disabled={isSubmitting || isLoadingProfesores}
                        >
                            {isSubmitting ? 'Guardando...' : 'Guardar'}
                        </Boton>
                        <Boton
                            type="button" 
                            onClick={handleCancelar}
                            style={{ marginLeft: '10px' }}
                            variante="secundaria"
                            className="ui-boton-secundario" // Usar clase secundaria si existe
                            disabled={isSubmitting}
                        >
                            Cancelar
                        </Boton>
                    </div>
                </form>
            </div>
=======
    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (nombreMateria && profesorAsignado) {
            setNotificacion({ 
                mensaje: 'Materia creada y profesor asignado exitosamente.', 
                tipo: 'exito' 
            });
            setTimeout(() => {
                alGuardar({ nombreMateria, profesorAsignado });
            }, 1000); 

        } else {
            setNotificacion({ 
                mensaje: 'Debe seleccionar una materia y asignar un profesor.', 
                tipo: 'error' 
            });
        }
    };
    
    const handleProfesorSelect = (nombre) => {
        setProfesorAsignado(nombre);
        setBusquedaProfesor(''); 
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
            <h1 className="titulo-formulario-materia">Nueva Materia</h1>
            
            <form onSubmit={handleSubmit}>
                
                {/* 2. REEMPLAZAMOS EL INPUT POR UN SELECT */}
                <div className="form-group-materia">
                    <label htmlFor="materia">Materia</label>
                    
                    {/* Usamos la misma clase 'form-input-materia' para mantener el estilo */}
                    <select
                        id="materia"
                        value={nombreMateria}
                        onChange={(e) => setNombreMateria(e.target.value)}
                        className="form-input-materia"
                        style={{ cursor: 'pointer' }} // Pequeño estilo inline para mejorar UX
                    >
                        {/* Opción por defecto deshabilitada */}
                        <option value="" disabled>Seleccione una materia</option>
                        
                        {/* Mapeamos la lista predefinida */}
                        {materiasPredefinidas.map((materia, index) => (
                            <option key={index} value={materia}>
                                {materia}
                            </option>
                        ))}
                    </select>
                </div>

                {/* CAMPO PROFESOR (Sin cambios) */}
                <div className="form-group-materia">
                    <label htmlFor="profesor">Profesor Asignado</label>
                    <div className="custom-selector-wrapper">
                        <input
                            type="text"
                            id="profesor"
                            value={profesorAsignado || busquedaProfesor}
                            onChange={(e) => setBusquedaProfesor(e.target.value)}
                            placeholder="Buscar Profesor"
                            className="form-input-materia profesor-input"
                            autoComplete="off" 
                        />
                        <i className="fas fa-search search-icon"></i>
                        
                        {(busquedaProfesor.length > 0 || !profesorAsignado) && profesoresFiltrados.length > 0 && (
                            <ul className="profesor-dropdown">
                                {profesoresFiltrados.map((profesor, index) => (
                                    <li 
                                        key={index} 
                                        onClick={() => handleProfesorSelect(profesor)}
                                        className="dropdown-item"
                                    >
                                        {profesor}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                <div className="form-actions-materia">
                    <Boton type="submit" className='ui-boton-principal'>Guardar</Boton>
                    <Boton onClick={alCancelar} style={{marginLeft: '10px'}} variante="secundaria" className='ui-boton-principal'>Cancelar</Boton>
                </div>
            </form>
        </div>
>>>>>>> parent of b6d7798 (front completo, creo)
        </>
    );
};

export default FormNuevaMateria;