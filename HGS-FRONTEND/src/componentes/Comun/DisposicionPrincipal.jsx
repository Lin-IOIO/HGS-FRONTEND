import Encabezado from './Header';
import BarraLateral from './SideBar';
import './DisposicionPrincipal.css'; 

const DisposicionPrincipal = ({ children }) => {
    return (
    <div className="layout-container">
    <BarraLateral />
    <div className="main-content-wrapper">
        <Encabezado />
        <main className="main-content-area">
            {children} 
        </main>
    </div>
</div>
    );
};

export default DisposicionPrincipal;