import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const DiaTrabajoContext = createContext();

export const DiaTrabajoProvider = ({ children }) => {
    const [idDelDiaDeTrabajo, setIdDelDiaDeTrabajo] = useState(null);
    const [actualizarGastos, setActualizarGastos] = useState(false);
    const [actualizarVentas, setActualizarVentas] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDiaDeTrabajo = async () => {
            try {
                const response = await axios.get('https://ddf7uggy3c.execute-api.us-east-2.amazonaws.com/mesas/dia-trabajo');
                const diaId = response.data.data.dia_id;
                setIdDelDiaDeTrabajo(diaId);
            } catch (error) {
                console.error("Error al obtener el ID del día de trabajo:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDiaDeTrabajo();
    }, []);

    const forzarActualizacionGastos = () => {
        setActualizarGastos(prev => !prev);
    };

    const forzarActualizacionVentas = () => {
        setActualizarVentas(prev => !prev);
    };

    return (
        <DiaTrabajoContext.Provider value={{ idDelDiaDeTrabajo, setIdDelDiaDeTrabajo, loading, actualizarGastos, forzarActualizacionGastos, actualizarVentas, forzarActualizacionVentas  }}>
            {children}
        </DiaTrabajoContext.Provider>
    );
};

export const useDiaTrabajo = () => useContext(DiaTrabajoContext);
