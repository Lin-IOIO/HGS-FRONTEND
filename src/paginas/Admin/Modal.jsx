import React from 'react';

const Modal = ({ isOpen, onClose, onConfirm, titulo, mensaje }) => {
    if (!isOpen) return null;

    return (
        <>  
            {/* Overlay (fondo oscuro) */}
            <div className="modal-overlay" onClick={onClose}>
                {/* Contenido del Modal. Evitamos que el click aquí cierre el modal. */}
                <div className="modal-contenido" onClick={(e) => e.stopPropagation()}>
                    <header className="modal-header">
                        <h2>{titulo}</h2>
                        {/* Botón de cerrar (X) */}
                        <button className="modal-close-btn" onClick={onClose}>
                            &times;
                        </button>
                    </header>
                    
                    <div className="modal-body">
                        <p>{mensaje}</p>
                    </div>

                    <footer className="modal-footer">
                        {/* Botón de Cancelar */}
                        <button 
                            className="btn-modal btn-cancelar" 
                            onClick={onClose}
                        >
                            Cancelar
                        </button>
                        
                        {/* Botón de Confirmar (Eliminar) */}
                        <button 
                            className="btn-modal btn-confirmar" 
                            onClick={onConfirm}
                        >
                            Confirmar
                        </button>
                    </footer>
                </div>
            </div>
        </>
    );
};

export default Modal;