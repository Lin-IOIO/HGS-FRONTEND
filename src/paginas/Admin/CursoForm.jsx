import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios'; // 💡 Importamos axios para la llamada a la API
import Boton from '../../componentes/UI/Boton.jsx';
import Selector from '../../componentes/UI/Selector.jsx';
import Notificacion from '../../componentes/UI/Notificacion.jsx'; // Importamos el componente Notificacion
import './CursoForm.css'; 

// URL base de la API (Debe coincidir con CursosMain.jsx)
const API_BASE_URL = 'http://localhost:5000/api/cursos';

const opcionesAnio = [
    { value: '1ro', label: 'Primero' }, 
    { value: '2do', label: 'Segundo' },
    { value: '3ro', label: 'Tercero' },
    { value: '4to', label: 'Cuarto' },
    { value: '5to', label: 'Quinto' },
    { value: '6to', label: 'Sexto' }
];

const opcionesDivision = [
    { value: '1ra', label: 'Primera' }, 
    { value: '2da', label: 'Segunda' },
    { value: '3ra', label: 'Tercera' },
    { value: '4ta', label: 'Cuarta' },
    { value: '5ta', label: 'Quinta' },
    { value: '6ta', label: 'Sexta' }
];

const opcionesTurno = [
    { value: 'Mañana', label: 'Turno Mañana' },
    { value: 'Tarde', label: 'Turno Tarde' },
    { value: 'Vespertino', label: 'Turno Vespertino' }
];

const initialData = {
    anio: '1ro',
    division: '1ra',
    turno: 'Mañana', 
};

// Renombramos a CursoForm y lo preparamos para edición (aunque solo usemos creación por ahora)
const CursoForm = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Lógica para pre-cargar datos si viene de edición (futuro)
    const cursoAEditar = location.state?.cursoAEditar;
    const esEdicion = !!cursoAEditar;
    
    const [formData, setFormData] = useState(cursoAEditar || initialData);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [notificacion, setNotificacion] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setNotificacion(null);

        // 1. Preparar los datos
        const nombreCurso = `${formData.anio} ${formData.division}`;
        const cursoPayload = { 
            ...formData, 
            nombre: nombreCurso 
        };
        
        // 2. Ejecutar la llamada a la API
        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                throw new Error("Token de autenticación no encontrado.");
            }

            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };

            let response;
            if (esEdicion) {
                // Lógica de Edición (PUT) - Para uso futuro
                response = await axios.put(`${API_BASE_URL}/${cursoAEditar.id}`, cursoPayload, config);
            } else {
                // Lógica de Creación (POST)
                response = await axios.post(API_BASE_URL, cursoPayload, config);
            }

            // 3. Manejo de éxito
            const mensajeExito = esEdicion
                ? `Curso ${nombreCurso} modificado exitosamente.`
                : `Curso ${nombreCurso} creado exitosamente.`;

            setNotificacion({ mensaje: mensajeExito, tipo: 'exito' });
            
            // Redirigir al listado principal después de un delay
            setTimeout(() => {
                navigate('/admin/cursos'); 
            }, 1500);

        } catch (error) {
            console.error('Error al guardar curso:', error.response?.data || error.message);
            const errorMsg = error.response?.data?.message || "Ocurrió un error al intentar guardar el curso.";
            setNotificacion({ 
                mensaje: `Error: ${errorMsg}`, 
                tipo: 'error' 
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancelar = () => {
        navigate('/admin/cursos'); // Navegar siempre a la ruta principal de cursos
    };

    const tituloFormulario = esEdicion ? 'Modificar Curso' : 'Nuevo Curso';

    return (
        <>
            {notificacion && (
                <Notificacion
                    mensaje={notificacion.mensaje}
                    tipo={notificacion.tipo}
                    alCerrar={() => setNotificacion(null)} 
                />
            )}

            <div className="crear-curso-container">
                <h1 className="titulo-formulario">{tituloFormulario}</h1>
                
                <form onSubmit={handleSubmit} className="curso-form-layout">
                    
                    {/* Campos de selección */}
                    <div className="form-row-anio-division">
                        <Selector 
                            label="Año"
                            name="anio"
                            value={formData.anio}
                            onChange={handleChange}
                            options={opcionesAnio}
                            required={true}
                        />
                        
                        <Selector 
                            label="División"
                            name="division"
                            value={formData.division}
                            onChange={handleChange}
                            options={opcionesDivision}
                            required={true}
                        />

                        {/* Selector de Turno */}
                        <Selector 
                            label="Turno"
                            name="turno"
                            value={formData.turno}
                            onChange={handleChange}
                            options={opcionesTurno}
                            required={true}
                        />
                    </div>

                    <div className="form-action-area-curso">
                        <Boton 
                            type="button" 
                            onClick={handleCancelar}
                            className="ui-boton-secundario" // Cambiado a secundario para coherencia
                            disabled={isSubmitting}
                        >
                            Cancelar
                        </Boton>

                        <Boton 
                            type="submit" 
                            className="ui-boton-principal"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Guardando...' : (esEdicion ? 'Guardar Cambios' : 'Guardar')}
                        </Boton>
                    </div>
                </form>
            </div>
        </>
    );
};

export default CursoForm;