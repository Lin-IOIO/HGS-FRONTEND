import React from 'react';
import GestionUsuarios from './GestionUsuarios';
import InicioCursos from './InicioCursos';
import VistaInicio from './VistaInicio';

// Función temporal para simular la acción de guardar un nuevo usuario
const handleCrearUsuario = (datosUsuario) => {
    console.log('✅ Datos recibidos por el Tablero Admin:', datosUsuario);
    alert(`Nuevo usuario (Tipo: ${datosUsuario.tipoUsuario}) listo para ser enviado al servidor.`);
    // Aquí iría la llamada a tu API para crear el usuario
};
const handleCrearCurso = (datosCurso) => {
    console.log('📦 Creando nuevo curso:', datosCurso);
    alert(`Curso ${datosCurso.nombre} (${datosCurso.anio} ${datosCurso.division}) registrado.`);
    // Aquí iría la lógica de la API
};


/**
 * Componente TableroAdministrador
 * Recibe 'vista' como prop para decidir qué contenido renderizar.
 */
const TableroAdmin = ({ vista }) => {
    
    // Función para renderizar el contenido basado en la URL (la prop 'vista')
    const renderContent = () => {
        switch (vista) {
            case 'usuarios':
                // Se renderiza el formulario de creación de usuarios
                return <GestionUsuarios alEnviarUsuario={handleCrearUsuario} />;
            
            case 'cursos':
                // TO DO: Implementar el formulario de ConfiguraciónCursosñ
                return <InicioCursos alCrearCurso={handleCrearCurso} />;
                
            case 'inicio':
                return <VistaInicio />

            default:
                // Si la ruta no coincide, redirigimos al inicio
                return <p>Ruta no encontrada. Volviendo al <a href="/admin/inicio">Inicio</a></p>;
        }
    };

    return (
        <div className="tablero-admin-wrapper">
            {renderContent()}
        </div>
    );
};

export default TableroAdmin;