import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Importamos el hook de navegación
import Boton from '../../componentes/UI/Boton.jsx';
import Selector from '../../componentes/UI/Selector.jsx';
import './FormCrearCursos.css'; 

// Opciones (Se mantienen igual)
const opcionesAnio = [
    { value: '1ro', label: 'Primero' }, 
    { value: '2do', label: 'Segundo' },
    { value: '3ro', label: 'Tercero' }
];

const opcionesDivision = [
    { value: '1ra', label: 'Primera' }, 
    { value: '2da', label: 'Segunda' },
    { value: '3ra', label: 'Tercera' },
    { value: '4ta', label: 'Cuarta' },
    { value: '5ta', label: 'Quinta' }
];

// 2. Ya no desestructuramos props obligatorias (alEnviarCurso puede ser opcional o manejarse aquí)
const FormCrearCursos = () => {
    const navigate = useNavigate(); // 3. Inicializamos el hook
    
    const [formData, setFormData] = useState({
        anio: '1ro',
        division: '1ra',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Construye el nombre del curso
        const nombreCurso = `${formData.anio} ${formData.division}`;
        const nuevoCurso = { ...formData, nombre: nombreCurso };

        // --- LÓGICA DE GUARDADO ---
        // Aquí llamarías a tu API (axios.post...)
        console.log("Guardando curso:", nuevoCurso);
        
        // Simulación de éxito:
        alert("Curso creado con éxito"); 
        
        // 4. Redirigir a la lista de cursos
        navigate('/admin/cursos'); 
    };

    // Función para el botón Cancelar
    const handleCancelar = () => {
        navigate(-1); // Vuelve a la página anterior en el historial
    };

    return (
        <div className="crear-curso-container">
            <h1 className="titulo-formulario">Nuevo Curso</h1>
            
            <form onSubmit={handleSubmit} className="curso-form-layout">
                
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
                </div>

                <div className="form-action-area-curso">
                    {/* Botón Cancelar (Secundario) */}
                    <Boton 
                        type="button" 
                        onClick={handleCancelar}
                        className="ui-boton-principal"
                    >
                        Cancelar
                    </Boton>

                    {/* Botón Guardar (Principal) */}
                    <Boton type="submit" className="ui-boton-principal">
                        Guardar
                    </Boton>
                </div>
            </form>
        </div>
    );
};

export default FormCrearCursos;