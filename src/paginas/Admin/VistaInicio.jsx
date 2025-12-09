import './VistaInicio.css'; 
import { API } from '../../apis/constantes.js';
import { useGet } from '../../hooks/useGet.js';


const VistaInicio = () => {
    const urlResumen = `${API}/usuarios/resumen`;
    const [resumen, cargandoResumen, errorResumen] = useGet(urlResumen);

    const urlCursos = `${API}/cursos/activos`;
    const [cursos, cargandoCursos, errorCursos] = useGet(urlCursos)

    return (
        <div className="admin-inicio-container">
            <h1>Bienvenido, Secretario/a</h1>
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
                            <h3>Materias por Asignar</h3>
                            <p>Cursos pendientes de asignación de materias.</p>
                            <span className="card-dato"></span>
                        </div>
                    </div>
            </section>
        </div>
    );
};

export default VistaInicio;