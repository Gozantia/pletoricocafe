import React, { useState } from 'react';
import axios from 'axios';
import SeleccionarProducto from './SeleccionarProducto';
function CrearCliente({ volverClientesActivos }) {
    const [loading, setLoading] = useState(false);
    const [nombre, setNombre] = useState('N.N');  // Nombre por defecto "N.N"
    const [error, setError] = useState(null);  // Se mantiene el manejo de error
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
                Productos: productosSeleccionados.map(producto => ({
                    id: producto.id,
                    nombre: producto.nombre,
                    cantidad: producto.cantidad,
                    precio: producto.precio
                })) 
            };
    
            // Hacer la solicitud POST a la API
            const response = await axios.post('https://ddf7uggy3c.execute-api.us-east-2.amazonaws.com/mesas/mesas', newMesa);
            console.log('Nueva mesa creada:', response.data);
    
            // Después de crear la mesa, volver automáticamente a Clientes Activos
            volverClientesActivos();
        } catch (err) {
            console.error('Error al crear mesa', err);
            setError('No se pudo crear la mesa');  // Actualizar estado de error si ocurre
        } finally {
            setLoading(false);
        }
    };


    const handleSeleccionarProducto = (producto) => {
        if (producto) {
          const nuevoProducto = {
            id: producto.id, // Asegúrate de incluir el id para identificar el producto
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
    
      // Función para incrementar la cantidad
      const aumentarCantidad = (id) => {
        setProductosSeleccionados((prev) =>
          prev.map((producto) => {
            if (producto.id === id) {
              return { ...producto, cantidad: producto.cantidad + 1 };
            }
            return producto;
          })
        );
      };
    
      
      // Calcular el total acumulado
  const calcularTotalAcumulado = () => {
    return productosSeleccionados.reduce((total, producto) => {
      return total + producto.cantidad * producto.precio;
    }, 0).toFixed(2); // Convertir a número con dos decimales
  };

    return ( 
        <div>
            {/* Botón para volver a la lista de clientes activos */}
            <button onClick={volverClientesActivos}>Volver a Clientes Activos</button>

            <h3>Ring Ring ¡Llegó alguien!</h3>

            {/* Mostrar el mensaje de error si existe */}
            {error ? (
                <p style={{ color: 'red' }}>{error}</p>
            ) : null}

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
                    {/* Usar el componente SeleccionarProducto */}
                        <SeleccionarProducto onSeleccionar={handleSeleccionarProducto} />
                </div>
                {/* Lista de productos seleccionados */}
                     {/* Tabla de productos seleccionados */}
                <table>
                    <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Cantidad</th>
                        <th>Precio</th>
                    </tr>
                    </thead>
                    <tbody>
                    {productosSeleccionados.map((producto, index) => (
                        <tr key={index}>
                        <td>{producto.nombre}</td>
                        <td>
                        <button type="button" onClick={() => aumentarCantidad(producto.id)}>+</button>
                            {producto.cantidad}


                        </td>
                        <td>${producto.precio}</td>
                        <td>${(producto.cantidad * producto.precio).toFixed(2)}</td>
                        </tr>
                    ))}
                    {/* Fila para el total acumulado */}
                        <tr>
                            <td colSpan="3" style={{ textAlign: 'right' }}><strong>Total</strong></td>
                            <td>${calcularTotalAcumulado()}</td>
                        </tr>
                    </tbody>
                </table>

                <button type="submit" disabled={loading}>
                    {loading ? 'Creando...' : 'Guardar cliente'}
                </button>
            </form>
        </div>
    );
}

export default CrearCliente;
