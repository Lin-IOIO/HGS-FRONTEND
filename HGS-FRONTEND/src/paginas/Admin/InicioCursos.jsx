import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Boton from '../../componentes/UI/Boton.jsx'; 
import FormCrearCursos from './FormCrearCursos'; 
import './InicioCursos.css'; 


const cursosSimulados = [
    { nombre: '2do 3ra', materias: 2, color: '#f8c07f' },
    { nombre: '5to 1ra', materias: 1, color: '#f57e84' },
    { nombre: '1ro 8va', materias: 1, color: '#a68ee8' },
    { nombre: '2do 4ta', materias: 3, color: '#e88ee8' },
    { nombre: '5to 3ra', materias: 1, color: '#a8f599' },
];

const InicioCursos = ({ alCrearCurso }) => {
    const [isCreating, setIsCreating] = useState(false);
    const navigate = useNavigate()

    const handleCardClick = (cursoId) => {
        navigate(`/admin/cursos/${cursoId}`); 
    };

    if (isCreating) {
        return (
            <FormCrearCursos 
                alEnviarCurso={alCrearCurso} 
                alCancelar={() => setIsCreating(false)}
            />
        );
    }

    return (
        <div className="inicio-cursos-container">
            <header className="inicio-cursos-header">
                <h1 className="titulo-cursos-existentes">Cursos Existentes</h1>
                <Boton 
                    onClick={() => setIsCreating(true)}
                    className="btn-nuevo-curso"
                >
                    <i className="fas fa-plus"></i>+ Nuevo Curso 
                </Boton>
            </header>

            <div className="cursos-grid">
                {cursosSimulados.map((curso, index) => (
                    <div 
                        key={index} 
                        className="curso-card"
                        style={{ backgroundColor: curso.color }}
                        onClick={() => handleCardClick(curso.nombre.replace(' ', '-'))}
                    >
                       <div className="card-curso-nombre-wrapper">
                        <span className="curso-nombre">{curso.nombre}</span>
                       </div>
                        <div className="card-footer">
                            {/* Materias asignadas */}
                            <p>Materias asignadas: {curso.materias}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default InicioCursos;