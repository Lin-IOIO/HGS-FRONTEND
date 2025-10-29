import React, { useState } from 'react';
import Input from '../../components/ui/Input';
import Selector from '../../components/ui/Selector';
import Boton from '../../components/ui/Boton';
import './GestionUsuarios.css'; 

const rolesDisponibles = [
    { value: 'Profesor', label: 'Docente' }, 
    { value: 'Coordinador', label: 'Coordinador' },
];

const GestionUsuarios = ({ alEnviarUsuario }) => {
    const [formData, setFormData] = useState({
        email: '',
        nombre: '',
        apellido: '',
        dni: '',
        tipoUsuario: 'Profesor',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        alEnviarUsuario(formData);
    };

    return (
        <div className="gestion-usuarios-container">
            <h1>Nuevo Usuario</h1>
            
            <form onSubmit={handleSubmit} className="usuario-form-layout">
                {/* Campos de texto completos */}
                <Input label="Email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required={true}/>
                <Input label="Nombre" name="nombre" value={formData.nombre} onChange={handleChange} placeholder="Nombre" required={true}/>
                <Input label="Apellido" name="apellido" value={formData.apellido} onChange={handleChange} placeholder="Apellido" required={true}/>

                {/* Fila DNI y Tipo de Usuario */}
                <div className="form-row-dni-tipo">
                    <Input label="DNI" name="dni" type="number" value={formData.dni} onChange={handleChange} placeholder="DNI" required={true}/>
                    
                    <Selector 
                        label="Tipo de Usuario"
                        name="tipoUsuario"
                        value={formData.tipoUsuario}
                        onChange={handleChange}
                        options={rolesDisponibles}
                        required={true}
                    />
                </div>

                {/* Botón de envío */}
                <div className="form-action-area">
                    <Boton type="submit">Guardar</Boton>
                </div>
            </form>
        </div>
    );
};

export default GestionUsuarios;