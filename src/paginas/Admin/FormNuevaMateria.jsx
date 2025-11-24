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
        </>
    );
};

export default FormNuevaMateria;