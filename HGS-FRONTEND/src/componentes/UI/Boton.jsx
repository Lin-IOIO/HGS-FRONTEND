import React from 'react';
import './Boton.css'; // Archivo de estilos para Boton

const Boton = ({ children, onClick, type = 'button', disabled = false }) => {
    return (
        <button 
            type={type} 
            onClick={onClick} 
            disabled={disabled}
            className="ui-boton-principal"
        >
            {children}
        </button>
    );
};

export default Boton;