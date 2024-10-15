import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SeleccionarProducto from './SeleccionarProducto';
import TablaProductos from './tablaProductos';

function AgregarProductos({ mesa, volverClientesActivos }) {
    const [productosMesa, setProductosMesa] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [pagarVisible, setPagarVisible] = useState(false);
    const [medioPago, setMedioPago] = useState('');
    const [pagoCon, setPagoCon] = useState(0);

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

    // Mostrar la sección de pago cuando se selecciona "Pagar"
    const handlePagarClick = () => {
        setPagarVisible(true);
    };

    // Manejar el pago cuando se selecciona "Listo"
    const manejarPago = async () => {
        const totalAcumulado = calcularTotalAcumulado(); // Calcular el total aquí
        const cambio = pagoCon > 0 ? pagoCon - totalAcumulado : 0; // Calcular cambio aquí

        if (medioPago === 'efectivo' && cambio < 0) {
            alert('El monto ingresado no cubre el total.');
            return;
        }

        const mesaActualizada = {
            ...mesa,
            Estado: "Pagado",
            Productos: productosMesa,
            TotalVenta: totalAcumulado,
            MedioPago: medioPago
        };

        try {
            setLoading(true);
            const response = await axios.put(`https://ddf7uggy3c.execute-api.us-east-2.amazonaws.com/mesas/mesas/${mesa.id}`, mesaActualizada);
            console.log('Mesa pagada con éxito:', response.data);
            alert('Pago realizado con éxito');
        } catch (err) {
            console.error('Error al actualizar la mesa', err);
            setError('No se pudo realizar el pago');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2> {mesa.Nombre}</h2>
            <button onClick={volverClientesActivos}>Volver</button>

            {/* Componente SeleccionarProducto */}
            <SeleccionarProducto onSeleccionar={(producto) => {
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

            {/* Botón para pagar */}
            <button onClick={handlePagarClick} disabled={loading}>Pagar</button>

            {/* Sección de pago visible solo cuando se selecciona pagar */}
            {pagarVisible && (
                <div>
                    <h3>Pagar</h3>

                    {/* Opciones de pago */}
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

                    {/* Mostrar campo "pagoCon" si el medio de pago es efectivo */}
                    {medioPago === 'efectivo' && (
                        <div>
                            <label>
                                Pago con:
                                <input
                                    type="number"
                                    value={pagoCon}
                                    onChange={(e) => setPagoCon(Number(e.target.value))}
                                />
                            </label>

                            {/* Calcular total acumulado aquí */}
                            <div>Total: ${calcularTotalAcumulado()}</div>

                            {/* Mostrar cambio si el pago cubre el total */}
                            {pagoCon > 0 && pagoCon >= calcularTotalAcumulado() && (
                                <div>
                                    <strong>Cambio: ${(pagoCon - calcularTotalAcumulado()).toFixed(2)}</strong>
                                </div>
                            )}

                            {/* Mostrar mensaje si el pago no cubre el total */}
                            {pagoCon > 0 && pagoCon < calcularTotalAcumulado() && (
                                <div style={{ color: 'red' }}>
                                    El monto no cubre el total de la compra.
                                </div>
                            )}
                        </div>
                    )}

                    <button onClick={manejarPago} disabled={loading}>Listo</button>
                </div>
            )}
        </div>
    );
}

export default AgregarProductos;
