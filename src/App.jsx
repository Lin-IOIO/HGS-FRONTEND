import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexto/conAutenticacion';
import RutaProtegida from './componentes/Enrutamiento/RutaProtegida';
import DisposicionPrincipal from './componentes/Comun/DisposicionPrincipal';
import TableroAdmin from './paginas/Admin/TableroAdmin';
import GestionMaterias from './paginas/Admin/GestionMaterias';

import InicioCoordinador from './paginas/Coordinador/InicioCoordinador';
import CargarPlanEstudio from './paginas/Coordinador/CargarPlanEstudio';
import GestionMateriasCoordinador from './paginas/Coordinador/GestionMateriasCoordinador';
// Componente temporal para ver el layout
const RutasAdminYSecretario = () => {
    return (
        <Routes>
            <Route path="inicio" element={<TableroAdmin vista="inicio" />} />
            <Route path="cursos" element={<TableroAdmin vista="cursos" />} />
            <Route path="cursos/:idCurso" element={<GestionMaterias />} />
            <Route path="usuarios" element={<TableroAdmin vista="usuarios" />} />
            <Route path="/" element={<Navigate to="inicio" replace />} />
        </Routes>
    );
};


const RutasCoordinador = () => {
    return (
        <Routes>
            {/* /coordinador/inicio */}
            <Route path="inicio" element={<InicioCoordinador />} /> 
            
            {/* /coordinador/cursos/:idCurso */}
            <Route path="cursos/:idCurso" element={<GestionMateriasCoordinador />} />
            
            {/* /coordinador/cursos/:idCurso/plan/:idMateria */}
            <Route path="cursos/:idCurso/plan/:idMateria" element={<CargarPlanEstudio />} />

            <Route path="/" element={<Navigate to="inicio" replace />} />
        </Routes>
    );
};
const App = () => {
    return (
        <Router>
            <AuthProvider>
                <Routes>
                    {/* Esta ruta será la de prueba */}
                    <Route 
                        path="/admin/*"
                        element={
                            <RutaProtegida>
                                <DisposicionPrincipal>
                                    <RutasAdminYSecretario />
                                </DisposicionPrincipal>
                            </RutaProtegida>
                        }
                    />
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
                </Routes>
            </AuthProvider>
        </Router>
    );
};

export default App
