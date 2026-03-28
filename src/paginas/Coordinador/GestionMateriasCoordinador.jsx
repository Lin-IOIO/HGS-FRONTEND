import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { API } from 'apis/constantes.js';
import { useGet } from 'hooks/useGet.js';
import Boton from '../../componentes/UI/Boton.jsx'; 
import './GestionMateriasCoordinador.css';

const GestionMateriasCoordinador = () => {
    const { idCurso } = useParams();
    const navigate = useNavigate();

    const urlCursoMaterias = `${API}/curso-materias`;
    const urlPlanes = `${API}/planes`;
    const urlProfesores = `${API}/usuarios/profesores`;

    const [cursoMaterias, loadingMaterias] = useGet(urlCursoMaterias, []);
    const [planes, loadingPlanes] = useGet(urlPlanes, []);
    const [profesores, loadingProfesores] = useGet(urlProfesores, []);

    const mapaProfesores = useMemo(() => {
        const mapa = new Map();
        if (Array.isArray(profesores)) {
            profesores.forEach((p) => {
                mapa.set(p.id, `${p.nombre} ${p.apellido}`);
            });
        }
        return mapa;
    }, [profesores]);

    const planesPorCursoMateria = useMemo(() => {
        const mapa = new Map();
        if (Array.isArray(planes)) {
            planes.forEach((plan) => {
                mapa.set(plan.id_curso_materia, plan);
            });
        }
        return mapa;
    }, [planes]);

    const materiasDelCurso = useMemo(() => {
        if (!Array.isArray(cursoMaterias)) return [];
        return cursoMaterias.filter((cm) => cm.id_curso === Number(idCurso));
    }, [cursoMaterias, idCurso]);

    const handleGestionarPlan = (materia) => {
        navigate(`/coordinador/cursos/${idCurso}/plan/${materia.id}`, {
            state: { 
                nombreMateria: materia.materia_nombre,
                cursoMateriaId: materia.id,
                planExistente: planesPorCursoMateria.get(materia.id) || null
            }
        });
    };

    const handleDescargarPlan = (plan) => {
        if (!plan?.link_descarga) return;
        window.open(plan.link_descarga, '_blank');
    };

    if (loadingMaterias || loadingPlanes || loadingProfesores) {
        return <div className="coordinador-materias-container"><p>Cargando materias...</p></div>;
    }

    return (
        <div className="coordinador-materias-container">
            <header className="materias-header">
                <h1 className="curso-titulo-grande">Curso {idCurso}</h1>
            </header>
            
            <section className="materias-listado-section">
                <h2 className="materias-subtitulo">Materias Asignadas:</h2>

                <div className="materias-list">
                    {materiasDelCurso.map(materia => {
                        const plan = planesPorCursoMateria.get(materia.id);
                        const profesorNombre = mapaProfesores.get(materia.id_profesor) || 'Sin Asignar';
                        const tienePlan = Boolean(plan);

                        return (
                            <div key={materia.id} className="materia-card-coordinador" style={{ backgroundColor: '#f6f6f6' }}>
                                
                                <div className="materia-info-header">
                                    <span className="materia-nombre">{materia.materia_nombre}</span>
                                    <div className="header-actions">
                                        {tienePlan ? (
                                            <div className="plan-existing-actions">
                                                <button 
                                                    className="btn-icon-action btn-descargar"
                                                    onClick={() => handleDescargarPlan(plan)}
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
                                    <span>Profesor/a: {profesorNombre}</span>
                                    
                                    {tienePlan ? (
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
                        );
                    })}

                    {materiasDelCurso.length === 0 && (
                        <p>Actualmente no hay materias asignadas.</p>
                    )}
                </div>
            </section>
        </div>
    );
};

export default GestionMateriasCoordinador;
