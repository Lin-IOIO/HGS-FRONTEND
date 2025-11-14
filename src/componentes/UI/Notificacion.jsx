import React from 'react';
import './Notificacion.css';

const Notificacion = ({ mensaje, tipo, alCerrar }) => {
    const claseTipo = tipo === 'error' ? 'notificacion-error' : 
                      tipo === 'exito' ? 'notificacion-exito' : 
                      'notificacion-info';

return (
        <div className={`notificacion-overlay`} onClick={alCerrar}>
            <div className={`notificacion-box ${claseTipo}`} onClick={(e) => e.stopPropagation()}>
                <p>{mensaje}</p>
                <button onClick={alCerrar} className="notificacion-cerrar">×</button>
            </div>
        </div>
    );
};

export default Notificacion;