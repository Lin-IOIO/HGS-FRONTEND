import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Boton from '../../componentes/UI/Boton.jsx';
import Selector from '../../componentes/UI/Selector.jsx';
import './FormCrearCursos.css'; 

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

// 1. Nuevas opciones para el Turno
const opcionesTurno = [
    { value: 'Mañana', label: 'Turno Mañana' },
    { value: 'Tarde', label: 'Turno Tarde' },
    { value: 'Vespertino', label: 'Turno Vespertino' }
];

const FormCrearCursos = () => {
    const navigate = useNavigate();
    
    // 2. Agregamos 'turno' al estado inicial
    const [formData, setFormData] = useState({
        anio: '1ro',
        division: '1ra',
        turno: 'Mañana', 
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const nombreCurso = `${formData.anio} ${formData.division}`;
        const nuevoCurso = { ...formData, nombre: nombreCurso };

        console.log("Guardando curso:", nuevoCurso);
        alert("Curso creado con éxito"); 
        navigate('/admin/cursos'); 
    };

    const handleCancelar = () => {
        navigate(-1); 
    };

    return (
        <div className="crear-curso-container">
            <h1 className="titulo-formulario">Nuevo Curso</h1>
            
            <form onSubmit={handleSubmit} className="curso-form-layout">
                
                {/* 3. Ahora usamos una grid de 3 columnas o ajustamos el diseño para que quepan */}
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

                    {/* Nuevo Selector de Turno */}
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
                        className="ui-boton-principal"
                        style={{backgroundColor: '#999'}} // Color distinto para cancelar
                    >
                        Cancelar
                    </Boton>

                    <Boton type="submit" className="ui-boton-principal">
                        Guardar
                    </Boton>
                </div>
            </form>
        </div>
    );
};

export default FormCrearCursos;