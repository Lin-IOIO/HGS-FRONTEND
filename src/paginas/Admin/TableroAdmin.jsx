import React from 'react';
import CursosMain from './InicioCursos';
import VistaInicio from './VistaInicio';

const handleCrearUsuario = (datosUsuario) => {
    console.log('Datos recibidos por el Tablero Admin:', datosUsuario);
    alert(`Nuevo usuario (Tipo: ${datosUsuario.tipoUsuario}) listo para ser enviado al servidor.`);
};
const handleCrearCurso = (datosCurso) => {
    console.log('Creando nuevo curso:', datosCurso);
    alert(`Curso ${datosCurso.nombre} (${datosCurso.anio} ${datosCurso.division}) registrado.`);
};

const TableroAdmin = ({ vista }) => {
    const renderContent = () => {
        switch (vista) {
            case 'cursos':
                return <CursosMain alCrearCurso={handleCrearCurso} />;
            case 'inicio':
                return <VistaInicio />;
            default:
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
