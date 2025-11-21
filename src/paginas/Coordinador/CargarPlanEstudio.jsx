import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom'; // Importar useLocation
import Boton from '../../componentes/UI/Boton.jsx';
import './CargarPlanEstudio.css';

const CargarPlanEstudio = () => {
    const { idCurso } = useParams();
    const location = useLocation(); // Para recibir datos
    
    const nombreCurso = idCurso.replace('-', ' ');
    
    // Obtenemos datos pasados por navegación o usamos defaults
    const nombreMateria = location.state?.nombreMateria || "Materia";
    const archivoInicial = location.state?.archivoExistente || null;

    const [archivo, setArchivo] = useState(null);
    const [archivoExistente, setArchivoExistente] = useState(archivoInicial);
    const [isDragging, setIsDragging] = useState(false);

    // Efecto para limpiar si cambian los datos
    useEffect(() => {
        setArchivoExistente(location.state?.archivoExistente);
    }, [location.state]);

    // ... (Manejadores de Drag & Drop se mantienen igual) ...
    const handleDragEnter = (e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); };
    const handleDragLeave = (e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); };
    const handleDragOver = (e) => { e.preventDefault(); e.stopPropagation(); };
    
    const handleDrop = (e) => {
        e.preventDefault(); e.stopPropagation(); setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) setArchivo(e.dataTransfer.files[0]);
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) setArchivo(e.target.files[0]);
    };

    const handleUpload = () => {
        if (archivo) {
            // Lógica real de subida (reemplazo)
            console.log(`Reemplazando/Subiendo plan para ${nombreMateria}:`, archivo.name);
            alert(`Archivo ${archivo.name} subido con éxito.`);
            
            // Actualizamos el estado visual
            setArchivoExistente(archivo.name); 
            setArchivo(null);
        }
    };

    const handleEliminarExistente = () => {
        if(window.confirm("¿Estás seguro de que quieres eliminar el plan de estudio actual?")){
            console.log("Eliminando archivo:", archivoExistente);
            // Lógica backend eliminar...
            setArchivoExistente(null); // Limpiamos visualmente
        }
    };

    return (
        <div className="cargar-plan-container">
            <h1 className="plan-titulo">
                {archivoExistente ? "Modificar Plan de Estudio" : "Cargar Plan de Estudio"}
                <br/>
                <span style={{fontSize: '0.6em', color: '#666'}}>{nombreMateria} - {nombreCurso}</span>
            </h1>
            
            {/* SECCIÓN: ARCHIVO EXISTENTE (Solo si hay uno) */}
            {archivoExistente && (
                <div className="archivo-existente-card">
                    <div className="info-archivo">
                        <i className="fas fa-file-pdf archivo-icon"></i>
                        <div className="datos">
                            <p className="label">Archivo Actual:</p>
                            <p className="nombre">{archivoExistente}</p>
                        </div>
                    </div>
                    <div className="acciones-archivo">
                        <button className="btn-descargar-mini" title="Descargar actual">
                            <i className="fas fa-download"></i>
                        </button>
                        <button 
                            className="btn-eliminar-mini" 
                            onClick={handleEliminarExistente}
                            title="Eliminar archivo"
                        >
                            <i className="fas fa-trash-alt"></i>
                        </button>
                    </div>
                </div>
            )}

            {/* SECCIÓN: SUBIDA (Siempre visible para reemplazar o agregar) */}
            <div className="upload-section">
                {archivoExistente && <p className="upload-instruction">Para reemplazar el plan actual, sube uno nuevo:</p>}
                
                <input 
                    type="file" id="fileInput" accept=".pdf" 
                    onChange={handleFileChange} style={{ display: 'none' }}
                />
                
                <label htmlFor="fileInput">
                    <Boton className="ui-boton-principal">
                        <i className="fas fa-plus"></i> Elige un Archivo
                    </Boton>
                </label>
                
                {!archivo && <p className="upload-o">O...</p>}
                
                <div 
                    className={`drop-area ${isDragging ? 'is-dragging' : ''}`}
                    onDragEnter={handleDragEnter} onDragLeave={handleDragLeave}
                    onDragOver={handleDragOver} onDrop={handleDrop}
                >
                    {archivo ? (
                        <div className="nuevo-archivo-preview">
                            <i className="fas fa-file-upload"></i>
                            <p>Listo para subir: <strong>{archivo.name}</strong></p>
                        </div>
                    ) : (
                        <div className="drop-placeholder">
                            <i className="fas fa-cloud-upload-alt drop-icon"></i>
                            <p>Arrastra tu archivo aqui</p>
                        </div>
                    )}
                </div>

                {archivo && (
                    <Boton onClick={handleUpload} className="btn-subir-archivo">
                        {archivoExistente ? "Reemplazar Archivo" : "Subir Plan"}
                    </Boton>
                )}
            </div>
        </div>
    );
};

export default CargarPlanEstudio;