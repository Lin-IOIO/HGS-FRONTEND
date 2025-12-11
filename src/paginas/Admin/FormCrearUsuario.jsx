import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Input from '../../componentes/UI/Input.jsx';
import Selector from '../../componentes/UI/Selector.jsx';
import Boton from '../../componentes/UI/Boton.jsx';
import { API } from '../../apis/constantes.js';
import { usePost } from '../../hooks/usePost.js';
import { usePut } from '../../hooks/usePut.js';
import Notificacion from '../../componentes/UI/Notificacion.jsx'; 
import './FormCrearUsuario.css'; 

const rolesDisponibles = [
    { value: 'Profesor', label: 'Docente' }, 
    { value: 'Coordinador', label: 'Coordinador' },
];

const initialData = {
    correo: '',
    nombre: '',
    apellido: '',
    documento: '',
    rol: 'Profesor',
    password: '',
};

const GestionUsuarios = ({ alEnviarUsuario }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const { ejecutarPost, cargando: creando, error: errorPost, datosRespuesta: usuarioCreado } = usePost();

    const { ejecutarPut, cargando: editando, error: errorPut } = usePut();

    console.log('Usuario creado:', usuarioCreado)
   
    const usuarioAEditar = location.state?.usuarioAEditar;

    const [formData, setFormData] = useState(usuarioAEditar || initialData);
    const [notificacion, setNotificacion] = useState(null);  

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const camposRequeridos = ['correo', 'nombre', 'apellido', 'documento', 'password', 'rol'];
        const esEditando = !!usuarioAEditar;
        const camposIncompletos = camposRequeridos.some(key => !formData[key] || String(formData[key]).trim() === '');

        if (camposIncompletos) {
            setNotificacion({
                mensaje: 'Por favor, complete todos los campos requeridos.',
                tipo: 'error'
            });
            return;
        }

        setNotificacion({ 
        mensaje: esEditando ? 'Guardando cambios...' : 'Creando usuario...', 
        tipo: 'info' 
       });

       let url;
       let ejecutarAccion;
       let mensajeExito;

    if (esEditando) {
        url = `${API}/usuarios/${usuarioAEditar.id}`; 
        ejecutarAccion = ejecutarPut;
        mensajeExito = `Usuario ${formData.nombre} modificado exitosamente.`;
    } else {
        url = `${API}/usuarios`;
        ejecutarAccion = ejecutarPost;
        const rolVisible = formData.rol === 'Profesor' ? 'Docente' : formData.rol;
        mensajeExito = `${rolVisible} ${formData.nombre} creado exitosamente.`;
    }

        const resultado = await ejecutarAccion(url, formData);

      if (resultado.exito) {
        setNotificacion({ 
            mensaje: mensajeExito, 
            tipo: 'exito' 
        });
        setTimeout(() => {
            navigate('/admin/usuarios'); 
        }, 1500);

    } else {
        const errorMensaje = esEditando ? 'editar' : 'crear';
        setNotificacion({ 
            mensaje: `Error al ${errorMensaje} usuario: ${resultado.error?.message || 'Error de conexión.'}`, 
            tipo: 'error' 
        });
    }

    setTimeout(() => {
        setNotificacion(null);
    }, 3000);
};
    if ((errorPost || errorPut) && !notificacion) {
         setNotificacion({ 
            mensaje: 'Ocurrió un error inesperado al enviar los datos. Intente de nuevo.', 
            tipo: 'error' 
        });
    }
    
    const isSaving = creando || editando; 

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
                    <Input label="Email" name="correo" value={formData.correo} onChange={handleChange} placeholder="Email" required={true}/>
                    <Input label="Nombre" name="nombre" value={formData.nombre} onChange={handleChange} placeholder="Nombre" required={true}/>
                    <Input label="Apellido" name="apellido" value={formData.apellido} onChange={handleChange} placeholder="Apellido" required={true}/>
                    <Input label="Contraseña" name="password" value={formData.password} onChange={handleChange} placeholder="Contraseña" required={true}/>

                  
                    <div className="form-row-dni-tipo">
                        <Input label="DNI" name="documento" type="number" value={formData.documento} onChange={handleChange} placeholder="DNI" required={true}/>
                        
                        <Selector 
                            label="Tipo de Usuario"
                            name="rol"
                            value={formData.rol}
                            onChange={handleChange}
                            options={rolesDisponibles}
                            required={true}
                        />
                    </div>
                    <div className="form-action-area">
                       <Boton type="submit" className='ui-boton-principal' disabled={isSaving}>
                            {isSaving ? 'Guardando...' : (usuarioAEditar ? 'Guardar Cambios' : 'Guardar')}
                        </Boton>
                    </div>
                </form>
            </div>
        </>
    );
};

export default GestionUsuarios;