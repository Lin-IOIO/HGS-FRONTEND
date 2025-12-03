import React, { useState } from 'react';
import { useLocation } from 'wouter';
import Input from '../../componentes/UI/Input.jsx';
import Selector from '../../componentes/UI/Selector.jsx';
import Boton from '../../componentes/UI/Boton.jsx';
import Notificacion from '../../componentes/UI/Notificacion.jsx'; 
import './FormCrearUsuario.css'; 

const rolesDisponibles = [
    { value: 'Profesor', label: 'Docente' }, 
    { value: 'Coordinador', label: 'Coordinador' },
];

const initialData = {
    email: '',
    nombre: '',
    apellido: '',
    dni: '',
    tipoUsuario: 'Profesor',
};

const GestionUsuarios = ({ alEnviarUsuario }) => {
    const location = useLocation();
   
    const usuarioAEditar = location.state?.usuarioAEditar;

    const [formData, setFormData] = useState(usuarioAEditar || initialData);
    
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

             const mensajeExito = usuarioAEditar 
                ? `Usuario ${formData.nombre} modificado exitosamente.`
                : `${rolVisible} ${formData.nombre} creado exitosamente.`;

            setNotificacion({ 
                mensaje: mensajeExito, 
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
                    alCerrar={() => setNotificacion(null)} 
                />
            )}

            <div className="creacion-usuarios-container">
                <h1>{usuarioAEditar ? 'Modificar Usuario' : 'Nuevo Usuario'}</h1>
                
                <form onSubmit={handleSubmit} className="usuario-form-layout">
                    <Input label="Email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required={true}/>
                    <Input label="Nombre" name="nombre" value={formData.nombre} onChange={handleChange} placeholder="Nombre" required={true}/>
                    <Input label="Apellido" name="apellido" value={formData.apellido} onChange={handleChange} placeholder="Apellido" required={true}/>

                  
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
                    <div className="form-action-area">
                       <Boton type="submit" className='ui-boton-principal'>
                            {usuarioAEditar ? 'Guardar Cambios' : 'Guardar'}
                        </Boton>
                    </div>
                </form>
            </div>
        </>
    );
};

export default GestionUsuarios;