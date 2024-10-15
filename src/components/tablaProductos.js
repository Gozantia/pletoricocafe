import React from 'react';

function TablaProductos({ productos, setProductos }) {
    // Función para incrementar la cantidad de un producto
    const aumentarCantidad = (id) => {
        setProductos((prev) =>
            prev.map((producto) => {
                if (producto.id === id) {
                    return { ...producto, cantidad: producto.cantidad + 1 };
                }
                return producto;
            })
        );
    };

    // Función para decrementar la cantidad de un producto
    const disminuirCantidad = (id) => {
        setProductos((prev) =>
            prev.map((producto) => {
                if (producto.id === id && producto.cantidad > 1) {
                    return { ...producto, cantidad: producto.cantidad - 1 };
                }
                return producto;
            })
        );
    };

    // Función para calcular el total acumulado
    const calcularTotalAcumulado = () => {
        return productos.reduce((total, producto) => {
            return total + producto.cantidad * producto.precio;
        }, 0).toFixed(2); // Convertir a número con dos decimales
    };

    // Función para eliminar un producto de la lista
    const eliminarProducto = (index) => {
        setProductos((prevProductos) => prevProductos.filter((_, i) => i !== index));
    };

    return ( <>
      {productos.length > 0 ? <table className='products-table'>
            <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Cantidad</th>
                    <th>Precio</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>
                {productos.map((producto, index) => (
                    <tr key={index}>
                        <td>{producto.nombre}</td>
                        <td>
                            {/* Botón para decrementar la cantidad, visible solo si la cantidad > 1 */}
                            {producto.cantidad > 1 && (
                                <button type="button" onClick={() => disminuirCantidad(producto.id)}>-</button>
                            )}
                            {producto.cantidad}
                            {/* Botón para incrementar la cantidad */}
                            <button type="button" onClick={() => aumentarCantidad(producto.id)}>+</button>
                             {/* Botón para eliminar el producto de la tabla */}
                            <button onClick={() => eliminarProducto(index)}> X </button>

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
        </table> : "" }
    </> );
}

export default TablaProductos;
