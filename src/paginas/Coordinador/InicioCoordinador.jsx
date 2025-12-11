import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './InicioCoordinador.css'; 

// const cursosSimulados = [
//     // { id: '2do-3ra', nombre: '2do 3ra', materiasSinPlan: 1, color: '#ffcc80', turno: 'Mañana' },
//     // { id: '5to-1ra', nombre: '5to 1ra', materiasSinPlan: 0, color: '#ff9999', turno: 'Tarde' },
//     // { id: '1ro-8va', nombre: '1ro 8va', materiasSinPlan: 0, color: '#b3a0ff', turno: 'Vespertino' },
//     // { id: '2do-4ta', nombre: '2do 4ta', materiasSinPlan: 2, color: '#e699ff', turno: 'Mañana' },
//     // { id: '5to-3ra', nombre: '5to 3ra', materiasSinPlan: 1, color: '#99ff99', turno: 'Tarde' },
//     {id: "", año:"", division:"", turno:""}
// ];

const InicioCoordinador = () => {
    const navigate = useNavigate();

    const [filtroTurno, setFiltroTurno] = useState(''); // '' significa "Todos"

    const handleVerMaterias = (cursoId) => {
        navigate(`/coordinador/cursos/${cursoId}`);
    };

    const cursosFiltrados = filtroTurno
        ? cursosSimulados.filter(curso => curso.turno === filtroTurno)
        : cursosSimulados;

    return (
        <div className="coordinador-container">
            <header className="coordinador-header">
                <div className="header-left"> 
                    <h1 className="cursos-titulo">Todos los cursos</h1>

                    <div className="filtro-container">
                        <label htmlFor="filtroTurno"><i className="fas fa-filter"></i> Filtrar por:</label>
                        <select
                            id="filtroTurno"
                            className="filtro-select" // Clase genérica
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
            </header>

            
            <div className="cursos-coo-grid">
                {cursosFiltrados.map(curso => (
                    <div
                        key={curso.id}
                        className="curso-card"
                        style={{ backgroundColor: curso.color }}
                        onClick={() => handleVerMaterias(curso.id)}
                    >

                        <div className="card-curso-nombre-wrapper">
                            <span className="curso-nombre">{curso.nombre}</span>
                            <span className="curso-turno">{curso.turno}</span>
                        </div>

                        <div className="card-footer">
                            <p>Materias sin Plan de Estudio: {curso.materiasSinPlan}</p>
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

export default InicioCoordinador;