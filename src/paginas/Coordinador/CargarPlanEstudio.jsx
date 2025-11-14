import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Boton from '../../componentes/UI/Boton.jsx';
import './CargarPlanEstudio.css';

const CargarPlanEstudio = () => {
    const { idCurso } = useParams();
    // NOTA: necesitarás el nombre de la materia también, que podrías pasarlo en el estado de navigate o hacer una búsqueda.
    const nombreMateria = "Biología"; 
    const nombreCurso = idCurso.replace('-', ' '); 
    
    const [archivo, setArchivo] = useState(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleDragEnter = (e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); };
    const handleDragLeave = (e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); };
    const handleDragOver = (e) => { e.preventDefault(); e.stopPropagation(); };
    
    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setArchivo(e.dataTransfer.files[0]);
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setArchivo(e.target.files[0]);
        }
    };

    const handleUpload = () => {
        if (archivo) {
            console.log(`Subiendo Plan de Estudio para ${nombreMateria} de ${nombreCurso}:`, archivo.name);
            // Lógica de subida al backend aquí...
            alert(`Archivo ${archivo.name} subido con éxito.`);
            setArchivo(null);
        } else {
            alert("Por favor, selecciona o arrastra un archivo.");
        }
    };

    return (
        <div className="cargar-plan-container">
            <h1 className="plan-titulo">Plan de Estudio de {nombreMateria} {nombreCurso}</h1> {/* */}
            
            <div className="upload-section">
                
                <input 
                    type="file" 
                    id="fileInput" 
                    accept=".pdf" 
                    onChange={handleFileChange} 
                    style={{ display: 'none' }}
                />
                
                <label htmlFor="fileInput">
                    <Boton className="ui-boton-principal">
                        <i className="fas fa-plus"></i>Elige un Archivo
                    </Boton>
                </label>
                
                <p className="upload-o">O...</p>
                
                <div 
                    className={`drop-area ${isDragging ? 'is-dragging' : ''}`}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                >
                    {archivo ? (
                        <p className="archivo-seleccionado">Archivo seleccionado: **{archivo.name}**</p>
                    ) : (
                        <>
                            <i className="fas fa-download drop-icon"></i>
                            <p>Arrastra tu archivo aquí</p> {/* */}
                        </>
                    )}
                </div>

                {archivo && (
                    <Boton onClick={handleUpload} className="btn-subir-archivo">
                        Subir Plan
                    </Boton>
                )}
            </div>
        </div>
    );
};

export default CargarPlanEstudio;