import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexto/conAutenticacion';
import LoginPage from './paginas/Login/LoginPage'; // ¡Asegúrate de que esta ruta sea correcta!
import RutaProtegida from './componentes/Enrutamiento/RutaProtegida';
import DisposicionPrincipal from './componentes/Comun/DisposicionPrincipal';

// --- Imports de Páginas ---
import TableroAdmin from './paginas/Admin/TableroAdmin';
import GestionMaterias from './paginas/Admin/GestionMaterias';
import InicioCoordinador from './paginas/Coordinador/InicioCoordinador';
import CargarPlanEstudio from './paginas/Coordinador/CargarPlanEstudio';
import GestionMateriasCoordinador from './paginas/Coordinador/GestionMateriasCoordinador';


// Componentes de Agrupación de Rutas (Se mantienen igual)
const RutasAdminYSecretario = () => {
    return (
        <Routes>
            <Route path="inicio" element={<TableroAdmin vista="inicio" />} />
            <Route path="cursos" element={<TableroAdmin vista="cursos" />} />
            <Route path="cursos/crear" element={<FormCrearCursos />} />
            <Route path="cursos/:idCurso" element={<GestionMaterias />} />
            <Route path="usuarios" element={<TableroAdmin vista="usuarios" />} />
            <Route path="/" element={<Navigate to="inicio" replace />} />
        </Routes>
    );
};

const RutasCoordinador = () => {
    return (
        <Routes>
            <Route path="inicio" element={<InicioCoordinador />} /> 
            <Route path="cursos/:idCurso" element={<GestionMateriasCoordinador />} />
            <Route path="cursos/:idCurso/plan/:idMateria" element={<CargarPlanEstudio />} />
            <Route path="/" element={<Navigate to="inicio" replace />} />
        </Routes>
    );
};

const App = () => {
    return (
        <Router>
            <AuthProvider>
                {/* Obtenemos isAuthenticated DENTRO de AuthProvider para que funcione */}
                <RoutesContainer />
            </AuthProvider>
        </Router>
    );
};

// Componente separado para usar useAuth
const RoutesContainer = () => {
   const { isAuthenticated, user } = useAuth();
    
    // **Ajuste 1: Asegurarse de que user.rol NO es null antes de intentar usarlo.**
    let redirectPath = '/login'; // Predeterminado al login
    
    if (isAuthenticated && user && user.rol) {
        // Solo intenta usar toLowerCase() si user.rol existe y no es null
        redirectPath = `/${user.rol.toLowerCase()}/inicio`;
    }
    return (
        <Routes>
            
            {/* NUEVO: Ruta de Login */}
           <Route 
                path="/login"
                element={
                    // Si ya está autenticado y tiene rol, lo redirige.
                    isAuthenticated && user.rol ? <Navigate to={redirectPath} replace /> : <LoginPage />
                }
            />
            
            {/* Ruta Raíz redirige a la ruta calculada (login o panel) */}
            <Route path="/" element={<Navigate to={redirectPath} replace />} />
            
            {/* Rutas Protegidas de Administrador */}
            <Route 
                path="/admin/*"
                element={
                    <RutaProtegida rolesPermitidos={['Admin']}> 
                        <DisposicionPrincipal>
                            <RutasAdminYSecretario />
                        </DisposicionPrincipal>
                    </RutaProtegida>
                }
            />
            
            {/* Rutas Protegidas de Coordinador */}
            <Route 
                path="/coordinador/*"
                element={
                    <RutaProtegida rolesPermitidos={['Coordinador']}>
                        <DisposicionPrincipal>
                            <RutasCoordinador /> 
                        </DisposicionPrincipal>
                    </RutaProtegida>
                }
            />
             {/* Agrega aquí la ruta para /docente/ si la necesitas */}

             {/* Ruta 404 */}
             <Route path="*" element={<Navigate to="/login" replace />} />

        </Routes>
    );
}

export default App