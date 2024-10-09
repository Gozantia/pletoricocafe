import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SeleccionarProducto from './SeleccionarProducto';
import TablaProductos from './tablaProductos'; // Importamos el nuevo componente

function AgregarProductos({ mesa, volverClientesActivos }) {
    const [productosMesa, setProductosMesa] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

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

    // Función para calcular el total acumulado (usada en TablaProductos)
    const calcularTotalAcumulado = () => {
        return productosMesa.reduce((total, producto) => {
            return total + (producto.cantidad * producto.precio);
        }, 0).toFixed(2);
    };

    // Función para manejar la actualización de los productos
    const handleActualizar = async () => {
        setLoading(true);
        setError(null);

        try {
            const mesaActualizada = {
                ...mesa,
                Productos: productosMesa // Guardar los productos actualizados
            };

            // Hacer la solicitud PUT para actualizar los productos
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

    return (
        <div>
            <h2>Agregar Productos para {mesa.Nombre}</h2>
            <button onClick={volverClientesActivos}>Volver a Clientes Activos</button>

            {/* Componente SeleccionarProducto */}
            <SeleccionarProducto onSeleccionar={(producto) => {
                // Lógica para agregar producto a la mesa
                setProductosMesa((prevProductos) => [...prevProductos, { ...producto, cantidad: 1 }]);
            }} />

            {loading && <p>Cargando productos...</p>}
            {error && <p>{error}</p>}

            {/* Tabla de productos con el componente reutilizable */}
            <TablaProductos 
                productos={productosMesa} 
                setProductos={setProductosMesa} 
                calcularTotalAcumulado={calcularTotalAcumulado} 
            />

            {/* Botón para actualizar la mesa */}
            <button onClick={handleActualizar} disabled={loading}>Actualizar</button>
        </div>
    );
}

export default AgregarProductos;
