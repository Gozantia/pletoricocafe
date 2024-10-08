import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ClientesActivos = ({ onAgregar, onPagar, onCrearCliente }) => { 
    const [mesas, setMesas] = useState([]);
    const [error, setError] = useState(null);

    // Cargar las mesas existentes
    useEffect(() => {
        const fetchMesas = async () => {
            try {
                const response = await axios.get('https://ddf7uggy3c.execute-api.us-east-2.amazonaws.com/mesas/mesas');
                setMesas(response.data);
                console.log('Mesas cargadas:', response.data);
            } catch (err) {
                console.error('Error al obtener mesas', err);
                setError('No se pudieron cargar las mesas');
            }
        };

        fetchMesas();
    }, []);

  


    
    return (
        <div>
             {error && <p style={{ color: 'red' }}>{error}</p>}
            <h1>Clientes activos</h1>
        
            <ul className='clientes-activos'>
                <li className='nuevo_cliente'  onClick={onCrearCliente}>
                <h3>+ Nuevo cliente</h3>
                </li>
                {mesas.map((mesa) => (
                    <li key={mesa.id}>
                        <h3>{mesa.Nombre} </h3>
                        <div className='acciones'>
                            <div onClick={() => onAgregar(mesa)}>+ Agregar</div>
                            <div onClick={() => onPagar(mesa)}>$ Pagar</div>
                        </div>
                    </li>
                ))}
              
            </ul>
        </div>
    );
};
export default ClientesActivos;

