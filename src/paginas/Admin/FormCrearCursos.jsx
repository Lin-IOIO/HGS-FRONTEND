import React, { useState, useEffect } from 'react';
import { useLocation, useRoute } from 'wouter';
import Boton from '../../componentes/UI/Boton.jsx';
import Selector from '../../componentes/UI/Selector.jsx';
import { API } from '../../apis/constantes.js';
import { usePost } from '../../hooks/usePost.js';
import { usePut } from '../../hooks/usePut.js';
import { useGet } from '../../hooks/useGet.js';
import { useAlerta } from '../../contexto/alerta.jsx';
import './FormCrearCursos.css';

const opcionesAnio = [
    { value: 1, label: 'Primero' },
    { value: 2, label: 'Segundo' },
    { value: 3, label: 'Tercero' },
    { value: 4, label: 'Cuarto' },
    { value: 5, label: 'Quinto' },
    { value: 6, label: 'Sexto' }
];

const opcionesDivision = [
    { value: 1, label: 'Primera' },
    { value: 2, label: 'Segunda' },
    { value: 3, label: 'Tercera' },
    { value: 4, label: 'Cuarta' },
    { value: 5, label: 'Quinta' },
    { value: 6, label: 'Sexta' },
    { value: 7, label: 'Séptima' },
    { value: 8, label: 'Octava' },
    { value: 9, label: 'Novena' }
];
const opcionesTurno = [
    { value: 'Mañana', label: 'Turno Mañana' },
    { value: 'Tarde', label: 'Turno Tarde' },
    { value: 'Vespertino', label: 'Turno Vespertino' }
];

const FormCrearCursos = () => {
    const [, setLocation] = useLocation();
    const [matchEditar, paramsEditar] = useRoute('/admin/cursos/editar/:idCurso');
    const cursoId = paramsEditar?.idCurso;
    const esEditando = Boolean(matchEditar && cursoId);

    const { alerta } = useAlerta();

    const { ejecutarPost, cargando: creando, error: errorPost } = usePost();
    const { ejecutarPut, cargando: editando, error: errorPut } = usePut();

    const urlCursos = esEditando ? `${API}/cursos` : null;
    const [cursos, cargandoCursos] = useGet(urlCursos, []);

    const [formData, setFormData] = useState({
        anio: 1,
        division: 1,
        turno: 'Mañana',
    });

    useEffect(() => {
        if (esEditando && Array.isArray(cursos)) {
            const cursoAEditar = cursos.find((c) => String(c.id) === String(cursoId));
            if (cursoAEditar) {
                setFormData({
                    anio: cursoAEditar.anio_id,
                    division: cursoAEditar.division_id,
                    turno: cursoAEditar.turno_id,
                });
            }
        }
    }, [esEditando, cursos, cursoId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        const valorAjustado = ['anio', 'division'].includes(name) ? Number(value) : value;
        setFormData(prev => ({ ...prev, [name]: valorAjustado }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const datosCurso = {
            anio: formData.anio,
            division: formData.division,
            turno: formData.turno,
        };

        let url;
        let ejecutarAccion;
        let mensajeExito;

        if (esEditando) {
            url = `${API}/cursos/${cursoId}`;
            ejecutarAccion = ejecutarPut;
            mensajeExito = `Curso ${formData.anio}º ${formData.division}ª modificado.`;
        } else {
            url = `${API}/cursos`;
            ejecutarAccion = ejecutarPost;
            mensajeExito = `Curso ${formData.anio}º ${formData.division}ª creado con éxito.`;
        }

        const resultado = await ejecutarAccion(url, datosCurso);
        if (resultado.exito) {
            alerta({
                titulo: esEditando ? "Cambios Guardados" : "Curso Creado",
                descripcion: mensajeExito,
                onClick: () => setLocation('/admin/cursos'),
            });
        } else {
            alerta({
                titulo: `Error al ${esEditando ? 'modificar' : 'crear'} curso`,
                descripcion: `Ocurrió un error: ${resultado.error?.message || 'Error de conexión.'}`
            });
        }
    };

    const handleCancelar = () => {
        window.history.back();
    };

    if ((errorPost || errorPut) && !alerta) {
        alerta({
            mensaje: 'Ocurrió un error inesperado al enviar los datos. Intente de nuevo.',
            tipo: 'error'
        });
    }

    if (esEditando && cargandoCursos) {
        return <div className="crear-curso-container"><p>Cargando curso...</p></div>;
    }

    const isSaving = creando || editando;
    const title = esEditando ? 'Modificar Curso' : 'Nuevo Curso';

    return (
        <div className="crear-curso-container">
            <h1 className="titulo-formulario">{title}</h1>

            <form onSubmit={handleSubmit} className="curso-form-layout">
                <div className="form-row-anio-division">
                    <Selector
                        label="Año"
                        name="anio"
                        value={formData.anio}
                        onChange={handleChange}
                        options={opcionesAnio}
                        required={true}
                    />

                    <Selector
                        label="División"
                        name="division"
                        value={formData.division}
                        onChange={handleChange}
                        options={opcionesDivision}
                        required={true}
                    />

                    <Selector
                        label="Turno"
                        name="turno"
                        value={formData.turno}
                        onChange={handleChange}
                        options={opcionesTurno}
                        required={true}
                    />
                </div>

                <div className="form-action-area-curso">
                    <Boton
                        type="button"
                        onClick={handleCancelar}
                        className="ui-boton-principal"
                        disabled={isSaving}
                        style={{ backgroundColor: '#999' }}
                    >
                        Cancelar
                    </Boton>

                    <Boton type="submit" className="ui-boton-principal" disabled={isSaving}>
                        {isSaving ? 'Guardando...' : 'Guardar'}
                    </Boton>
                </div>
            </form>
        </div>
    );
};

export default FormCrearCursos;
