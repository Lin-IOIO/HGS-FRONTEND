import React, { useMemo } from 'react';
import { API } from 'apis/constantes.js';
import { useGet } from 'hooks/useGet.js';
import { useAuth } from '../../contexto/conAutenticacion';
import Boton from '../../componentes/UI/Boton.jsx';
import './InicioProfesor.css';

const InicioProfesor = () => {
    const { user } = useAuth();

    const urlCursoMaterias = `${API}/curso-materias`;
    const urlPlanes = `${API}/planes`;

    const [cursoMaterias, loadingMaterias, errorMaterias] = useGet(urlCursoMaterias, []);
    const [planes, loadingPlanes, errorPlanes] = useGet(urlPlanes, []);

    const materiasDelProfesor = useMemo(() => {
        if (!Array.isArray(cursoMaterias)) return [];
        return cursoMaterias.filter((cm) => cm.id_profesor === user?.id);
    }, [cursoMaterias, user]);

    const planesPorCursoMateria = useMemo(() => {
        const mapa = new Map();
        if (Array.isArray(planes)) {
            planes.forEach((plan) => {
                mapa.set(plan.id_curso_materia, plan);
            });
        }
        return mapa;
    }, [planes]);

    const handleDescargar = (plan) => {
        if (!plan?.link_descarga) return;
        window.open(plan.link_descarga, '_blank');
    };

    if (loadingMaterias || loadingPlanes) {
        return <div className="profesor-container"><p>Cargando materias...</p></div>;
    }

    if (errorMaterias || errorPlanes) {
        return (
            <div className="profesor-container">
                <p className="error-msg">Error al cargar datos. Intente nuevamente.</p>
            </div>
        );
    }

    return (
        <div className="profesor-container">
            <header className="profesor-header">
                <h1>Mis Materias</h1>
                <p>Materias asignadas y acceso a planes de estudio.</p>
            </header>

            {materiasDelProfesor.length === 0 ? (
                <p>No tenés materias asignadas.</p>
            ) : (
                <div className="profesor-materias-grid">
                    {materiasDelProfesor.map((materia) => {
                        const plan = planesPorCursoMateria.get(materia.id);
                        return (
                            <div key={materia.id} className="profesor-materia-card">
                                <div className="materia-info">
                                    <h3>{materia.materia_nombre}</h3>
                                    <p>{materia.curso_nombre} - {materia.turno}</p>
                                </div>
                                <div className="materia-actions">
                                    {plan?.link_descarga ? (
                                        <Boton onClick={() => handleDescargar(plan)} className="ui-boton-principal">
                                            Descargar Plan
                                        </Boton>
                                    ) : (
                                        <span className="plan-vacio">Sin plan cargado</span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default InicioProfesor;
