import React from 'react';
import './Boton.css';

const Boton = ({ children, onClick, type = 'button', disabled = false, className, style }) => {
    return (
        <button 
            type={type} 
            onClick={onClick} 
            disabled={disabled}
            className={className}
            style={style}
        >
            {children}
        </button>
    );
};

export default Boton;