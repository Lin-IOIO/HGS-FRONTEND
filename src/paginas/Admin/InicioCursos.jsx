import './InicioCursos.css'; 
import { API } from 'apis/constantes.js';
import { useGet } from 'hooks/useGet.js';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Boton from '../../componentes/UI/Boton';

const colores = ['#f8c87f', '#f57e84', '#a68ee8', '#e88ee8', '#a8f599'];

const InicioCursos = () => {
    const urlCursos = `${API}/cursos`;
    const [cursos, loading, error] = useGet(urlCursos, []);
    const navigate = useNavigate();

    const [filtroTurno, setFiltroTurno] = useState('');

    const handleCardClick = (cursoId) => {
        navigate(`/admin/cursos/${cursoId}`); 
    };

    const handleCrearCurso = () => {
        navigate('crear'); 
    };
    const cursosFiltrados = filtroTurno 
        ? cursos.filter(curso => curso.turno === filtroTurno)
        : cursos;

    if (loading) {
        return <div className="inicio-cursos-container"><p>Cargando cursos...</p></div>;
    }

    if (error) {
        return (
            <div className="inicio-cursos-container">
                <p className="error-msg">{error}</p>
                <Boton onClick={() => window.location.reload()}>Reintentar</Boton>
            </div>
        );
    }

    return (
        <div className="inicio-cursos-container">
            <header className="inicio-cursos-header">
                <div className="header-left">
                    <h1 className="titulo-cursos-existentes">Cursos Existentes</h1>
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
                {cursos.map((curso, index) =>(
                    <div 
                        key={curso._id || index} // Preferible usar ID real de la BD
                        className="curso-card"
                        style={{ backgroundColor: colores[index % colores.length] }} 
                        onClick={() => handleCardClick(curso._id || curso.nombre)}
                    >
                        <div className="card-curso-nombre-wrapper">
                            <span className="curso-nombre">{curso.nombre}</span> 
                            <span className="curso-turno">{curso.turno}</span>
                        </div>
                        
                        <div className="card-footer">
                            <p>Materias asignadas: {curso.materias ? curso.materias.length : 0}</p>
                        </div>
                    </div>
                ))}
                
                {cursosFiltrados.length === 0 && (
                    <p className="no-cursos-msg">No se encontraron cursos.</p>
                )}
            </div>
        </div>
    );
};

export default InicioCursos;