import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SeleccionarProducto from './SeleccionarProducto';

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

    // Función para incrementar la cantidad de un producto
    const incrementarCantidad = (index) => {
        setProductosMesa((prevProductos) => {
            const nuevosProductos = [...prevProductos];
            nuevosProductos[index] = {
                ...nuevosProductos[index],
                cantidad: nuevosProductos[index].cantidad + 1 // Incrementa solo 1
            };
            return nuevosProductos;
        });
    };

// Función para decrementar la cantidad de un producto
const decrementarCantidad = (index) => {
    setProductosMesa((prevProductos) => {
        const nuevosProductos = [...prevProductos];
        
        // Solo restamos si la cantidad actual es mayor que 1
        if (nuevosProductos[index].cantidad > 1) {
            nuevosProductos[index] = {
                ...nuevosProductos[index],
                cantidad: nuevosProductos[index].cantidad - 1 // Resta solo 1
            };
        }

        return nuevosProductos;
    });
};


    // Función para calcular el total acumulado
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

            {/* Tabla de productos de la mesa */}
            <table>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Cantidad</th>
                        <th>Precio</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    {productosMesa.map((producto, index) => (
                        <tr key={index}>
                            <td>{producto.nombre}</td>
                            <td>
                                <button onClick={() => decrementarCantidad(index)}>-</button>
                                {producto.cantidad} 
                                <button onClick={() => incrementarCantidad(index)}>+</button>
                            </td>
                            <td>${producto.precio}</td>
                            <td>${(producto.cantidad * producto.precio).toFixed(2)}</td>
                        </tr>
                    ))}
                    {/* Fila para el total acumulado */}
                    <tr>
                        <td colSpan="3"><strong>Total</strong></td>
                        <td>${calcularTotalAcumulado()}</td>
                    </tr>
                </tbody>
            </table>

            {/* Botón para actualizar la mesa */}
            <button onClick={handleActualizar} disabled={loading}>Actualizar</button>
        </div>
    );
}

export default AgregarProductos;
