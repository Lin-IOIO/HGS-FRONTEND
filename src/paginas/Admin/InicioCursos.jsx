import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Boton from '../../componentes/UI/Boton.jsx'; 
import './InicioCursos.css'; 

// 1. Actualizamos datos simulados con la propiedad 'turno'
const cursosSimulados = [
    { nombre: '2do 3ra', materias: 2, color: '#f8c07f', turno: 'Mañana' },
    { nombre: '5to 1ra', materias: 1, color: '#f57e84', turno: 'Tarde' },
    { nombre: '1ro 8va', materias: 1, color: '#a68ee8', turno: 'Vespertino' },
    { nombre: '2do 4ta', materias: 3, color: '#e88ee8', turno: 'Mañana' },
    { nombre: '5to 3ra', materias: 1, color: '#a8f599', turno: 'Tarde' },
];

const InicioCursos = () => {
    const navigate = useNavigate();
    
    // 2. Estado para el filtro
    const [filtroTurno, setFiltroTurno] = useState(''); // '' significa "Todos"

    const handleCardClick = (cursoId) => {
        navigate(`/admin/cursos/${cursoId}`); 
    };

    const handleCrearCurso = () => {
        navigate('crear'); 
    };

    // 3. Lógica de filtrado
   const cursosFiltrados = filtroTurno 
    ? cursosSimulados.filter(curso => curso.turno === filtroTurno)
    : cursosSimulados;

    return (
        <div className="inicio-cursos-container">
            <header className="inicio-cursos-header">
                <div className="header-left">
                    <h1 className="titulo-cursos-existentes">Cursos Existentes</h1>
                    
                    {/* 4. Selector de Filtro (Estilo simple inline) */}
                    <div className="filtro-container">
                        <label htmlFor="filtroTurno"><i className="fas fa-filter"></i> Filtrar por:</label>
                        <select 
                            id="filtroTurno"
                            className="filtro-select"
                            value={filtroTurno} 
                            onChange={(e) => setFiltroTurno(e.target.value)}
                        >
                            <option value="">Todos los Turnos</option>
                            <option value="Mañana">Turno Mañana</option>
                            <option value="Tarde">Turno Tarde</option>
                            <option value="Vespertino">Turno Vespertino</option>
                        </select>
                    </div>
                </div>

                <Boton 
                    onClick={handleCrearCurso}
                    className="ui-boton-principal"
                >
                    <i className="fas fa-plus"></i>  Nuevo Curso 
                </Boton>
            </header>

            <div className="cursos-grid">
                {cursosFiltrados.map((curso, index) =>(
                    <div 
                        key={index} 
                        className="curso-card"
                        style={{ backgroundColor: curso.color }}
                        onClick={() => handleCardClick(curso.nombre.replace(' ', '-'))}
                    >
                        <div className="card-curso-nombre-wrapper">
                            <span className="curso-nombre">{curso.nombre}</span>
                            {/* 5. MOSTRAR EL TURNO DEBAJO DEL NOMBRE */}
                            <span className="curso-turno">{curso.turno}</span>
                        </div>
                        
                        <div className="card-footer">
                            <p>Materias asignadas: {curso.materias}</p>
                        </div>
                    </div>
                ))}
                
                {cursosFiltrados.length === 0 && (
                    <p className="no-cursos-msg">No se encontraron cursos para este turno.</p>
                )}
            </div>
        </div>
    );
};

export default InicioCursos;