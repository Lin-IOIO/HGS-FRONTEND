import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { AuthProvider } from './contexto/conAutenticacions';
import RutaProtegida from './componentes/Enrutamiento/RutaProtegida';
import DisposicionPrincipal from './componentes/Comun/DisposicionPrincipal';

// Componente temporal para ver el layout
const ContenidoDePrueba = () => (
    <div style={{ padding: '40px', fontSize: '1.5em' }}>
        <h2>✔️ ¡Layout y Sidebar Cargados!</h2>
        <p>Este contenido reemplaza al Tablero Administrativo para la prueba visual.</p>
    </div>
);

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
                                    {/* Componente temporal renderizado dentro del layout */}
                                    <ContenidoDePrueba />
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
