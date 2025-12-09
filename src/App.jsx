import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexto/conAutenticacion';
import LoginPage from './paginas/Login/LoginPage';
import RutaProtegida from './componentes/Enrutamiento/RutaProtegida';
import DisposicionPrincipal from './componentes/Comun/DisposicionPrincipal';

// --- Imports de Páginas ---
import TableroAdmin from './paginas/Admin/TableroAdmin';
import GestionMaterias from './paginas/Admin/GestionMaterias';
import GestionUsuarios from './paginas/Admin/GestionUsuarios';
import FormCrearUsuario from './paginas/Admin/FormCrearUsuario';
import FormCrearCursos from './paginas/Admin/FormCrearCursos';
import FormNuevaMateria from './paginas/Admin/FormNuevaMateria';
import InicioCoordinador from './paginas/Coordinador/InicioCoordinador';
import CargarPlanEstudio from './paginas/Coordinador/CargarPlanEstudio';
import GestionMateriasCoordinador from './paginas/Coordinador/GestionMateriasCoordinador';

const App = () => {
    return (
        <Router>
            <AuthProvider>
                <RoutesContainer />
            </AuthProvider>
        </Router>
    );
};

const RutasAdminYSecretario = () => {
    return (
        <Routes>
            <Route path="inicio" element={<TableroAdmin vista="inicio" />} />
            <Route path="cursos" element={<TableroAdmin vista="cursos" />} />
            <Route path="usuarios" element={<GestionUsuarios />} />
            <Route path="usuarios/crear" element={<FormCrearUsuario />} />
            <Route path="usuarios/editar" element={<FormCrearUsuario />} />
            <Route path="cursos/crear" element={<FormCrearCursos />} />
            <Route path="cursos/:idCurso" element={<GestionMaterias />} />
            <Route path="materias/crear" element={<FormNuevaMateria />} />
            <Route path="materias/editar" element={<FormNuevaMateria />} />
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

const RoutesContainer = () => {
    const { isAuthenticated, user } = useAuth();

    let redirectPath = '/login';

    if (isAuthenticated && user && user.rol) {
        redirectPath = `/${user.rol}/inicio`;
    }

    return (
        <Routes>
            <Route
                path="/login"
                element={
                    isAuthenticated && user?.rol ? (
                        <Navigate to={redirectPath} replace />
                    ) : (
                        <LoginPage />
                    )
                }
            />
            <Route path="/" element={<Navigate to={redirectPath} replace />} />
            <Route
                path="/admin/*"
                element={
                    <RutaProtegida rolesPermitidos={['admin']}>
                        <DisposicionPrincipal>
                            <RutasAdminYSecretario />
                        </DisposicionPrincipal>
                    </RutaProtegida>
                }
            />
            <Route
                path="/coordinador/*"
                element={
                    <RutaProtegida rolesPermitidos={['coordinador']}>
                        <DisposicionPrincipal>
                            <RutasCoordinador />
                        </DisposicionPrincipal>
                    </RutaProtegida>
                }
            />
            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    );
};

export default App;