import Alerta from "componentes/UI/Alerta";
import { createContext, useContext, useState } from "react";

const AlertaContext = createContext(null);

export const AlertaProvider = ({ children }) => {
    const [alertaVisible, setAlertaVisible] = useState(false);
    const [alertaProps, setAlertaProps] = useState({
        titulo: "",
        descripcion: "",
        onClick: null,
    });
    const [animando, setAnimando] = useState(false);

    const cerrarAlerta = () => {
        setAnimando(true);
        setTimeout(() => {
            setAlertaVisible(false);
            setAnimando(false);
            alertaProps.onClick?.();
        }, 300);
    }

    const alerta = ({titulo, descripcion, onClick}) => {
        setAlertaProps({ titulo, descripcion, onClick });
        setAlertaVisible(true);
        setAnimando(true);
        setTimeout(() => setAnimando(false), 50);
    };

    return (
        <AlertaContext.Provider value={{alerta}}>
            {children}
            {alertaVisible && (
                <div className={`alertas ${animando ? "animando" : ""}`}>
                    <Alerta
                        titulo={alertaProps.titulo}
                        descripcion={alertaProps.descripcion}
                        onClick={cerrarAlerta}
                    />
                </div>
            )}
        </AlertaContext.Provider>
    )
}

export const useAlerta = () => {
    return useContext(AlertaContext);
};