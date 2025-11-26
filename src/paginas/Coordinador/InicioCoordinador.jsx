import React from 'react';
import { useNavigate } from 'react-router-dom';
import './InicioCoordinador.css';

// Datos simulados basados en la imagen
const cursosSimulados = [
    { id: '2do-3ra', nombre: '2do 3ra', materiasSinPlan: 1, color: '#ffcc80' },
    { id: '5to-1ra', nombre: '5to 1ra', materiasSinPlan: 0, color: '#ff9999' },
    { id: '1ro-8va', nombre: '1ro 8va', materiasSinPlan: 0, color: '#b3a0ff' },
    { id: '2do-4ta', nombre: '2do 4ta', materiasSinPlan: 2, color: '#e699ff' },
    { id: '5to-3ra', nombre: '5to 3ra', materiasSinPlan: 1, color: '#99ff99' },
];

const InicioCoordinador = () => {
    const navigate = useNavigate();
    const nombreUsuario = "Matías Ponce"; 

    const handleVerMaterias = (cursoId) => {
        navigate(`/coordinador/cursos/${cursoId}`); 
    };

    return (
        <div className="coordinador-container">
            <header className="coordinador-header">
                <h1 className="cursos-titulo">Todos los cursos</h1> 
            </header>

            <div className="cursos-coo-grid">
                {cursosSimulados.map(curso => (
                    <div 
                        key={curso.id} 
                        className="curso-card" // Clase actualizada para el nuevo estilo
                        style={{ backgroundColor: curso.color }} 
                        onClick={() => handleVerMaterias(curso.id)} 
                    >
                        {/* El ícono de edición ha sido eliminado para coincidir con el estilo Admin */}
                        
                        {/* Wrapper para el nombre del curso (parte de color) */}
                        <div className="card-curso-nombre-wrapper">
                            <span className="curso-nombre">{curso.nombre}</span>
                        </div>
                        
                        {/* Footer (parte blanca) */}
                        <div className="card-footer">
                            <p>Materias sin Plan de Estudio: {curso.materiasSinPlan}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default InicioCoordinador;