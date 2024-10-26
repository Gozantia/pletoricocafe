import React, { useEffect, useState } from 'react';
import axios from 'axios';
const VentasMes = () => {
  const [estadisticas, setEstadisticas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);  


  
    const fetchVentasMes = async () => {
        setLoading(true);
        setError(null);

        try {
                // Aquí reemplazas la URL con el endpoint correcto de tu API
                const response = await axios.get('https://ddf7uggy3c.execute-api.us-east-2.amazonaws.com/mesas/mesas_pagadas/ventas-mes');
              
               
                // Asegúrate de que `data` sea lo que necesitas
                const ventas = Object.values(response.data.data); 
                console.log("esto es", ventas);// Convertir el objeto en un array
                setEstadisticas(ventas);
               
           } catch (err) {
            console.error('Error al obtener las mesas pagadas', err);
            setError('No se pudieron cargar las mesas pagadas hoy');
        } finally {
            setLoading(false);
        }
    };

    // Cargar las mesas cuando el componente se monta
    useEffect(() => {
        fetchVentasMes();
    }, []);



   // Calcular el total de ventas de todas las mesas pagadas
   const calcularTotalVentas = () => {
    return estadisticas.reduce((total, estadistica) => {
        return total + Number(estadistica.total_venta || 0);
    }, 0).toFixed(2);
};

if (loading) {
    return <div>Cargando...</div>; // Mostrar mensaje de carga
}

if (error) {
    return <div>Error: {error}</div>; // Mostrar mensaje de error
}

  return (
    <div>
      <h1>Estadísticas de Ventas del Mes</h1>
      {loading && <p>Cargando estadísticas...</p>}
      {error && <p>{error}</p>}

      {!loading && !error && (
        <table>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Transferencia</th>
              <th>Efectivo</th>
              <th>Total Venta</th>
            </tr>
          </thead>
          <tbody>
            {estadisticas.map((dia, index) => (
              <tr key={index}>
                <td>{dia.fecha}</td>
                <td>{dia.transferencia}</td>
                <td>{dia.efectivo}</td>
                <td>{dia.total_venta}</td>
              </tr>
            ))}
         
            <tr>
                                <td colSpan="3" style={{ fontWeight: 'bold', textAlign: 'center' }}>Total Ventas: ${calcularTotalVentas()}
                                    </td>
            </tr>
          
          </tbody>
        </table>
      )}
    </div>

  );
};

export default VentasMes;
