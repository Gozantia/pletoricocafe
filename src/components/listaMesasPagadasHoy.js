import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ListaMesasPagadasHoy({volverClientesActivos}) {
    const [mesasPagadas, setMesasPagadas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMesasPagadasHoy = async () => {
            setLoading(true);
            setError(null);

            try {
                // Aquí reemplazas la URL con el endpoint correcto de tu API
                const response = await axios.get('https://ddf7uggy3c.execute-api.us-east-2.amazonaws.com/mesas/mesas_pagadas');
                setMesasPagadas(response.data); // Asumimos que la respuesta es un array de mesas
            } catch (err) {
                console.error('Error al obtener las mesas pagadas', err);
                setError('No se pudieron cargar las mesas pagadas hoy');
            } finally {
                setLoading(false);
            }
        };

        fetchMesasPagadasHoy();
    }, []);

    // Formatear la fecha a un formato legible (por ejemplo, 'dd/mm/yyyy hh:mm a')
    const formatearFecha = (fechaISO) => {
        const opciones = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
        return new Date(fechaISO).toLocaleDateString('es-CO', opciones);
    };

    // Calcular el total de ventas de todas las mesas pagadas
    const calcularTotalVentas = () => {
        return mesasPagadas.reduce((total, mesa) => {
            return total + Number(mesa.TotalVenta || 0);
        }, 0).toFixed(2);
    };

     // Calcular el total de ventas por medio de pago (efectivo o transferencia)
     const calcularTotalPorMedioDePago = (medioPago) => {
        return mesasPagadas
            .filter(mesa => mesa.MedioPago === medioPago)
            .reduce((total, mesa) => {
                return total + Number(mesa.TotalVenta || 0);
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
            <h2>Mesas Pagadas Hoy</h2>
            <button onClick={volverClientesActivos}>Volver a Clientes Activos</button>
            <table>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Fecha</th>
                        <th>Productos</th>
                        <th>Medio de pago</th>
                        <th>Total Venta</th>
                    </tr>
                </thead>
                <tbody>
                    {mesasPagadas.length === 0 ? (
                        <tr>
                            <td colSpan="4">No hay mesas pagadas hoy</td>
                        </tr>
                    ) : (
                        <>
                            {mesasPagadas.map((mesa, index) => (
                                <tr key={index}>
                                    <td>{mesa.Nombre}</td>
                                    <td>{formatearFecha(mesa.FechaCreacion)}</td>
                                    <td>
                                        <ul>
                                            {mesa.Productos.map((producto, idx) => (
                                                <li key={idx}>
                                                    {producto.cantidad} - {producto.nombre} (${producto.precio})
                                                </li>
                                            ))}
                                        </ul>
                                    </td>
                                    <td>
                                        {mesa.MedioPago}
                                    </td>
                                    <td>${Number(mesa.TotalVenta || 0).toFixed(2)}</td>
                                </tr>
                            ))}
                             {/* Fila para mostrar el total de ventas por transferencia */}
                             <tr>
                                <td colSpan="4" style={{ fontWeight: 'bold', textAlign: 'right' }}>Transferencia</td>
                                <td style={{ fontWeight: 'bold' }}>${calcularTotalPorMedioDePago('transferencia')}</td>
                            </tr>
                            {/* Fila para mostrar el total de ventas por efectivo */}
                            <tr>
                                <td colSpan="4" style={{ fontWeight: 'bold', textAlign: 'right'  }}>Efectivo</td>
                                <td style={{ fontWeight: 'bold' }}>${calcularTotalPorMedioDePago('efectivo')}</td>
                            </tr>
                            {/* Fila adicional para mostrar el total de ventas */}
                            <tr>
                                <td colSpan="4" style={{ fontWeight: 'bold', textAlign: 'right' }}>Total Ventas:</td>
                                <td style={{ fontWeight: 'bold' }}>${calcularTotalVentas()}</td>
                            </tr>
                        </>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default ListaMesasPagadasHoy;
