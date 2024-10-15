import React, { useState } from 'react';
import axios from 'axios';
import SeleccionarProducto from './SeleccionarProducto';
import TablaProductos from './tablaProductos'; // Importamos el nuevo componente TablaProductos

function CrearCliente({ volverClientesActivos }) {
    const [loading, setLoading] = useState(false);
    const [nombre, setNombre] = useState('N.N'); // Nombre por defecto "N.N"
    const [error, setError] = useState(null); // Manejamos errores
    const [productosSeleccionados, setProductosSeleccionados] = useState([]);

    // Función para manejar la creación de una nueva mesa
    const handleCreateMesa = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Crear el objeto para la nueva mesa
            const newMesa = {
                Nombre: nombre,
                Estado: 'activo',
                Productos: productosSeleccionados // Enviamos los productos seleccionados
            };

            // Hacer la solicitud POST a la API
            const response = await axios.post('https://ddf7uggy3c.execute-api.us-east-2.amazonaws.com/mesas/mesas', newMesa);
            console.log('Nueva mesa creada:', response.data);

            // Volver a la lista de clientes activos
            volverClientesActivos();
        } catch (err) {
            console.error('Error al crear mesa', err);
            setError('No se pudo crear la mesa');
        } finally {
            setLoading(false);
        }
    };

    // Función para manejar la selección de un producto
    const handleSeleccionarProducto = (producto) => {
        if (producto) {
            const nuevoProducto = {
                id: producto.id,
                nombre: producto.nombre,
                cantidad: 1, // Inicialmente 1
                precio: producto.precio
            };

            setProductosSeleccionados((prev) => [...prev, nuevoProducto]);

            console.log('Producto seleccionado:', nuevoProducto);
        } else {
            console.log('No se ha seleccionado ningún producto');
        }
       
    };

    return (
        <div>
            {/* Botón para volver a la lista de clientes activos */}
            <button onClick={volverClientesActivos}>Volver a Clientes Activos</button>

            <h3>Ring Ring ¡Llegó alguien!</h3>

            {/* Mostrar el mensaje de error si existe */}
            {error ? <p style={{ color: 'red' }}>{error}</p> : null}

            {/* Formulario para crear o editar una mesa */}
            <form onSubmit={handleCreateMesa}>
                <div>
                    <label htmlFor="Nombre">Nuevo cliente:</label>
                    <input
                        type="text"
                        id="Nombre"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        required
                    />

                    {/* Componente SeleccionarProducto */}
                    <SeleccionarProducto onSeleccionar={handleSeleccionarProducto} />
                </div>

                {/* Tabla de productos seleccionados */}
                <TablaProductos
                    productos={productosSeleccionados}
                    setProductos={setProductosSeleccionados}
                />

                <button type="submit" disabled={loading}>
                    {loading ? 'Creando...' : 'Guardar cliente'}
                </button>
            </form>
        </div>
    );
}

export default CrearCliente;