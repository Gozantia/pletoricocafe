import React, { useEffect, useState } from 'react';

const GastosDelMes = ({ onTotalGastosChange }) => {
    const [gastos, setGastos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Obtener el año y mes actuales
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1; // getMonth() devuelve 0 para enero, por lo que sumamos 1

        // Endpoint de la API
        const apiUrl = `https://ddf7uggy3c.execute-api.us-east-2.amazonaws.com/mesas/gastos/consulta-mes?year=${year}&month=${month}`;

        // Realizar la solicitud
        const fetchData = async () => {
            try {
                const response = await fetch(apiUrl);
                if (!response.ok) {
                    throw new Error('Error al consultar los gastos del mes');
                }
                const data = await response.json();
                setGastos(data.data); // Asume que los datos de gastos están en la clave `data`
               
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []); // Solo se ejecuta al montar el componente
   
    const filteredItems = gastos.filter(gasto => gasto.total_gastos !== 0);
    const gastosOrdenados = filteredItems.sort((a, b) => new Date(b.fecha_inicio) - new Date(a.fecha_inicio));

    // Calcular totales
    const totalEfectivo = gastosOrdenados.reduce((acc, gasto) => acc + (gasto.gastos_efectivo || 0), 0).toLocaleString('es-ES');
    const totalTransferencia = gastosOrdenados.reduce((acc, gasto) => acc + (gasto.gastos_transferencia || 0), 0).toLocaleString('es-ES');
    const totalGastos = gastosOrdenados.reduce((acc, gasto) => acc + (gasto.total_gastos || 0), 0).toLocaleString('es-ES');

    // Notificar al componente padre cuando cambie `totalGastos`
    useEffect(() => {
        onTotalGastosChange(totalGastos);
    }, [totalGastos, onTotalGastosChange]);


    
    // Función para extraer solo mes y día en formato "MM-DD"
    const formatFecha = (fecha) => {
        const date = new Date(fecha);
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Mes en formato 2 dígitos
        const day = String(date.getDate()).padStart(2, '0');         // Día en formato 2 dígitos
        return `${month}/${day}`;
    };

    if (loading) return <p>Cargando gastos del mes...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <h2>Gastos del Mes </h2>
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
                    {gastosOrdenados.map((gasto, index) => (
                        gasto.total_gastos !== 0 && (
                        <tr key={index}>
                            <td>{formatFecha(gasto.fecha_inicio)}</td>
                            <td>{(gasto.gastos_efectivo || 0).toLocaleString('es-ES')}</td>
                            <td>{(gasto.gastos_transferencia || 0).toLocaleString('es-ES')}</td>
                            <td>{(gasto.total_gastos || 0).toLocaleString('es-ES')}</td>
                        </tr>
                        )
                    ))}
                    <tr>
                        <td><strong>Totales</strong></td>
                        <td><strong>{totalEfectivo}</strong></td>
                        <td><strong>{totalTransferencia}</strong></td>
                        <td><strong>{totalGastos}</strong></td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default GastosDelMes;
