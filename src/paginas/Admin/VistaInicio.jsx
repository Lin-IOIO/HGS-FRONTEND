import React from 'react';
import './VistaInicio.css'; 

const VistaInicio = () => {
    return (
        <div className="admin-inicio-container">
            <h1>Bienvenido, Secretario/a</h1>
            <p className="subtitulo-bienvenida">
                Utiliza el menú lateral para gestionar usuarios, cursos y materias.
            </p>

            <section className="resumen-dashboard">
                <h2>Resumen Rápido</h2>
                
                <div className="dashboard-cards-grid">
                    {/* Tarjeta de Usuarios */}
                    <div className="info-card card-usuarios">
                        <h3>Gestión de Usuarios</h3>
                        <p>Total de Profesores y Coordinadores en el sistema.</p>
                        <span className="card-dato">128</span>
                    </div>

                    {/* Tarjeta de Cursos */}
                    <div className="info-card card-cursos">
                        <h3>Cursos Activos</h3>
                        <p>Cursos creados con Año y División asignados.</p>
                        <span className="card-dato">15</span>
                    </div>

                    {/* Tarjeta de Materias (Requerimiento Futuro) */}
                    <div className="info-card card-materias">
                        <h3>Materias por Asignar</h3>
                        <p>Cursos pendientes de asignación de materias y profesores.</p>
                        <span className="card-dato">3</span>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default VistaInicio;