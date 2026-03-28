import React, { useState, useEffect } from 'react';
import { API } from 'apis/constantes.js'; 
import { useGet } from 'hooks/useGet.js'; 
import { useNavigate } from 'react-router-dom';
import './InicioCoordinador.css'; 

const colores = ['#ff7f7f', '#f8c07f', '#7fdbff', '#7fffbf', '#d27fff', '#ff7fe1']

const InicioCoordinador = () => {
    const navigate = useNavigate();
    
    const urlCursos = `${API}/cursos`;
    const [dataCursos, loading, error] = useGet(urlCursos, []); 
    
    const [cursos, setCursos] = useState([]);
    const [filtroTurno, setFiltroTurno] = useState(''); 

    useEffect(() => {
        if (dataCursos) {
            setCursos(dataCursos);
        }
    }, [dataCursos]);
    
    const handleVerMaterias = (cursoId) => {
        navigate(`/coordinador/cursos/${cursoId}`);
    };

    const cursosFiltrados = filtroTurno
        ? cursos.filter(curso => curso.turno === filtroTurno)
        : cursos;

    if (loading) {
        return <div className="coordinador-container"><p>Cargando cursos...</p></div>;
    }

    if (error) {
        return (
            <div className="coordinador-container">
                <p className="error-msg">Error al cargar los cursos: {error}</p>
            </div>
        );
    }
    
    return (
        <div className="coordinador-container">
            <header className="coordinador-header">
                <div className="header-left"> 
                    <h1 className="cursos-titulo">Todos los cursos</h1>

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
            </header>

            
            <div className="cursos-coo-grid">
                {cursosFiltrados.map((curso, index) => {
                    const color = colores[index % colores.length];
                    
                    return (
                        <div
                            key={curso.id}
                            className="curso-card"
                            style={{ backgroundColor: color }} 
                            onClick={() => handleVerMaterias(curso.id)}
                        >

                            <div className="card-curso-nombre-wrapper">
                                <span className="curso-nombre">{curso.nombre}</span>
                                <span className="curso-turno">{curso.turno}</span>
                            </div>

                            <div className="card-footer">
                                <p>Materias asignadas: {curso.materias ?? 0}</p>
                            </div>
                        </div>
                    );
                })}

                {cursosFiltrados.length === 0 && (
                    <p className="no-cursos-msg">
                        No se encontraron cursos para este turno.
                    </p>
                )}
            </div>
        </div>
    );
};

export default InicioCoordinador;
