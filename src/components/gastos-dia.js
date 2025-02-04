import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useDiaTrabajo } from '../DiaTrabajoContext';

const GastosDia = () => { 
    const { idDelDiaDeTrabajo } = useDiaTrabajo();
    const [gastosDia, setGastosDia] = useState([]);
    const [error, setError] = useState(null);
    

    // Función memoizada para cargar las Gastos existentes
    const fetchGastos = useCallback(async () => {
        if (!idDelDiaDeTrabajo) return;
        try {
            const response = await axios.get(`https://ddf7uggy3c.execute-api.us-east-2.amazonaws.com/mesas/dia-trabajo/${idDelDiaDeTrabajo}/gastos`);
            setGastosDia(response.data);
            console.log( "este es el id del día de los gastos", idDelDiaDeTrabajo, "y esto es lo que esta encontrando", response.data )
        } catch (err) {
            console.error('Error al obtener los egresos', err);
            setError('Aún no hemos comprado una mondá');
        }
    }, [idDelDiaDeTrabajo]);

    // Cargar mesas al montar el componente
  
    useEffect(() => {
        fetchGastos();
    }, [fetchGastos]);
      /*    
    // Función para actualizar las mesas cuando la pestaña esté visible
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                fetchGastos();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [fetchGastos]); // Agregamos fetchMesas a las dependencias aquí también

   */ 
    return (
        <section>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <h1>Egresos registrados</h1>
            <ul className='clientes-activos gastos'>
                {gastosDia.map((gasto) => (
                    <li key={gasto.id} id={gasto.id}  >
                        <h3>{gasto.descripcion}</h3>
                        <span>{gasto.valor}</span>
                    </li>
                ))}
            </ul>
      
           
        </section>
    );
};

export default GastosDia;
