import React, { useState } from 'react';
import Boton from '../../componentes/UI/Boton.jsx'; 
import './FormNuevaMateria.css'; 

// Datos simulados para los profesores (Docentes)
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
    const [nombreMateria, setNombreMateria] = useState('');
    const [profesorAsignado, setProfesorAsignado] = useState('');
    const [busquedaProfesor, setBusquedaProfesor] = useState('');
    
    // Lista filtrada de profesores basada en la búsqueda
    const profesoresFiltrados = profesoresSimulados.filter(profesor => 
        profesor.toLowerCase().includes(busquedaProfesor.toLowerCase())
    );

    const handleSubmit = (e) => {
        e.preventDefault();
        if (nombreMateria && profesorAsignado) {
            alGuardar({ nombreMateria, profesorAsignado });
        } else {
            alert('Por favor, completa todos los campos.');
        }
    };
    
    // Función para manejar la selección de un profesor
    const handleProfesorSelect = (nombre) => {
        setProfesorAsignado(nombre);
        setBusquedaProfesor(''); // Cerrar la lista de búsqueda
    }

    return (
        <div className="nueva-materia-container">
            <h1 className="titulo-formulario-materia">Nueva Materia</h1>
            
            <form onSubmit={handleSubmit}>
                
                {/* 1. CAMPO MATERIA */}
                <div className="form-group-materia">
                    <label htmlFor="materia">Materia</label>
                    <input
                        type="text"
                        id="materia"
                        placeholder="Nombre de Materia"
                        value={nombreMateria}
                        onChange={(e) => setNombreMateria(e.target.value)}
                        className="form-input-materia"
                    />
                </div>

                {/* 2. CAMPO PROFESOR ASIGNADO (Simulación de búsqueda/selector) */}
                <div className="form-group-materia">
                    <label htmlFor="profesor">Profesor Asignado</label>
                    
                    {/* Input que muestra el profesor seleccionado o permite buscar */}
                    <div className="custom-selector-wrapper">
                        <input
                            type="text"
                            id="profesor"
                            value={profesorAsignado || busquedaProfesor}
                            onChange={(e) => setBusquedaProfesor(e.target.value)}
                            placeholder="Buscar Profesor"
                            className="form-input-materia profesor-input"
                        />
                        <i className="fas fa-search search-icon"></i>
                        
                        {/* Dropdown de Profesores Filtrados */}
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

                {/* 3. BOTÓN GUARDAR */}
                <div className="form-actions-materia">
                    <Boton type="submit">Guardar</Boton>
                    <Boton onClick={alCancelar} style={{marginLeft: '10px'}} variante="secundaria">Cancelar</Boton>
                </div>
            </form>
        </div>
    );
};

export default FormNuevaMateria;