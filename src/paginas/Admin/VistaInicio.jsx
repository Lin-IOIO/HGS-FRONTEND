import './VistaInicio.css'; 
import { API } from '../../apis/constantes.js';
import { useGet } from '../../hooks/useGet.js';
import { useMemo } from 'react';


const VistaInicio = () => {
    const urlResumen = `${API}/usuarios/resumen`;
    const [resumen, cargandoResumen, errorResumen] = useGet(urlResumen);

    const urlCursos = `${API}/cursos/activos`;
    const [cursos, cargandoCursos, errorCursos] = useGet(urlCursos)

    const urlCursoMaterias = `${API}/curso-materias`;
    const [cursoMaterias, cargandoMaterias, errorMaterias] = useGet(urlCursoMaterias, []);

    const urlPlanes = `${API}/planes`;
    const [planes, cargandoPlanes, errorPlanes] = useGet(urlPlanes, []);

    const materiasSinPlan = useMemo(() => {
        if (!Array.isArray(cursoMaterias) || !Array.isArray(planes)) return 0;
        const setConPlan = new Set(planes.map((p) => p.id_curso_materia));
        return cursoMaterias.filter((cm) => !setConPlan.has(cm.id)).length;
    }, [cursoMaterias, planes]);

    return (
        <div className="admin-inicio-container">
            <h1>Bienvenido/a</h1>
            <p className="subtitulo-bienvenida">
                Utiliza el menú lateral para gestionar usuarios, cursos y materias.
            </p>

            <section className="resumen-dashboard">
                <h2>Resumen Rápido</h2>
                
                    <div className="dashboard-cards-grid">
                        <div className="info-card card-usuarios">
                            <h3>Gestión de Usuarios</h3>
                            <p>Total de Profesores y Coordinadores en el sistema.</p>
                            <span className="card-dato">{
                                cargandoResumen ? 'Cargando...' : 
                                errorResumen ? 'Error' : 
                                resumen.total
                                }</span>
                        </div>
                        <div className="info-card card-cursos">
                            <h3>Cursos Activos</h3>
                            <p>Cursos creados con Año y División asignados.</p>
                            <span className="card-dato">{
                                cargandoCursos ? 'Cargando...' : 
                                errorCursos ? 'Error' : 
                                cursos.activos
                                }</span>
                        </div>
                        <div className="info-card card-materias">
                            <h3>Materias sin Plan</h3>
                            <p>Materias creadas que aún no tienen plan de estudio.</p>
                            <span className="card-dato">{
                                cargandoMaterias || cargandoPlanes ? 'Cargando...' :
                                errorMaterias || errorPlanes ? 'Error' :
                                materiasSinPlan
                            }</span>
                        </div>
                    </div>
            </section>
        </div>
    );
};

export default VistaInicio;
