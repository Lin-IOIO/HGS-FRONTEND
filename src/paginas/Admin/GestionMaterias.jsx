import React, { useState, useEffect } from 'react'; // Agregamos useState y useEffect
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios'; // Importamos axios
import Boton from '../../componentes/UI/Boton.jsx'; 
import './GestionMaterias.css'; 

// URL base de la API (Ajustar según tu backend)
const API_BASE_URL = 'http://localhost:5000/api'; 
// Usaremos: GET /api/cursos/:idCurso/materias

const GestionMaterias = () => {
    let { idCurso } = useParams(); // idCurso es el ID real del curso
    const navigate = useNavigate();
    
    // Estados para la gestión de datos y UI
    const [materias, setMaterias] = useState([]); 
    const [isLoading, setIsLoading] = useState(true); 
    const [mensajeError, setMensajeError] = useState(null); 

    // Si idCurso existe, lo formateamos (asumiendo que viene como un slug o ID)
    const nombreCurso = idCurso ? idCurso.replace('-', ' ') : 'Gestión de Materias'; 

    // ===============================================
    // 1. LÓGICA DE CARGA DE DATOS (GET Materias por Curso)
    // ===============================================

    const cargarMaterias = async () => {
        if (!idCurso) {
            setMensajeError("ID de Curso no especificado en la URL.");
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setMensajeError(null);
        const token = localStorage.getItem('authToken');

        if (!token) {
            setMensajeError("Token no encontrado. Redirigiendo al Login.");
            setIsLoading(false);
            return;
        }
        
        // Asumimos el endpoint: /api/cursos/:idCurso/materias
        const url = `${API_BASE_URL}/cursos/${idCurso}/materias`;

        try {
            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${token}` 
                }
            });
            // Asumiendo que response.data es el array de materias para ese curso
            setMaterias(response.data);
        } catch (error) {
            console.error(`Error al cargar materias para el curso ${idCurso}:`, error);
            if (error.response && error.response.status === 401) {
                setMensajeError("Sesión expirada o no autorizada.");
            } else {
                setMensajeError("Error de conexión al servidor. No se pudieron cargar las materias.");
            }
            setMaterias([]); // Limpiar la lista de materias en caso de error
        } finally {
            setIsLoading(false);
        }
    };

    // Efecto para cargar las materias cuando el componente monta o idCurso cambia
    useEffect(() => {
        cargarMaterias();
    }, [idCurso]); 

    // ===============================================
    // 2. HANDLERS DE ACCIÓN
    // ===============================================

    const handleCrearMateria = () => {
        // Al crear, pasamos el idCurso al estado para que el formulario sepa a qué curso pertenece
        navigate('/admin/materias/crear', { state: { idCurso } });
    };

    const handleModificarMateria = (materia) => {
        // Al modificar, enviamos el idCurso y la materia a editar
        navigate('/admin/materias/editar', { state: { materiaAEditar: materia, idCurso } });
    };
    
    // Función para manejar la eliminación de una materia
    const handleEliminarMateria = async (materiaId, nombreMateria) => {
        // Usamos window.confirm ya que no se nos ha proporcionado un modal de confirmación personalizado
        if (!window.confirm(`¿Estás seguro de que quieres eliminar la materia "${nombreMateria}"? Esta acción es irreversible.`)) {
            return;
        }

        const token = localStorage.getItem('authToken');
        if (!token) {
            setMensajeError("Token no encontrado.");
            return;
        }

        // Asumimos el endpoint DELETE: /api/materias/:materiaId
        const url = `${API_BASE_URL}/materias/${materiaId}`;

        try {
            await axios.delete(url, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Si es exitoso, actualizamos la lista de materias localmente
            setMaterias(prev => prev.filter(m => m.id !== materiaId));
            // Deberías usar el componente Notificacion para esto en tu aplicación real
            alert(`Materia "${nombreMateria}" eliminada exitosamente.`); 
        } catch (error) {
            console.error('Error al eliminar materia:', error.response?.data || error.message);
            setMensajeError("Error al eliminar la materia. Por favor, intente de nuevo.");
        }
    };


    // ===============================================
    // 3. RENDERIZADO
    // ===============================================

    return (
        <div className="gestion-materias-container">
            
            {/* Mensaje de Error */}
            {mensajeError && (
                <div className="alerta-error">
                    ❌ {mensajeError}
                </div>
            )}

            <header className="materias-header">
                <h1 className="curso-titulo-grande">Curso: {nombreCurso}</h1>
            </header>
            
            <section className="materias-listado-section">
                <div className="materias-listado-header">
                    <h2 className="materias-subtitulo">Materias Asignadas:</h2>
                    <Boton onClick={handleCrearMateria} className="ui-boton-principal">
                        <i className="fas fa-plus"></i>  Nueva Materia
                    </Boton>
                </div>

                {/* Renderizado Condicional */}
                {isLoading ? (
                    <p className="loading-message">Cargando materias...</p>
                ) : materias.length === 0 ? (
                    <p className="empty-message">No hay materias asignadas a este curso.</p>
                ) : (
                    <div className="materias-grid">
                        {materias.map(materia => (
                            <div key={materia.id} className="materia-card">
                                <div className="materia-info-header" style={{ backgroundColor: materia.color || '#3b82f6' }}>
                                    <span className="materia-nombre">{materia.nombre}</span>
                                    {/* Botón de Modificar */}
                                    <Boton
                                        onClick={() => handleModificarMateria(materia)}
                                        className="btn-accion-card btn-editar" 
                                    >
                                        <i className="fas fa-edit"></i> 
                                    </Boton>
                                    {/* Botón de Eliminar */}
                                    <Boton
                                        onClick={() => handleEliminarMateria(materia.id, materia.nombre)}
                                        className="btn-accion-card btn-eliminar" 
                                        style={{ backgroundColor: '#e74c3c' }}
                                    >
                                        <i className="fas fa-trash-alt"></i> 
                                    </Boton>
                                </div>
                                <div className="materia-info-footer">
                                    Profesor/a: 
                                    <span style={{ fontWeight: materia.profesor ? 'normal' : 'italic', color: materia.profesor ? '#333' : '#e74c3c' }}>
                                        {materia.profesor || 'Sin Asignar'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};

export default GestionMaterias;