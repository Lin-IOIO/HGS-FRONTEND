import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexto/conAutenticacion';
import RutaProtegida from './componentes/Enrutamiento/RutaProtegida';
import DisposicionPrincipal from './componentes/Comun/DisposicionPrincipal';
import TableroAdmin from './paginas/Admin/TableroAdmin';

// Componente temporal para ver el layout
const RutasRolEspecificas = () => {
    const { user } = useAuth(); 

    if (!user || !user.rol) return <div>Cargando...</div>; 

    // Aquí usamos Routes anidadas
    if (user.rol === 'Administrador' || user.rol === 'Secretario') {
        return (
            <Routes>
                {/* <Route path="inicio" element={<TableroAdministrador vista="inicio" />} />
              
                <Route path="cursos" element={<TableroAdministrador vista="cursos" />} /> */}
                {/* 3. Ruta para la gestión de Usuarios (¡La que necesitamos!) */}
                <Route path="usuarios" element={<TableroAdmin vista="usuarios" />} />
            
                <Route path="/" element={<Navigate to="inicio" replace />} />
            </Routes>
        );
    }
};

const App = () => {
    return (
        <Router>
            <AuthProvider>
                <Routes>
                    {/* Esta ruta será la de prueba */}
                    <Route 
                        path="/*"
                        element={
                            <RutaProtegida>
                                <DisposicionPrincipal>
                                    <RutasRolEspecificas />
                                </DisposicionPrincipal>
                            </RutaProtegida>
                        }
                    />
                </Routes>
            </AuthProvider>
        </Router>
    );
};

export default App
