import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Boton from '../../componentes/UI/Boton.jsx';
import Selector from '../../componentes/UI/Selector.jsx';
import { API } from '../../apis/constantes.js';
import { usePost } from '../../hooks/usePost.js';
import { usePut } from '../../hooks/usePut.js';
import { useAuth } from '../../contexto/conAutenticacion';
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
    { value: 1, label: 'Turno Mañana' },
    { value: 2, label: 'Turno Tarde' },
    { value: 3, label: 'Turno Vespertino' }
];

const FormCrearCursos = () => {
    const navigate = useNavigate();
    const { alerta } = useAlerta();
    const { user } = useAuth();
    const location = useLocation();

    const cursoAEditar = location.state?.cursoAEditar;

    const { ejecutarPost, cargando: creando, error: errorPost } = usePost();
    const { ejecutarPut, cargando: editando, error: errorPut } = usePut();

    const [formData, setFormData] = useState(cursoAEditar ? {
        año: cursoAEditar.anio_id,
        division: cursoAEditar.division_id,
        turno: cursoAEditar.turno_id,
    } : {
        año: 1,
        division: 1,
        turno: 1,
    });
    const handleChange = (e) => {
        const { name, value } = e.target;
        const valorAjustado = ['año', 'division', 'turno'].includes(name) ? Number(value) : value;
        setFormData(prev => ({ ...prev, [name]: valorAjustado }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const esEditando = !!cursoAEditar;

        const datosCurso = {
            año: formData.año,
            division: formData.division,
            turno: formData.turno,
            creado_por_id_admin: user.id,
        };

        let url;
        let ejecutarAccion;
        let mensajeExito;

        if (esEditando) {
            url = `${API}/cursos/${cursoAEditar.id}`;
            ejecutarAccion = ejecutarPut;
            mensajeExito = `Curso ${formData.año}º ${formData.division}ª modificado.`;
        } else {
            url = `${API}/cursos`;
            ejecutarAccion = ejecutarPost;
            mensajeExito = `Curso ${formData.año}º ${formData.division}ª creado con éxito.`;
        }


        const resultado = await ejecutarAccion(url, datosCurso);
        if (resultado.exito) {
            alerta({
                titulo: esEditando ? "Cambios Guardados" : "Curso Creado",
                descripcion: mensajeExito,
                onClick: () => navigate('/admin/cursos'),
            });
        } else {
            alerta({
                titulo: `Error al ${esEditando ? 'modificar' : 'crear'} curso`,
                descripcion: `Ocurrió un error: ${resultado.error?.message || 'Error de conexión.'}`
            });
        }
    };

    const handleCancelar = () => {
        navigate(-1);
    };
    if ((errorPost || errorPut) && !alerta) {
        alerta({
            mensaje: 'Ocurrió un error inesperado al enviar los datos. Intente de nuevo.',
            tipo: 'error'
        });
    }

    const isSaving = creando || editando;
    const title = cursoAEditar ? 'Modificar Curso' : 'Nuevo Curso';

    return (
        <div className="crear-curso-container">
            <h1 className="titulo-formulario">{title}</h1>

            <form onSubmit={handleSubmit} className="curso-form-layout">

                <div className="form-row-anio-division">
                    <Selector
                        label="Año"
                        name="año"
                        value={formData.año}
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