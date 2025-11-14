import React from 'react';
import './Boton.css'; // Archivo de estilos para Boton

const Boton = ({ children, onClick, type = 'button', disabled = false, className }) => {
    return (
        <button 
            type={type} 
            onClick={onClick} 
            disabled={disabled}
            className={className}
        >
            {children}
        </button>
    );
};

export default Boton;