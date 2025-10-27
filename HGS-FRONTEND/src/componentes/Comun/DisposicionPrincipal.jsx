import Encabezado from './Encabezado';
import BarraLateral from './BarraLateral';
// import './DisposicionPrincipal.css'; // Estilos para posicionar el layout

const DisposicionPrincipal = ({ children }) => {
    return (
        <div className="layout-container">
            {/* La barra lateral azul a la izquierda */}
            <BarraLateral />
            
            <div className="main-content-wrapper">
                {/* El encabezado "Hola, Secretario/a..." */}
                <Encabezado />
                
                {/* El contenido central (el "Nuevo Usuario" que ignoramos por ahora) */}
                <main className="main-content-area">
                    {children} 
                </main>
            </div>
        </div>
    );
};

export default DisposicionPrincipal;