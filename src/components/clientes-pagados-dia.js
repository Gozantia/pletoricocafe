import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDiaTrabajo } from '../DiaTrabajoContext';
import EstadisticasVentasDia from './estadisticasVentasDia';

const ClientesPagadosDia = () => { 
    const { idDelDiaDeTrabajo, setIdDelDiaDeTrabajo } = useDiaTrabajo();
    const navigate = useNavigate();
    const [mesas, setMesas] = useState([]);
    const [error, setError] = useState(null);
    const [estadisticasVentas, setEstadisticasVentas] = useState({
        efectivo: 0,
        transferencia: 0,
        total: 0,
    });

    // Función memoizada para cargar las mesas existentes
    const fetchMesas = useCallback(async () => {
        if (!idDelDiaDeTrabajo) return;
        try {
            const response = await axios.get(`https://ddf7uggy3c.execute-api.us-east-2.amazonaws.com/mesas/dia-trabajo/${idDelDiaDeTrabajo}`);
            setMesas(response.data.clientes_pagados);
            console.log( "este es el id del día de las mesas pagadas", idDelDiaDeTrabajo, "y esto es lo que esta encontrando", response.data.clientes_pagados )
        } catch (err) {
            console.error('Error al obtener mesas', err);
            setError('Aún no han pagado una mondá');
        }
    }, [idDelDiaDeTrabajo]);

    // Cargar mesas al montar el componente
    useEffect(() => {
        fetchMesas();
    }, [fetchMesas]); // Agregamos fetchMesas a las dependencias aquí

    // Función para actualizar las mesas cuando la pestaña esté visible
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                fetchMesas();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [fetchMesas]); // Agregamos fetchMesas a las dependencias aquí también

    // Función para cerrar día
    const handlecerrarDia = async (e) => {
        e.preventDefault();
        setError(null);
         // Encapsulamos los datos en un objeto
        const datosActualizar = {
            dia_id: idDelDiaDeTrabajo,
            abierto: false,
            total_efectivo: estadisticasVentas.efectivo,
            total_transferencia: estadisticasVentas.transferencia,
            total: estadisticasVentas.total
        };

        try {
            const addVentatoDiaResponse = await axios.put('https://ddf7uggy3c.execute-api.us-east-2.amazonaws.com/mesas/dia-trabajo', datosActualizar );

            console.log("respuesta del evento put", addVentatoDiaResponse);
            setIdDelDiaDeTrabajo(null); 
            navigate(`/sistema/`);
          
        } catch (err) {
            console.error('Error al cerrar día', err);
            console.error("Detalles del error:", err.response?.data);
            setError('No se pudo cerrar el día');
        }
    };

    return (
        <section className='container'>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <h1>Clientes Pagados</h1>
        
            <ul className='clientes-activos'>

                <li className='estadisticas_dia'>
                    <EstadisticasVentasDia setEstadisticasVentas={setEstadisticasVentas} />
                </li>
                {mesas.map((mesa) => (
                    <li onClick={() => navigate(`/sistema/editar-mesa/${mesa.id}`)} key={mesa.id}>
                        <h3>{mesa.Nombre}</h3>
                    </li>
                ))}
            </ul>
            <div className='actions'>
            <button onClick={handlecerrarDia}>Cerrar día</button>
            </div>
        </section>
    );
};

export default ClientesPagadosDia;
