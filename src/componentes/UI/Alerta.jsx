import './Alerta.css';

const Alerta = ({ titulo, descripcion, onClick}) => {

    return (
        <div className="alerta">
            <h2 className="alerta-titulo">{titulo}</h2>
            <p className="alerta-descripcion">{descripcion}</p>
            <div className="alerta-boton-contenedor">
                <button className="alerta-boton" onClick={onClick}>Cerrar</button>
            </div>
        </div>
    );
}

export default Alerta;