import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Boton from '../../componentes/UI/Boton.jsx';
import Selector from '../../componentes/UI/Selector.jsx';
import './FormCrearCursos.css'; 

const opcionesAnio = [
    { value: 1, label: 'Primero' }, 
    { value: 2, label: 'Segundo' },
    { value: 3, label: 'Tercero' },
    { value: 4, label: 'Cuarto' },
    { value: 5, label: 'Quinto' },
    { value: 6, label: 'Sexto' }
];

const opcionesDivision = [
    { value: 1, label: 'Primera' }, 
    { value: 2, label: 'Segunda' },
    { value: 3, label: 'Tercera' },
    { value: 4, label: 'Cuarta' },
    { value: 5, label: 'Quinta' },
    { value: 6, label: 'Sexta' },
    { value: 7, label: 'Séptima' },
    { value: 8, label: 'Octava' },
    { value: 9, label: 'Novena' }
];
const opcionesTurno = [
    { value: 1, label: 'Turno Mañana' },
    { value: 2, label: 'Turno Tarde' },
    { value: 3, label: 'Turno Vespertino' }
];

const FormCrearCursos = () => {
    const navigate = useNavigate();
    
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
        location(-1); 
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
                        style={{backgroundColor: '#999'}} 
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