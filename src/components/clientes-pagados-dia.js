import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDiaTrabajo } from '../DiaTrabajoContext';

const ClientesPagadosDia = () => { 
    const { idDelDiaDeTrabajo, setDiaTrabajo } = useDiaTrabajo(); // Asegúrate de que setDiaTrabajo esté disponible
    const navigate = useNavigate();
    const [mesas, setMesas] = useState([]);
    const [error, setError] = useState(null);

    // Función para cargar las mesas existentes
    const fetchMesas = async () => {
        try {
            const response = await axios.get(`https://ddf7uggy3c.execute-api.us-east-2.amazonaws.com/mesas/dia-trabajo/${idDelDiaDeTrabajo}`);
            setMesas(response.data.clientes_pagados);
        } catch (err) {
            console.error('Error al obtener mesas', err);
            setError('Aún no han pagado una mondá');
        }
    };

    // Cargar las mesas cuando el componente se monta
    useEffect(() => {
        fetchMesas();
    }, []);

    const actualizarDatos = useCallback(() => {
        fetchMesas(); // Llamar a la función fetchMesas para actualizar los datos
    }, []); // Dependencias de useCallback

    // Manejar el cambio de visibilidad
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                // Actualizar los datos cuando la pestaña esté activa
                actualizarDatos();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [actualizarDatos]); // Incluir actualizarDatos como dependencia

    // Función para cerrar día
    const handlecerrarDia = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            // Actualizar el día de trabajo
            const addVentatoDiaResponse = await axios.put('https://ddf7uggy3c.execute-api.us-east-2.amazonaws.com/mesas/dia-trabajo', {
                dia_id: idDelDiaDeTrabajo,   // El ID del día de trabajo actual
                abierto: false,   // Cambiando el estado a cerrado
            });

            console.log("respuesta del evento put", addVentatoDiaResponse);
            // Actualizar el contexto a null
            setDiaTrabajo(null); // Esto debería funcionar ahora
            // Volver a la lista de clientes activos
            navigate(`/sistema/`);
        } catch (err) {
            console.error('Error al cerrar día', err);
            setError('No se pudo cerrar el día');
        }
    };

    return (
        <main>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <h1>Clientes Pagados</h1>
        
            <ul className='clientes-activos'>
                <li className='nuevo_cliente' onClick={() => navigate('/sistema/crear-cliente')}>
                    <h3>+ Nuevo cliente</h3>
                </li>
                {mesas.map((mesa) => (
                    <li key={mesa.id}>
                        <h3>{mesa.Nombre}</h3>
                    </li>
                ))}
            </ul>
            <button onClick={handlecerrarDia}> Cerrar día</button>
        </main>
    );
};

export default ClientesPagadosDia;
