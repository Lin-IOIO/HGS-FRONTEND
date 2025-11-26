import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios'; // 💡 Importamos axios para las llamadas a la API
import Input from '../../componentes/UI/Input.jsx';
import Selector from '../../componentes/UI/Selector.jsx';
import Boton from '../../componentes/UI/Boton.jsx';
import Notificacion from '../../componentes/UI/Notificacion.jsx'; 
import './UsuarioForm.css'; 

// URL base de la API (Debe coincidir con la de UsuariosMain.jsx)
const API_BASE_URL = 'http://localhost:5000/api/usuarios';

const rolesDisponibles = [
    { value: 'Profesor', label: 'Docente' }, 
    { value: 'Coordinador', label: 'Coordinador' },
];

const initialData = {
    email: '',
    nombre: '',
    apellido: '',
    dni: '',
    // Nota: El backend probablemente requerirá un 'password' para la creación
    password: '', 
    tipoUsuario: 'Profesor',
};

// Renombramos a UsuarioForm para ser claros sobre su propósito
const UsuarioForm = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    // 1. Verificar si venimos de "Editar"
    const usuarioAEditar = location.state?.usuarioAEditar;
    const esEdicion = !!usuarioAEditar;

    // 2. Inicializar estado con datos de edición o datos iniciales vacíos
    const [formData, setFormData] = useState(usuarioAEditar || initialData);
    
    // Estado para manejar la carga (deshabilitar botón)
    const [isSubmitting, setIsSubmitting] = useState(false); 
    const [notificacion, setNotificacion] = useState(null);  

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setNotificacion(null); // Limpiamos notificaciones previas

        const camposRequeridos = ['email', 'nombre', 'apellido', 'dni', 'tipoUsuario'];
        
        // Si estamos creando, requerimos la contraseña
        if (!esEdicion) {
            camposRequeridos.push('password');
        }

        const camposIncompletos = camposRequeridos.some(key => {
            // Verifica que el campo exista y que no esté vacío (solo si no es edición o si es el password en creación)
            if (formData[key] === undefined) return true;
            return String(formData[key]).trim() === '';
        });

        if (camposIncompletos) {
            setIsSubmitting(false);
            setNotificacion({ 
                mensaje: 'Por favor, complete todos los campos requeridos.', 
                tipo: 'error' 
            });
            return;
        }

        // ===============================================
        // LÓGICA DE LA API CENTRALIZADA AQUÍ (CREATE/UPDATE)
        // ===============================================
        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                throw new Error("Token de autenticación no encontrado.");
            }

            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };

            let response;
            let finalData = { ...formData };
            
            // Si estamos editando, eliminamos el campo 'password' si no se modificó
            if (esEdicion) {
                // Si el backend te pide un ID, asegúrate de que esté en finalData
                if (finalData.password === '') {
                    delete finalData.password; // No enviamos el password si está vacío en edición
                }
                
                // Llamada PUT para edición
                response = await axios.put(`${API_BASE_URL}/${usuarioAEditar.id}`, finalData, config);
            } else {
                // Llamada POST para creación
                response = await axios.post(API_BASE_URL, finalData, config);
            }

            // Manejo de éxito
            const rolVisible = formData.tipoUsuario === 'Profesor' ? 'Docente' : formData.tipoUsuario;
            const mensajeExito = esEdicion 
                ? `Usuario ${formData.nombre} modificado exitosamente.`
                : `${rolVisible} ${formData.nombre} creado exitosamente.`;

            setNotificacion({ mensaje: mensajeExito, tipo: 'exito' });
            
            // Redirigir después de un breve delay para que el usuario vea la notificación
            setTimeout(() => {
                navigate('/admin/usuarios'); // Volver al listado principal (UsuariosMain)
            }, 1500);

        } catch (error) {
            console.error('Error al guardar usuario:', error.response?.data || error.message);
            const errorMsg = error.response?.data?.message || "Ocurrió un error al intentar guardar el usuario.";
            setNotificacion({ 
                mensaje: `Error: ${errorMsg}`, 
                tipo: 'error' 
            });
        } finally {
            setIsSubmitting(false);
        }
    };
    
    // Título dinámico
    const tituloFormulario = esEdicion ? 'Modificar Usuario' : 'Nuevo Usuario';

    return (
        <>
            {/* Notificación siempre visible */}
            {notificacion && (
                <Notificacion
                    mensaje={notificacion.mensaje}
                    tipo={notificacion.tipo}
                    alCerrar={() => setNotificacion(null)} 
                />
            )}

            <div className="creacion-usuarios-container">
                <h1>{tituloFormulario}</h1>
                
                <form onSubmit={handleSubmit} className="usuario-form-layout">
                    {/* Campos de texto completos */}
                    <Input label="Email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required={true} type="email" />
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
                    
                    {/* Campo de Contraseña: visible solo en creación o editable en edición */}
                    <Input 
                        label={esEdicion ? "Contraseña (Dejar vacío para no cambiar)" : "Contraseña"} 
                        name="password" 
                        value={formData.password} 
                        onChange={handleChange} 
                        placeholder="Contraseña" 
                        required={!esEdicion} // Requerido solo si estamos creando
                        type="password"
                    />


                    {/* Botón de envío */}
                    <div className="form-action-area">
                       <Boton type="submit" className='ui-boton-principal' disabled={isSubmitting}>
                            {isSubmitting ? 'Guardando...' : (esEdicion ? 'Guardar Cambios' : 'Guardar')}
                        </Boton>
                        {/* Botón de Cancelar/Volver al listado */}
                        <Boton 
                            type="button" 
                            className='ui-boton-secundario' 
                            onClick={() => navigate('/admin/usuarios')}
                            disabled={isSubmitting}
                        >
                            Cancelar
                        </Boton>
                    </div>
                </form>
            </div>
        </>
    );
};

export default UsuarioForm;