import React from 'react';

function TablaProductos({ productos, setProductos }) {
    // Validación adicional para asegurarse de que `productos` no sea undefined o null
    if (!productos) {
        return <p>No se han cargado productos</p>;
    }

    // Función para incrementar la cantidad de un producto
    const aumentarCantidad = (id) => {
        setProductos((prev) => {
            // Verificamos si el producto existe antes de actualizarlo
            const nuevoProductos = prev.map((producto) => {
                if (producto.id === id) {
                    console.log("Aumentando cantidad de producto:", producto);
                    return { ...producto, cantidad: producto.cantidad + 1 };
                }
                return producto;
            });
            console.log("Productos después de incrementar:", nuevoProductos);
            return nuevoProductos;
        });
    };

    // Función para decrementar la cantidad de un producto
    const disminuirCantidad = (id) => {
        setProductos((prev) => {
            // Verificamos si el producto existe y tiene más de 1 para evitar que sea 0
            const nuevoProductos = prev.map((producto) => {
                if (producto.id === id && producto.cantidad > 1) {
                    console.log("Disminuyendo cantidad de producto:", producto);
                    return { ...producto, cantidad: producto.cantidad - 1 };
                }
                return producto;
            });
            console.log("Productos después de disminuir:", nuevoProductos);
            return nuevoProductos;
        });
    };

    // Función para calcular el total acumulado
    const calcularTotalAcumulado = () => {
        return productos.reduce((total, producto) => {
            return total + producto.cantidad * producto.precio;
        }, 0).toFixed(0); // Convertir a número con dos decimales
    };

    // Función para eliminar un producto de la lista
    const eliminarProducto = (id) => {
        setProductos((prevProductos) => {
            // Filtramos el producto eliminado
            const productosActualizados = prevProductos.filter((producto) => producto.id !== id);
            console.log("Productos después de eliminar:", productosActualizados);
            return productosActualizados;
        });
    };

    return (
        <div className="table-container">
            {productos.length > 0 ? (
                <table className='products-table'>
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Cantidad</th>
                            <th>Precio</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {productos.map((producto) => (
                            <tr key={producto.id}> {/* Asegúrate de usar `producto.id` como key */}
                                <td className='tabla__prod-nombre'>{producto.nombre}</td>
                                <td className='tabla__prod-cantidad'>
                                    {/* Botón para decrementar la cantidad, visible solo si la cantidad > 1 */}
                                    {producto.cantidad > 1 && (
                                        <button type="button" onClick={() => disminuirCantidad(producto.id)}>-</button>
                                    )}
                                    {producto.cantidad}
                                    {/* Botón para incrementar la cantidad */}
                                    <button type="button" onClick={() => aumentarCantidad(producto.id)}> + </button>
                                    {/* Botón para eliminar el producto de la tabla */}
                                    <button onClick={() => eliminarProducto(producto.id)}> X </button>
                                </td>
                                <td className='tabla__prod-precio'>${producto.precio}</td>
                                <td>${(producto.cantidad * producto.precio).toFixed(0)}</td>
                            </tr>
                        ))}
                        {/* Fila para el total acumulado */}
                        <tr>
                            <td colSpan="1" style={{ textAlign: 'right' }}><strong>Total</strong></td>
                            <td colSpan="3"><h3 className="total_tabla">${calcularTotalAcumulado()} </h3></td>
                        </tr>
                    </tbody>
                </table>
            ) : (
                <p>No hay productos seleccionados</p>
            )}
        </div>
    );
}

export default TablaProductos;
