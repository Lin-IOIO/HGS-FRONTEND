import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Boton from '../../componentes/UI/Boton.jsx'; 
import './GestionMateriasCoordinador.css';

const materiasSimuladas = [
    { id: 1, nombre: 'Matemáticas', profesor: 'Juliana Esquivero Vargas', color: '#ff8686', tienePlan: true },
    { id: 2, nombre: 'Biología', profesor: 'Marcelo Mengolini', color: '#ffc671ff', tienePlan: false },
];

const GestionMateriasCoordinador = () => {
    const { idCurso } = useParams();
    const navigate = useNavigate();
    const nombreCurso = idCurso.replace('-', ' '); // '2do-3ra' -> '2do 3ra'

    const handleAgregarPlan = (materiaId, nombreMateria) => {
        // Navegamos a la vista de carga de plan de estudio
        navigate(`/coordinador/cursos/${idCurso}/plan/${materiaId}`);
    };

    return (
        <div className="coordinador-materias-container">
            <header className="materias-header">
                <h1 className="curso-titulo-grande">{nombreCurso}</h1> {/* */}
            </header>
            
            <section className="materias-listado-section">
                <h2 className="materias-subtitulo">Materias Asignadas:</h2>

                <div className="materias-list">
                    {materiasSimuladas.map(materia => (
                        <div key={materia.id} className="materia-card-coordinador" style={{ backgroundColor: materia.color }}>
                            
                            <div className="materia-info-header">
                                <span className="materia-nombre">{materia.nombre}</span> {/* */}

                                 {!materia.tienePlan ? (
                                     <div className="plan-actions-button">
                                        <Boton 
                                            onClick={() => handleAgregarPlan(materia.id, materia.nombre)} 
                                            className="btn-agregar-plan"
                                        >
                                            <i className="fas fa-plus"></i> Agregar Plan
                                        </Boton>
                                    </div>
                                 ):(null)}
                            </div>
                            
                            <div className="materia-info-footer">
                                <span>Profesor/a: {materia.profesor}</span> {/* */}
                                
                                {materia.tienePlan ? (
                                    // Indicador de "Con Plan de Estudio"
                                    <span className="plan-status plan-con">
                                        Con Plan De Estudio
                                    </span>
                                ) : (
                                    <div className="plan-actions">

                                        <span className="plan-status plan-sin">
                                            Sin Plan De Estudio
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default GestionMateriasCoordinador;