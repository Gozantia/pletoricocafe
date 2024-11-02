import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDiaTrabajo } from '../DiaTrabajoContext';

const EstadisticasVentasDia = () => {
    const { idDelDiaDeTrabajo } = useDiaTrabajo();
    const [ventasEfectivo, setVentasEfectivo] = useState(0);
    const [ventasTransferencia, setVentasTransferencia] = useState(0);
    const [error, setError] = useState(null);

    // Función para cargar las ventas del día actual
    const fetchVentas = async () => {
        try {
            const response = await axios.get(`https://ddf7uggy3c.execute-api.us-east-2.amazonaws.com/mesas/dia-trabajo/${idDelDiaDeTrabajo}/venta`);
            const { total_efectivo, total_transferencia} = response.data;
            setVentasEfectivo(total_efectivo);
            setVentasTransferencia(total_transferencia);
            console.log("entró", response.data )
        } catch (err) {
            console.error('Error al obtener ventas del día:', err);
            setError('Hubo un problema al cargar las estadísticas.');
        }
    };

    // Llama a fetchVentas cuando el componente se monta
    useEffect(() => {
        if (idDelDiaDeTrabajo) {
            fetchVentas();
        }
    }, [idDelDiaDeTrabajo]);

    // Función para cerrar el día de trabajo

    return (
        <div>
            <h1>Estadísticas de Ventas del Día</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <p><strong>Efectivo:</strong> ${ventasEfectivo}</p>
            <p><strong>Transferencias:</strong> ${ventasTransferencia}</p>
            <p><strong>Total:</strong> ${ventasEfectivo + ventasTransferencia}</p>
        </div>
    );
};

export default EstadisticasVentasDia;
