import React from 'react'; 
import { useEffect } from 'react';
import { useParams, useLocation } from 'wouter';
import { useNavigate } from 'react-router-dom';
import { API } from 'apis/constantes.js';
import { useGet } from 'hooks/useGet.js';
import Boton from '../../componentes/UI/Boton.jsx'; 
import './GestionMaterias.css';

const colores = ['#ff7f7f', '#f8c07f', '#7fdbff', '#7fffbf', '#d27fff', '#ff7fe1']

const GestionMaterias = () => {
    const urlMaterias = `${API}/materias`;
    const [materias, loading, error] = useGet(urlMaterias, []);

    let { idCurso } = useParams();
    const navigate = useNavigate();

    
    const nombreCurso = idCurso ? idCurso.replace('-', ' ') : 'Gestión de Materias'; 

    const handleCrearMateria = () => {
        navigate('/admin/materias/crear');
    };

    const handleModificarMateria = (materia) => {
        navigate('/admin/materias/editar', { state: { materiaAEditar: materia } });
    };

    if (loading) {
        return <div className="gestion-materias-container"><p>Cargando materias...</p></div>;
    }
    if (error) {
         return (
            <div className="inicio-cursos-container">
                <p className="error-msg">{error}</p>
                <Boton onClick={() => window.location.reload()}>Reintentar</Boton>
            </div>
        );
    }

    if (!materias || materias.length === 0) {
        return (
            <div className="gestion-materias-container">
                <header className="materias-header">
                    <h1 className="curso-titulo-grande">{nombreCurso}</h1>
                </header>
                <section className="materias-listado-section">
                    <div className="materias-listado-header">
                        <h2 className="materias-subtitulo">Materias Asignadas:</h2>
                        <Boton onClick={handleCrearMateria} className="ui-boton-principal">
                            <i className="fas fa-plus"></i>  Nueva Materia
                        </Boton>
                    </div>
                    <p>Actualmente no hay materias asignadas.</p>
                </section>
            </div>
        );
    }

    return (
        <div className="gestion-materias-container">
            <header className="materias-header">
                <h1 className="curso-titulo-grande">{nombreCurso}</h1>
            </header>
            
            <section className="materias-listado-section">
                <div className="materias-listado-header">
                    <h2 className="materias-subtitulo">Materias Asignadas:</h2>
                    <Boton onClick={handleCrearMateria} className="ui-boton-principal">
                        <i className="fas fa-plus"></i>  Nueva Materia
                    </Boton>
                </div>

                <div className="materias-grid">
                    {materias.map((materia, index) => (
                        <div key={materia.id} className="materia-card">
                            <div className="materia-info-header" style={{ backgroundColor: colores[index % colores.length] }}>
                                <span className="materia-nombre">{materia.nombre}</span>
                                <Boton
                                    onClick={() => handleModificarMateria(materia)}
                                    className="btn-agregar-plan" 
                                    style={{ float: 'right', marginLeft: 'auto', backgroundColor: 'white', color: '#333' }}
                                >
                                    <i className="fas fa-edit"></i> Modificar
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
            </section>
        </div>
    );
};

export default GestionMaterias;