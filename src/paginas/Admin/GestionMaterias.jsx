import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Boton from '../../componentes/UI/Boton.jsx'; 
import './GestionMaterias.css'; 
import FormNuevaMateria from './FormNuevaMateria.jsx';

// Datos simulados (como se ve en image_49877e.png)
const materiasSimuladas = [
    { id: 1, nombre: 'Matemáticas', profesor: 'Juliana Esquivero Vargas', color: '#ff7f7f' },
    { id: 2, nombre: 'Biología', profesor: 'Marcelo Mengolini', color: '#f8c07f' },
];

const GestionMaterias = () => {
    // Usamos useParams para obtener el ID (nombre) del curso de la URL
    let { idCurso } = useParams();
    // Limpiamos el nombre para mostrarlo (ej: '2do-3ra' -> '2do 3ra')
    const nombreCurso = idCurso.replace('-', ' '); 

    const [isCreating, setIsCreating] = useState(false);
    
    // Función de ejemplo para crear materia
    const handleCrearMateria = (datosMateria) => {
        console.log(`Creando materia para ${nombreCurso}:`, datosMateria);
        setIsCreating(false);
    }
    
    // Si estamos creando, mostramos el formulario
    if (isCreating) {
        return (
            <div className="gestion-materias-container">
                <FormNuevaMateria 
                    alGuardar={handleCrearMateria} 
                    alCancelar={() => setIsCreating(false)} 
                />
            </div>
        );
    }

    return (
        <div className="gestion-materias-container">
            <header className="materias-header">
                {/* Título grande del curso (ej: 2do 3ra) */}
                <h1 className="curso-titulo-grande">{nombreCurso}</h1>
            </header>
            
            <section className="materias-listado-section">
                <div className="materias-listado-header">
                    {/* Título 'materias asignadas:' */}
                    <h2 className="materias-subtitulo">Materias Asignadas:</h2>
                    
                    {/* Botón '+ Nueva Materia' */}
                    <Boton onClick={() => setIsCreating(true)} className="ui-boton-principal">
                        <i className="fas fa-plus"></i>  Nueva Materia
                    </Boton>
                </div>

                <div className="materias-grid">
                    {materiasSimuladas.map(materia => (
                        <div key={materia.id} className="materia-card">
                            {/* Color de fondo degradado (simulado con style) */}
                            <div className="materia-info-header" style={{ backgroundColor: materia.color }}>
                                <span className="materia-nombre">{materia.nombre}</span>
                            </div>
                            {/* Información del profesor */}
                            <div className="materia-info-footer">
                                Profesor/a: {materia.profesor}
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default GestionMaterias;