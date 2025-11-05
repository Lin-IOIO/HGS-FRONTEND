import React, { useState } from 'react';
import Boton from '../../componentes/UI/Boton.jsx';
import Selector from '../../componentes/UI/Selector.jsx';
import './FormCrearCursos.css'; 

// Opciones de Año y División (basado en la imagen)
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

const FormCrearCursos = ({ alEnviarCurso, alCancelar }) => {
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
        // Construye el nombre del curso (ej: "1ro 5ta")
        const nombreCurso = `${formData.anio} ${formData.division}`;
        alEnviarCurso({ ...formData, nombre: nombreCurso });
        alCancelar(); // Vuelve al listado después de enviar
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
                    <Boton type="submit" className="btn-guardar">
                        Guardar
                    </Boton>
                </div>
            </form>
        </div>
    );
};

export default FormCrearCursos;