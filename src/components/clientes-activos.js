import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const ClientesActivos = ({ onAgregar, onCrearCliente, onVerMesasPagadasHoy }) => { 
    const [mesas, setMesas] = useState([]);
    const [error, setError] = useState(null);

    // Función para cargar las mesas existentes
    const fetchMesas = async () => {
        try {
            const response = await axios.get('https://ddf7uggy3c.execute-api.us-east-2.amazonaws.com/mesas/mesas');
            setMesas(response.data);
        } catch (err) {
            console.error('Error al obtener mesas', err);
            setError('No se pudieron cargar las mesas');
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
    
    return (
        <div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <h1>Clientes activos</h1>
        
            <ul className='clientes-activos'>
                <li className='nuevo_cliente' onClick={onCrearCliente}>
                    <h3>+ Nuevo cliente</h3>
                </li>
                {mesas.map((mesa) => (
                    <li onClick={() => onAgregar(mesa)} key={mesa.id}>
                        <h3>{mesa.Nombre}</h3>
                    </li>
                ))}
            </ul>
            <button onClick={() => onVerMesasPagadasHoy()}>Ver mesas pagadas hoy</button>
        </div>
    );
};

export default ClientesActivos;
