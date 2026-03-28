import React, { useState, useMemo, useEffect } from 'react';
import { useLocation, useRoute } from 'wouter';
import Input from '../../componentes/UI/Input.jsx';
import Selector from '../../componentes/UI/Selector.jsx';
import Boton from '../../componentes/UI/Boton.jsx';
import { API } from '../../apis/constantes.js';
import { usePost } from '../../hooks/usePost.js';
import { usePut } from '../../hooks/usePut.js';
import { useGet } from '../../hooks/useGet.js';
import Notificacion from '../../componentes/UI/Notificacion.jsx'; 
import './FormCrearUsuario.css'; 

const ROLES = [
    { value: 1, label: 'Admin' },
    { value: 2, label: 'Coordinador' },
    { value: 3, label: 'Profesor' },
];

const initialData = {
    correo_electronico: '',
    nombre: '',
    apellido: '',
    DNI: '',
    contrasena: '',
    id_rol: 3,
};

const FormCrearUsuario = () => {
    const [, setLocation] = useLocation();
    const [matchEditar, paramsEditar] = useRoute('/admin/usuarios/editar/:idUsuario');
    const usuarioId = paramsEditar?.idUsuario;
    const esEditando = Boolean(matchEditar && usuarioId);

    const { ejecutarPost, cargando: creando, error: errorPost } = usePost();
    const { ejecutarPut, cargando: editando, error: errorPut } = usePut();

    const urlUsuarios = esEditando ? `${API}/usuarios` : null;
    const [usuarios, cargandoUsuarios] = useGet(urlUsuarios, []);

    const usuarioAEditar = useMemo(() => {
        if (!esEditando || !Array.isArray(usuarios)) return null;
        return usuarios.find((u) => String(u.id) === String(usuarioId)) || null;
    }, [esEditando, usuarios, usuarioId]);

    const datosIniciales = useMemo(() => {
        if (!usuarioAEditar) return initialData;
        return {
            correo_electronico: usuarioAEditar.correo_electronico || '',
            nombre: usuarioAEditar.nombre || '',
            apellido: usuarioAEditar.apellido || '',
            DNI: usuarioAEditar.DNI || '',
            contrasena: '',
            id_rol: usuarioAEditar.id_rol || 3,
        };
    }, [usuarioAEditar]);

    const [formData, setFormData] = useState(datosIniciales);
    const [notificacion, setNotificacion] = useState(null);  

    useEffect(() => {
        setFormData(datosIniciales);
    }, [datosIniciales]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        const valorAjustado = name === 'id_rol' ? Number(value) : value;
        setFormData(prev => ({ ...prev, [name]: valorAjustado }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const camposRequeridos = ['correo_electronico', 'nombre', 'apellido', 'DNI', 'contrasena', 'id_rol'];

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
            url = `${API}/usuarios/${usuarioId}`; 
            ejecutarAccion = ejecutarPut;
            mensajeExito = `Usuario ${formData.nombre} modificado exitosamente.`;
        } else {
            url = `${API}/usuarios`;
            ejecutarAccion = ejecutarPost;
            const rolVisible = ROLES.find((r) => r.value === formData.id_rol)?.label || 'Usuario';
            mensajeExito = `${rolVisible} ${formData.nombre} creado exitosamente.`;
        }

        const resultado = await ejecutarAccion(url, formData);

        if (resultado.exito) {
            setNotificacion({ 
                mensaje: mensajeExito, 
                tipo: 'exito' 
            });
            setTimeout(() => {
                setLocation('/admin/usuarios'); 
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

    if (esEditando && cargandoUsuarios) {
        return <div className="creacion-usuarios-container"><p>Cargando usuario...</p></div>;
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
                <h1>{esEditando ? 'Modificar Usuario' : 'Nuevo Usuario'}</h1>
                
                <form onSubmit={handleSubmit} className="usuario-form-layout">
                    <Input label="Email" name="correo_electronico" value={formData.correo_electronico} onChange={handleChange} placeholder="Email" required={true}/>
                    <Input label="Nombre" name="nombre" value={formData.nombre} onChange={handleChange} placeholder="Nombre" required={true}/>
                    <Input label="Apellido" name="apellido" value={formData.apellido} onChange={handleChange} placeholder="Apellido" required={true}/>
                    <Input label="Contraseña" name="contrasena" value={formData.contrasena} onChange={handleChange} placeholder="Contraseña" required={true}/>

                    <div className="form-row-dni-tipo">
                        <Input label="DNI" name="DNI" type="number" value={formData.DNI} onChange={handleChange} placeholder="DNI" required={true}/>
                        
                        <Selector 
                            label="Tipo de Usuario"
                            name="id_rol"
                            value={formData.id_rol}
                            onChange={handleChange}
                            options={ROLES}
                            required={true}
                        />
                    </div>
                    <div className="form-action-area">
                       <Boton type="submit" className='ui-boton-principal' disabled={isSaving}>
                            {isSaving ? 'Guardando...' : (esEditando ? 'Guardar Cambios' : 'Guardar')}
                        </Boton>
                    </div>
                </form>
            </div>
        </>
    );
};

export default FormCrearUsuario;
