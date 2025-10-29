import React from 'react';
import GestionUsuarios from './GestionUsuarios';
// import ConfiguracionCursos from './ConfiguracionCursos'; 
// import VistaInicioAdmin from './VistaInicioAdmin';

// Función temporal para simular la acción de guardar un nuevo usuario
const handleCrearUsuario = (datosUsuario) => {
    console.log('✅ Datos recibidos por el Tablero Admin:', datosUsuario);
    alert(`Nuevo usuario (Tipo: ${datosUsuario.tipoUsuario}) listo para ser enviado al servidor.`);
    // Aquí iría la llamada a tu API para crear el usuario
};

/**
 * Componente TableroAdministrador
 * Recibe 'vista' como prop para decidir qué contenido renderizar.
 */
const TableroAdministrador = ({ vista }) => {
    
    // Función para renderizar el contenido basado en la URL (la prop 'vista')
    const renderContent = () => {
        switch (vista) {
            case 'usuarios':
                // Se renderiza el formulario de creación de usuarios
                return <GestionUsuarios alEnviarUsuario={handleCrearUsuario} />;
            
            case 'cursos':
                // TO DO: Implementar el formulario de ConfiguraciónCursos
                return (
                    <div style={{ padding: '20px' }}>
                        <h1>Configuración de Cursos</h1>
                        <p>Módulo en desarrollo para la Etapa 1: crear cursos y asignar materias.</p>
                    </div>
                );
                
            case 'inicio':
                return (
                    <div style={{ padding: '20px' }}>
                        <h1>Bienvenido al Panel de Secretaría</h1>
                        <p>Selecciona una opción del menú lateral para comenzar a gestionar el sistema.</p>
                    </div>
                );

            default:
                // Si la ruta no coincide, redirigimos al inicio
                return <p>Ruta no encontrada. Volviendo al <a href="/admin/inicio">Inicio</a></p>;
        }
    };

    return (
        <div className="tablero-admin-wrapper">
            {/* Aquí se renderiza la vista dinámica */}
            {renderContent()}
        </div>
    );
};

export default TableroAdministrador;