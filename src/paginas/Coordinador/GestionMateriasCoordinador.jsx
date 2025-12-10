import React from 'react';
import { useParams, useLocation } from 'wouter';
import { useNavigate } from 'react-router-dom';
import Boton from '../../componentes/UI/Boton.jsx'; 
import './GestionMateriasCoordinador.css';

const materiasSimuladas = [
    { id: 1, nombre: 'Matemáticas', profesor: 'Juliana Esquivero Vargas', color: '#ff8686', tienePlan: true, archivoNombre: 'Plan_Matematicas_2024.pdf' },
    { id: 2, nombre: 'Biología', profesor: 'Marcelo Mengolini', color: '#ffc671ff', tienePlan: false, archivoNombre: null },
];

const GestionMateriasCoordinador = () => {
    const { idCurso } = useParams();
    const navigate = useNavigate();
    const nombreCurso = idCurso.replace('-', ' ');

    const handleGestionarPlan = (materia) => {
        navigate(`/coordinador/cursos/${idCurso}/plan/${materia.id}`, {
            state: { 
                nombreMateria: materia.nombre,
                archivoExistente: materia.archivoNombre
            }
        });
    };
    const handleDescargarPlan = (nombreArchivo) => {
        alert(`Descargando archivo: ${nombreArchivo}...`);
    };

    return (
        <div className="coordinador-materias-container">
            <header className="materias-header">
                <h1 className="curso-titulo-grande">{nombreCurso}</h1>
            </header>
            
            <section className="materias-listado-section">
                <h2 className="materias-subtitulo">Materias Asignadas:</h2>

                <div className="materias-list">
                    {materiasSimuladas.map(materia => (
                        <div key={materia.id} className="materia-card-coordinador" style={{ backgroundColor: materia.color }}>
                            
                            <div className="materia-info-header">
                                <span className="materia-nombre">{materia.nombre}</span>
                                <div className="header-actions">
                                    {materia.tienePlan ? (
                                        <div className="plan-existing-actions">
                                            <button 
                                                className="btn-icon-action btn-descargar"
                                                onClick={() => handleDescargarPlan(materia.archivoNombre)}
                                                title="Descargar Plan"
                                            >
                                                <i className="fas fa-download"></i>
                                            </button>
                                            <Boton 
                                                onClick={() => handleGestionarPlan(materia)} 
                                                className="btn-modificar-plan"
                                            >
                                                <i className="fas fa-pen"></i> Modificar
                                            </Boton>
                                        </div>
                                    ) : (
                                        <div className="plan-actions-button">
                                            <Boton 
                                                onClick={() => handleGestionarPlan(materia)} 
                                                className="btn-agregar-plan"
                                            >
                                                <i className="fas fa-plus"></i> Agregar Plan
                                            </Boton>
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            <div className="materia-info-footer-coo">
                                <span>Profesor/a: {materia.profesor}</span>
                                
                                {materia.tienePlan ? (
                                    <span className="plan-status plan-con">
                                        <i className="fas fa-check-circle"></i> Con Plan De Estudio
                                    </span>
                                ) : (
                                    <span className="plan-status plan-sin">
                                        Sin Plan De Estudio
                                    </span>
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