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
        }, 0).toFixed(0); // Convertir a número con dos decimales
    };

    // Función para eliminar un producto de la lista
    const eliminarProducto = (index) => {
        setProductos((prevProductos) => prevProductos.filter((_, i) => i !== index));
    };

    return ( <>
     <div className="table-container">
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
                        <td className='tabla__prod-nombre'>{producto.nombre}</td>
                        <td className='tabla__prod-cantidad'>
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
                        <td className='tabla__prod-precio'>${producto.precio}</td>
                        <td>${(producto.cantidad * producto.precio).toFixed(0)}</td>
                    </tr>
                ))}
                {/* Fila para el total acumulado */}
                <tr>
                    <td colSpan="1"  style={{ textAlign: 'right' }}><strong>Total</strong></td>
                    <td colSpan="3"  ><h3 className="total_tabla">${calcularTotalAcumulado()} </h3></td>
                </tr>
            </tbody>
        </table> : "" }
        </div>
    </> );
}

export default TablaProductos;
