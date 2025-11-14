import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexto/conAutenticacion';

const RutaProtegida = ({ children, rolesPermitidos }) => {
    const { user, cargando } = useAuth();
    
    // 1. Mostrar cargando mientras se verifica la sesión/rol
    if (cargando) {
        return <div>Cargando autenticación...</div>;
    }

    // 2. Si no hay usuario, redirigir al login
    if (!user) {
        return <Navigate to="/" replace />; // Asumiendo que "/" es tu página de Login
    }

    // 3. Verificar el Rol
    // Si 'rolesPermitidos' incluye el rol del usuario, permite el acceso.
    if (rolesPermitidos && !rolesPermitidos.includes(user.rol)) {
        
        // 4. Si el rol no está permitido, redirigir a la ruta de inicio del usuario,
        // o a una página de "Acceso Denegado".

        const rutaInicio = user.rol === 'Coordinador' ? '/coordinador/inicio' : 
                           user.rol === 'Administrador' || user.rol === 'Secretario' ? '/admin/inicio' : 
                           '/';

        return <Navigate to={rutaInicio} replace />;
    }

    // 5. Si el usuario está logueado y su rol es permitido, renderiza los hijos (Routes)
    return children;
};

export default RutaProtegida;