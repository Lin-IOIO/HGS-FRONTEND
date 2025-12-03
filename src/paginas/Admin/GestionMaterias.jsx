import React from 'react'; // Quitamos useState
import { useParams, useLocation } from 'wouter';
import Boton from '../../componentes/UI/Boton.jsx'; 
import './GestionMaterias.css';

const materiasSimuladas = [
    { id: 1, nombre: 'Matemáticas', profesor: 'Juliana Esquivero Vargas', color: '#ff7f7f' },
    { id: 2, nombre: 'Biología', profesor: '', color: '#f8c07f' },
    { id: 3, nombre: 'Informática', profesor: 'Marcelo Mengolini', color: '#7fdbff' },
];

const GestionMaterias = () => {
    let { idCurso } = useParams();
    const [, navigate] = useLocation();
    
    const nombreCurso = idCurso ? idCurso.replace('-', ' ') : 'Gestión de Materias'; 

    const handleCrearMateria = () => {
        navigate('/admin/materias/crear');
    };

    const handleModificarMateria = (materia) => {
        navigate('/admin/materias/editar', { state: { materiaAEditar: materia } });
    };

    return (
        <div className="gestion-materias-container">
            <header className="materias-header">
                <h1 className="curso-titulo-grande">{nombreCurso}</h1>
            </header>
            
            <section className="materias-listado-section">
                <div className="materias-listado-header">
                    <h2 className="materias-subtitulo">Materias Asignadas:</h2>
                    <Boton onClick={handleCrearMateria} className="ui-boton-principal">
                        <i className="fas fa-plus"></i>  Nueva Materia
                    </Boton>
                </div>

                <div className="materias-grid">
                    {materiasSimuladas.map(materia => (
                        <div key={materia.id} className="materia-card">
                            <div className="materia-info-header" style={{ backgroundColor: materia.color }}>
                                <span className="materia-nombre">{materia.nombre}</span>
                                <Boton
                                    onClick={() => handleModificarMateria(materia)}
                                    className="btn-agregar-plan" 
                                    style={{ float: 'right', marginLeft: 'auto', backgroundColor: 'white', color: '#333' }}
                                >
                                    <i className="fas fa-edit"></i> Modificar
                                </Boton>
                            </div>
                            <div className="materia-info-footer">
                                Profesor/a: 
                                <span style={{ fontWeight: materia.profesor ? 'normal' : 'italic', color: materia.profesor ? '#333' : '#e74c3c' }}>
                                    {materia.profesor || 'Sin Asignar'}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default GestionMaterias;