import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TablaProductos from './tablaProductos'; // Asegúrate de importar el componente correctamente

function Pagar({mesa, volverClientesActivos}){
    const [productosMesa, setProductosMesa] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [medioPago, setMedioPago] = useState('efectivo'); // Estado para el medio de pago

    // Consultar la información de los productos de la mesa seleccionada
    useEffect(() => {
        const fetchProductos = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await axios.get(`https://ddf7uggy3c.execute-api.us-east-2.amazonaws.com/mesas/mesas/${mesa.id}`);
                setProductosMesa(response.data.Productos); // Asumimos que la respuesta contiene una propiedad 'Productos'
            } catch (err) {
                console.error('Error al obtener los productos de la mesa', err);
                setError('No se pudieron cargar los productos');
            } finally {
                setLoading(false);
            }
        };

        fetchProductos();
    }, [mesa.id]);

    // Función para manejar el pago
    const manejarPago = async () => {
        const totalVenta = calcularTotalAcumulado();

        const mesaActualizada = {
            ...mesa,
            Estado: "Pagado", // Cambiar el estado a "Pago"
            TotalVenta: totalVenta, // Total acumulado
            Productos: productosMesa,
            MedioPago: medioPago // Mantener la lista de productos
        };

        // Hacer la solicitud PUT para actualizar el cliente
        try {
            setLoading(true);
            const response = await axios.put(`https://ddf7uggy3c.execute-api.us-east-2.amazonaws.com/mesas/mesas/${mesa.id}`, mesaActualizada);
            console.log('Mesa actualizada con éxito:', response.data);
            alert('Mesa actualizada con éxito');
        } catch (err) {
            console.error('Error al actualizar la mesa', err);
            setError('No se pudo actualizar la mesa'); // Mostrar el error
        } finally {
            setLoading(false);
        }
    };

    // Calcular el total acumulado
    const calcularTotalAcumulado = () => {
        return productosMesa.reduce((total, producto) => {
            return total + (producto.cantidad * producto.precio);
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
            <h2>Pagar para {mesa.Nombre} </h2>

            <TablaProductos 
                productos={productosMesa} 
                setProductos={setProductosMesa} 
                calcularTotalAcumulado={calcularTotalAcumulado} 
            />

            <label>Medio de Pago:</label>
            <div>
                <label>
                    <input
                        type="radio"
                        value="efectivo"
                        checked={medioPago === 'efectivo'}
                        onChange={(e) => setMedioPago(e.target.value)}
                    />
                    Efectivo
                </label>
                <label>
                    <input
                        type="radio"
                        value="transferencia"
                        checked={medioPago === 'transferencia'}
                        onChange={(e) => setMedioPago(e.target.value)}
                    />
                    Transferencia
                </label>
            </div>

            <div>
                <strong>Total: ${calcularTotalAcumulado()}</strong>
            </div>

            <button onClick={manejarPago}>Pagar</button>

            <button onClick={volverClientesActivos}>Volver a Clientes Activos</button>
        </div>
    );
}

export default Pagar;