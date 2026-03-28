import './App.css';
import { Route, Switch, Redirect } from 'wouter';
import { AuthProvider, useAuth } from './contexto/conAutenticacion';
import LoginPage from './paginas/Login/LoginPage';
import RutaProtegida from './componentes/Enrutamiento/RutaProtegida';
import DisposicionPrincipal from './componentes/Comun/DisposicionPrincipal';

import TableroAdmin from './paginas/Admin/TableroAdmin';
import GestionMaterias from './paginas/Admin/GestionMaterias';
import GestionUsuarios from './paginas/Admin/GestionUsuarios';
import FormCrearUsuario from './paginas/Admin/FormCrearUsuario';
import FormCrearCursos from './paginas/Admin/FormCrearCursos';
import FormNuevaMateria from './paginas/Admin/FormNuevaMateria';
import InicioCoordinador from './paginas/Coordinador/InicioCoordinador';
import CargarPlanEstudio from './paginas/Coordinador/CargarPlanEstudio';
import GestionMateriasCoordinador from './paginas/Coordinador/GestionMateriasCoordinador';
import InicioProfesor from './paginas/Profesor/InicioProfesor';
import { AlertaProvider } from 'contexto/alerta';

const App = () => {
    return (
        <AuthProvider>
            <AlertaProvider>
                <RoutesContainer />
            </AlertaProvider>
        </AuthProvider>
    );
};

const RoutesContainer = () => {
    const { isAuthenticated, user } = useAuth();

    const redirectPath = isAuthenticated && user?.rol ? `/${user.rol}/inicio` : '/login';

    return (
        <Switch>
            <Route path="/login">
                {isAuthenticated && user?.rol ? <Redirect to={redirectPath} /> : <LoginPage />}
            </Route>

            <Route path="/">
                <Redirect to={redirectPath} />
            </Route>

            <Route path="/admin/inicio">
                <RutaProtegida rolesPermitidos={['admin']}>
                    <DisposicionPrincipal>
                        <TableroAdmin vista="inicio" />
                    </DisposicionPrincipal>
                </RutaProtegida>
            </Route>
            <Route path="/admin/cursos">
                <RutaProtegida rolesPermitidos={['admin']}>
                    <DisposicionPrincipal>
                        <TableroAdmin vista="cursos" />
                    </DisposicionPrincipal>
                </RutaProtegida>
            </Route>
            <Route path="/admin/cursos/crear">
                <RutaProtegida rolesPermitidos={['admin']}>
                    <DisposicionPrincipal>
                        <FormCrearCursos />
                    </DisposicionPrincipal>
                </RutaProtegida>
            </Route>
            <Route path="/admin/cursos/editar/:idCurso">
                <RutaProtegida rolesPermitidos={['admin']}>
                    <DisposicionPrincipal>
                        <FormCrearCursos />
                    </DisposicionPrincipal>
                </RutaProtegida>
            </Route>
            <Route path="/admin/cursos/:idCurso">
                <RutaProtegida rolesPermitidos={['admin']}>
                    <DisposicionPrincipal>
                        <GestionMaterias />
                    </DisposicionPrincipal>
                </RutaProtegida>
            </Route>

            <Route path="/admin/usuarios">
                <RutaProtegida rolesPermitidos={['admin']}>
                    <DisposicionPrincipal>
                        <GestionUsuarios />
                    </DisposicionPrincipal>
                </RutaProtegida>
            </Route>
            <Route path="/admin/usuarios/crear">
                <RutaProtegida rolesPermitidos={['admin']}>
                    <DisposicionPrincipal>
                        <FormCrearUsuario />
                    </DisposicionPrincipal>
                </RutaProtegida>
            </Route>
            <Route path="/admin/usuarios/editar/:idUsuario">
                <RutaProtegida rolesPermitidos={['admin']}>
                    <DisposicionPrincipal>
                        <FormCrearUsuario />
                    </DisposicionPrincipal>
                </RutaProtegida>
            </Route>

            <Route path="/admin/materias/:idCurso/crear">
                <RutaProtegida rolesPermitidos={['admin']}>
                    <DisposicionPrincipal>
                        <FormNuevaMateria />
                    </DisposicionPrincipal>
                </RutaProtegida>
            </Route>
            <Route path="/admin/materias/editar/:idCursoMateria">
                <RutaProtegida rolesPermitidos={['admin']}>
                    <DisposicionPrincipal>
                        <FormNuevaMateria />
                    </DisposicionPrincipal>
                </RutaProtegida>
            </Route>

            <Route path="/coordinador/inicio">
                <RutaProtegida rolesPermitidos={['coordinador']}>
                    <DisposicionPrincipal>
                        <InicioCoordinador />
                    </DisposicionPrincipal>
                </RutaProtegida>
            </Route>
            <Route path="/coordinador/cursos/:idCurso">
                <RutaProtegida rolesPermitidos={['coordinador']}>
                    <DisposicionPrincipal>
                        <GestionMateriasCoordinador />
                    </DisposicionPrincipal>
                </RutaProtegida>
            </Route>
            <Route path="/coordinador/cursos/:idCurso/plan/:idCursoMateria">
                <RutaProtegida rolesPermitidos={['coordinador']}>
                    <DisposicionPrincipal>
                        <CargarPlanEstudio />
                    </DisposicionPrincipal>
                </RutaProtegida>
            </Route>

            <Route path="/profesor/inicio">
                <RutaProtegida rolesPermitidos={['profesor']}>
                    <DisposicionPrincipal>
                        <InicioProfesor />
                    </DisposicionPrincipal>
                </RutaProtegida>
            </Route>

            <Route path="/:rest*">
                <Redirect to="/login" />
            </Route>
        </Switch>
    );
};

export default App;
