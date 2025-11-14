import React, { useState } from 'react';
import Input from '../../componentes/UI/Input.jsx';
import Selector from '../../componentes/UI/Selector.jsx';
import Boton from '../../componentes/UI/Boton.jsx';
import Notificacion from '../../componentes/UI/Notificacion.jsx'; 
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
    const [notificacion, setNotificacion] = useState(null); 

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const camposRequeridos = ['email', 'nombre', 'apellido', 'dni'];
        const camposIncompletos = camposRequeridos.some(key => formData[key].trim() === '');

        if (camposIncompletos) {
            setNotificacion({ 
                mensaje: 'Por favor, complete todos los campos requeridos.', 
                tipo: 'error' 
            });
        } else {
            const rolVisible = formData.tipoUsuario === 'Profesor' ? 'Docente' : formData.tipoUsuario;

            setNotificacion({ 
                mensaje: `${rolVisible} ${formData.nombre} ${formData.apellido} creado exitosamente.`, 
                tipo: 'exito' 
            });
            setTimeout(() => {
                alEnviarUsuario(formData);
                setNotificacion(null); 
            }, 1500); 
        }
    };
    

    return (
        <>
            {notificacion && (
                <Notificacion
                    mensaje={notificacion.mensaje}
                    tipo={notificacion.tipo}
                    alCerrar={() => setNotificacion(null)} // Función para cerrar al hacer clic
                />
            )}

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
                        <Boton type="submit" className='ui-boton-principal'>Guardar</Boton>
                    </div>
                </form>
            </div>
        </>
    );
};

export default GestionUsuarios;