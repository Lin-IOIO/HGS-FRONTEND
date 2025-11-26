import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // 💡 Importamos axios
import Boton from '../../componentes/UI/Boton.jsx'; 
import './CursosMain.css'; 

// URL base de la API (Ajustar según tu backend)
const API_BASE_URL = 'http://localhost:5000/api/cursos';

const CursosMain = () => {
    const navigate = useNavigate();
    
    // Estados para la gestión de datos y UI
    const [cursos, setCursos] = useState([]); // Ahora empieza vacío
    const [filtroTurno, setFiltroTurno] = useState(''); 
    const [isLoading, setIsLoading] = useState(true); // Estado de carga inicial
    const [mensajeError, setMensajeError] = useState(null); // Mensaje de error

    // ===============================================
    // 1. LÓGICA DE CARGA DE DATOS (GET)
    // ===============================================

    const cargarCursos = async () => {
        setIsLoading(true);
        setMensajeError(null);
        const token = localStorage.getItem('authToken');

        if (!token) {
            setMensajeError("Token no encontrado. Redirigiendo al Login.");
            navigate('/login');
            return;
        }

        try {
            const response = await axios.get(API_BASE_URL, {
                headers: {
                    Authorization: `Bearer ${token}` 
                }
            });
            // Asumiendo que response.data es el array de cursos
            setCursos(response.data);
        } catch (error) {
            console.error("Error al cargar cursos:", error);
            if (error.response && error.response.status === 401) {
                setMensajeError("Sesión expirada o no autorizada. Por favor, inicie sesión de nuevo.");
                localStorage.clear();
                navigate('/login');
            } else {
                setMensajeError("Error de conexión al servidor. No se pudieron cargar los cursos.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    // Efecto para cargar los cursos al montar el componente
    useEffect(() => {
        cargarCursos();
    }, []); 

    // ===============================================
    // 2. HANDLERS DE NAVEGACIÓN Y FILTRADO
    // ===============================================

    // Nota: Es posible que necesites el ID real del curso de la API, no solo el nombre
    const handleCardClick = (cursoId) => {
        navigate(`/admin/cursos/${cursoId}`); 
    };

    const handleCrearCurso = () => {
        navigate('crear'); 
    };

    // Lógica de filtrado (se mantiene igual, usando el estado 'cursos' real)
    const cursosFiltrados = filtroTurno 
        ? cursos.filter(curso => curso.turno === filtroTurno)
        : cursos;

    return (
        <div className="inicio-cursos-container">
            {/* Mensaje de Error */}
            {mensajeError && (
                <div className="alerta-error">
                    ❌ {mensajeError}
                </div>
            )}
            
            <header className="inicio-cursos-header">
                <div className="header-left">
                    <h1 className="titulo-cursos-existentes">Cursos Existentes</h1>
                    
                    {/* Selector de Filtro */}
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
                            {/* Ajustar estos valores según los datos reales de la API */}
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

            {/* Condicional de Carga y Contenido */}
            {isLoading ? (
                <p className="loading-message">Cargando lista de cursos...</p>
            ) : cursos.length === 0 ? (
                 <p className="empty-message">No se encontraron cursos en el sistema.</p>
            ) : (
                <div className="cursos-grid">
                    {cursosFiltrados.map((curso, index) =>(
                        // Asumiendo que el ID del curso viene en la propiedad 'id'
                        <div 
                            key={curso.id || index} 
                            className="curso-card"
                            // Nota: Deberías obtener el color de la API o usar una lógica consistente.
                            style={{ backgroundColor: curso.color || '#3b82f6' }}
                            // Usamos el ID real para la navegación
                            onClick={() => handleCardClick(curso.id)} 
                        >
                            <div className="card-curso-nombre-wrapper">
                                <span className="curso-nombre">{curso.nombre}</span>
                                <span className="curso-turno">{curso.turno}</span>
                            </div>
                            
                            <div className="card-footer">
                                <p>Materias asignadas: {curso.materias || 0}</p>
                            </div>
                        </div>
                    ))}
                    
                    {cursosFiltrados.length === 0 && (
                        <p className="no-cursos-msg">No se encontraron cursos para este turno.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default CursosMain;