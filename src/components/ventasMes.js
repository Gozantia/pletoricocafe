import React, { useEffect, useState } from 'react';

const VentasDelMes = ({ onTotalVentasChange }) => {
    const [ventas, setVentas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Obtener el año y mes actuales
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1; // getMonth() devuelve 0 para enero, por lo que sumamos 1

        // Endpoint de la API
        const apiUrl = `https://ddf7uggy3c.execute-api.us-east-2.amazonaws.com/mesas/ventas/consulta-mes?year=${year}&month=${month}`;

        // Realizar la solicitud
        const fetchData = async () => {
            try {
                const response = await fetch(apiUrl);
                if (!response.ok) {
                    throw new Error('Error al consultar las ventas del mes');
                }
                const data = await response.json();
                setVentas(data.data); // Asume que los datos de ventas están en la clave `data`
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []); // Solo se ejecuta al montar el componente
   
    const filteredItems = ventas.filter(venta => venta.total_ventas !== 0);
    const ventasOrdenadas=filteredItems.sort((a, b) => new Date(b.fecha_inicio) - new Date(a.fecha_inicio));
    const diasTrabajados= filteredItems.length

    // Calcular totales
    const totalEfectivo = ventasOrdenadas.reduce((acc, venta) => acc + (venta.total_efectivo || 0), 0).toLocaleString('es-ES');
    const totalTransferencia = ventasOrdenadas.reduce((acc, venta) => acc + (venta.total_transferencia || 0), 0).toLocaleString('es-ES');
    const totalVentas = ventasOrdenadas.reduce((acc, venta) => acc + (venta.total_ventas || 0), 0).toLocaleString('es-ES');

      // Notificar al componente padre cuando cambie `totalVentas`
        useEffect(() => {
            onTotalVentasChange(totalVentas);
        }, [totalVentas, onTotalVentasChange]);

    // Función para extraer solo mes y día de la fecha_inicio
     // Función para extraer solo mes y día en formato "MM-DD"
     const formatFecha = (fecha) => {
        const date = new Date(fecha);
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Mes en formato 2 dígitos
        const day = String(date.getDate()).padStart(2, '0');         // Día en formato 2 dígitos
        return `${month}/${day}`;
    };


    if (loading) return <p>Cargando ventas del mes...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
        <h2>Ventas del Mes </h2>
        <span> Número de días trabajados:  {diasTrabajados} </span>
        <table>
            <thead>
                <tr>
                    <th>Fecha</th>
                    <th>Efectivo</th>
                    <th>Transfe</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>
                {ventasOrdenadas.map((venta, index) => (
                    <tr key={index} className={venta.total_ventas > 300000 ? 'ventas-mas-altas' :
                                    venta.total_ventas >  180000 ? 'ventas-altas' :
                                    venta.total_ventas < 103000 ? 'ventas-bajas' : ''
                    }>
                        <td>{formatFecha(venta.fecha_inicio)}</td>
                        <td>{venta.total_efectivo.toLocaleString('es-ES')}</td>
                        <td>{venta.total_transferencia.toLocaleString('es-ES')}</td>
                        <td >{venta.total_ventas.toLocaleString('es-ES')}</td>
                    </tr>
                ))}
                {/* Fila de Totales */}
                <tr>
                    <td><strong>Totales</strong></td>
                    <td><strong>{totalEfectivo}</strong></td>
                    <td><strong>{totalTransferencia}</strong></td>
                    <td><strong>{totalVentas}</strong></td>
                </tr>
            </tbody>
        </table>
    </div>
    );
};

export default VentasDelMes;
