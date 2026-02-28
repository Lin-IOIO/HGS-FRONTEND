import './InicioCursos.css';
import { API } from 'apis/constantes.js';
import { useGet } from 'hooks/useGet.js';
import { useDelete } from 'hooks/useDelete.js';
import { useAlerta } from '../../contexto/alerta';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Boton from '../../componentes/UI/Boton';

const colores = ['#f8c87f', '#f57e84', '#a68ee8', '#e88ee8', '#a8f599'];

const InicioCursos = () => {
    const urlCursos = `${API}/cursos`;
    const [dataCursos, loading, error] = useGet(urlCursos, []); 
    console.log()
    
    const navigate = useNavigate();
    const { alerta } = useAlerta();
    const { ejecutarEliminacion, cargando: eliminando, error: errorEliminar } = useDelete();

    const [cursos, setCursos] = useState([]);
    const [filtroTurno, setFiltroTurno] = useState('');
    const [cursoEnEliminacion, setCursoEnEliminacion] = useState(null);

    useEffect(() => {
        if (dataCursos) {
            setCursos(dataCursos);
        }
    }, [dataCursos]);
    
    const handleCardClick = (curso) => {
        navigate(`/admin/cursos/${curso.id}`);
        
    };

    const handleEditar = (e, curso) => {
        e.stopPropagation();
        navigate('/admin/cursos/crear', { state: { cursoAEditar: curso } });
    };

    const handleEliminar = (e, curso) => {
        e.stopPropagation();

        alerta({
            titulo: "¿Confirmar Eliminación?",
            descripcion: `¿Estás seguro de eliminar el curso ${curso.nombre}?`,

            onClick: async () => {
                const cursoId = curso.id;
                const url = `${API}/cursos/${cursoId}`;

                setCursoEnEliminacion(cursoId);

                const exito = await ejecutarEliminacion(url);

                setCursoEnEliminacion(null);

                if (exito) {
                    const nuevaLista = cursos.filter(c => c.id !== cursoId);
                    setCursos(nuevaLista); 
                    
                    alerta({
                        titulo: "Curso Eliminado",
                        descripcion: "El curso ha sido eliminado con éxito.",
                        onClick: () => {}
                    });
                } else {
                    alerta({
                        titulo: "Error al Eliminar",
                        descripcion: `Ocurrió un error: ${errorEliminar?.message || 'Error de conexión.'}`,
                    });
                }
            }
        });
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
                    <i className="fas fa-plus"></i>  Nuevo Curso
                </Boton>
            </header>

            <div className="cursos-grid">
                {cursosFiltrados.map((curso, index) => {
                    const idCurso = curso.id;
                    const color = colores[index % colores.length];
                    const estaEliminando = eliminando && cursoEnEliminacion === idCurso;

                    return (
                        <div
                            key={idCurso}
                            className="curso-card"
                            style={{ backgroundColor: color }}
                            onClick={() => handleCardClick(curso)}
                        >
                            <div className="card-curso-nombre-wrapper">
                                <span className="curso-nombre">{curso.nombre}</span>
                                <span className="curso-turno">{curso.turno}</span>
                            </div>
                            <div className="card-footer">
                                <p>Materias asignadas: {curso.materias ? curso.materias.length : 0}</p>

                                <div className="card-acciones">
                                    <button
                                        className="icono-accion icono-editar"
                                        onClick={(e) => handleEditar(e, curso)}
                                        title="Editar Curso"
                                        disabled={estaEliminando}
                                    >
                                        <i className="fas fa-pencil-alt"></i>
                                    </button>
                                    <button
                                        className="icono-accion icono-eliminar"
                                        onClick={(e) => handleEliminar(e, curso)}
                                        title="Eliminar Curso"
                                        disabled={estaEliminando}
                                    >
                                        {estaEliminando ? '...' : <i className="fas fa-trash-alt"></i>}
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}

                {cursosFiltrados.length === 0 && (
                    <p className="no-cursos-msg">No se encontraron cursos.</p>
                )}
            </div>
        </div>
    );
};

export default InicioCursos;