import React, { useMemo, useState, useEffect } from 'react';
import { useRoute } from 'wouter';
import { API } from '../../apis/constantes.js';
import { useGet } from '../../hooks/useGet.js';
import { usePost } from '../../hooks/usePost.js';
import { usePut } from '../../hooks/usePut.js';
import { useAuth } from '../../contexto/conAutenticacion';
import Boton from '../../componentes/UI/Boton.jsx';
import './CargarPlanEstudio.css';

const CargarPlanEstudio = () => {
    const [, params] = useRoute('/coordinador/cursos/:idCurso/plan/:idCursoMateria');
    const idCurso = params?.idCurso;
    const idCursoMateria = params?.idCursoMateria;
    const { user } = useAuth();

    const urlPlanes = `${API}/planes`;
    const [planes, loadingPlanes, errorPlanes] = useGet(urlPlanes, []);

    const urlCursoMaterias = `${API}/curso-materias`;
    const [cursoMaterias, loadingCursoMaterias] = useGet(urlCursoMaterias, []);

    const cursoMateriaActual = useMemo(() => {
        if (!Array.isArray(cursoMaterias)) return null;
        return cursoMaterias.find((cm) => String(cm.id) === String(idCursoMateria)) || null;
    }, [cursoMaterias, idCursoMateria]);

    const nombreMateria = cursoMateriaActual?.materia_nombre || "Materia";

    const planExistente = useMemo(() => {
        if (!Array.isArray(planes)) return null;
        return planes.find((plan) => plan.id_curso_materia === Number(idCursoMateria)) || null;
    }, [planes, idCursoMateria]);

    const [linkDescarga, setLinkDescarga] = useState('');

    const { ejecutarPost, cargando: creando } = usePost();
    const { ejecutarPut, cargando: actualizando } = usePut();

    const fechaHoy = new Date().toISOString().slice(0, 10);

    useEffect(() => {
        setLinkDescarga(planExistente?.link_descarga || '');
    }, [planExistente]);

    const buildDriveDownloadLink = (rawLink) => {
        const cleaned = String(rawLink || '').trim();
        if (!cleaned) return '';

        if (!cleaned.includes('drive.google.com')) {
            return cleaned;
        }

        const fileMatch = cleaned.match(/\/file\/d\/([^/]+)/i);
        if (fileMatch && fileMatch[1]) {
            return `https://drive.google.com/uc?export=download&id=${fileMatch[1]}`;
        }

        const openMatch = cleaned.match(/[?&]id=([^&]+)/i);
        if (openMatch && openMatch[1]) {
            return `https://drive.google.com/uc?export=download&id=${openMatch[1]}`;
        }

        return cleaned;
    };

    const handleGuardar = async () => {
        if (!linkDescarga) return;
        const linkFinal = buildDriveDownloadLink(linkDescarga);

        const payload = {
            id_curso_materia: Number(idCursoMateria),
            id_coordinador: user.id,
            link_descarga: linkFinal,
            fecha_carga: fechaHoy,
        };

        let resultado;
        if (planExistente) {
            resultado = await ejecutarPut(`${API}/planes/${planExistente.id}`, payload);
        } else {
            resultado = await ejecutarPost(`${API}/planes`, payload);
        }

        if (resultado.exito) {
            window.history.back();
        }
    };

    if (loadingPlanes || loadingCursoMaterias) {
        return <div className="cargar-plan-container"><p>Cargando...</p></div>;
    }

    if (errorPlanes) {
        return <div className="cargar-plan-container"><p>Error al cargar el plan.</p></div>;
    }

    return (
        <div className="cargar-plan-container">
            <h1 className="plan-titulo">
                {planExistente ? "Modificar Plan de Estudio" : "Cargar Plan de Estudio"}
                <br/>
                <span style={{fontSize: '0.6em', color: '#666'}}>{nombreMateria} - Curso {idCurso}</span>
            </h1>
            
            {planExistente && (
                <div className="archivo-existente-card">
                    <div className="info-archivo">
                        <i className="fas fa-link archivo-icon"></i>
                        <div className="datos">
                            <p className="label">Link Actual:</p>
                            <p className="nombre">{planExistente.link_descarga}</p>
                        </div>
                    </div>
                    <div className="acciones-archivo">
                        <button 
                            className="btn-descargar-mini" 
                            title="Abrir link" 
                            onClick={() => window.open(planExistente.link_descarga, '_blank')}
                        >
                            <i className="fas fa-external-link-alt"></i>
                        </button>
                    </div>
                </div>
            )}

            <div className="upload-section">
                <label className="upload-instruction">URL del plan de estudio</label>
                <input
                    type="url"
                    className="form-input-materia"
                    placeholder="https://..."
                    value={linkDescarga}
                    onChange={(e) => setLinkDescarga(e.target.value)}
                />
                <Boton onClick={handleGuardar} className="btn-subir-archivo" disabled={creando || actualizando || !linkDescarga}>
                    {planExistente ? "Guardar Cambios" : "Subir Plan"}
                </Boton>
            </div>
        </div>
    );
};

export default CargarPlanEstudio;
