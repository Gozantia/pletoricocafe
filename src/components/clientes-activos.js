import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDiaTrabajo } from '../DiaTrabajoContext';

const ClientesActivos = () => { 
    const { idDelDiaDeTrabajo } = useDiaTrabajo();
    const navigate = useNavigate();
    const [mesas, setMesas] = useState([]);
    const [error, setError] = useState(null);
    console.log("estamos en este dia", idDelDiaDeTrabajo);
    // Función para cargar las mesas existentes
    const fetchMesas = async () => {
        if (!idDelDiaDeTrabajo) return; // Evitar que se ejecute si idDelDiaDeTrabajo es null
        try {
            const response = await axios.get(`https://ddf7uggy3c.execute-api.us-east-2.amazonaws.com/mesas/dia-trabajo/${idDelDiaDeTrabajo}`);
            setMesas(response.data.clientes_activos);
        } catch (err) {
            console.error('Error al obtener mesas', err);
            setError('Hubo un problema al obtener las mesas.');
        }
    };

    // Cargar las mesas cuando el componente se monta o cuando cambia idDelDiaDeTrabajo
    useEffect(() => {
        fetchMesas();
    }, [idDelDiaDeTrabajo]); // Ahora depende de idDelDiaDeTrabajo

    const actualizarDatos = useCallback(() => {
        fetchMesas(); // Llamar a la función fetchMesas para actualizar los datos
    }, [idDelDiaDeTrabajo]); // Asegúrate de que esta función depende de idDelDiaDeTrabajo

    // Manejar el cambio de visibilidad
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                actualizarDatos();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [actualizarDatos]);

    return (
        <section className='container'>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <h1>Clientes activos</h1>
        
            <ul className='clientes-activos'>
       
                {mesas.map((mesa) => (
                    <li onClick={() => navigate(`/sistema/editar-cliente/${mesa.id}`)} key={mesa.id}>
                        <h3>{mesa.Nombre}</h3>
                    </li>
                ))}
            </ul>
            
        </section>
    );
};

export default ClientesActivos;
