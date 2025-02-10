import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useDiaTrabajo } from '../DiaTrabajoContext';

const EstadisticasVentasDia = ( { setEstadisticasVentas }) => {
    const { idDelDiaDeTrabajo } = useDiaTrabajo();
    const [ventasEfectivo, setVentasEfectivo] = useState(0);
    const [ventasTransferencia, setVentasTransferencia] = useState(0);
    const [error, setError] = useState(null);

    // Función para cargar las ventas del día actual
    const fetchVentas = useCallback(async () => {
        try {
            const response = await axios.get(`https://ddf7uggy3c.execute-api.us-east-2.amazonaws.com/mesas/dia-trabajo/${idDelDiaDeTrabajo}/venta`);
            const { total_efectivo, total_transferencia } = response.data;
            setVentasEfectivo(total_efectivo);
            setVentasTransferencia(total_transferencia);
            setEstadisticasVentas({
                efectivo: total_efectivo,
                transferencia: total_transferencia,
                total: total_efectivo + total_transferencia,
            });
            console.log("Datos de ventas obtenidos:", response.data);
        } catch (err) {
            console.error('Error al obtener ventas del día:', err);
            setError('Hubo un problema al cargar las estadísticas.');
        }
    }, [idDelDiaDeTrabajo, setEstadisticasVentas]);

    // Llama a fetchVentas cuando el componente se monta o cuando idDelDiaDeTrabajo cambia
    useEffect(() => {
        if (idDelDiaDeTrabajo) {
            fetchVentas();
        }
    }, [idDelDiaDeTrabajo, fetchVentas]);

    // Actualiza las ventas cuando el usuario vuelve a la pestaña de la aplicación
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible' && idDelDiaDeTrabajo) {
                fetchVentas();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [fetchVentas, idDelDiaDeTrabajo]);

    return (
        <div className='stats-box'>
            <h3>Ventas</h3>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <span><strong>Trans:</strong> ${ventasTransferencia.toLocaleString('es-ES')}</span>
            <span><strong>Cash:</strong> ${ventasEfectivo.toLocaleString('es-ES')}</span>
            <span><strong>Total:</strong> ${ventasEfectivo + ventasTransferencia}</span>
        </div>
    );
};

export default EstadisticasVentasDia;
