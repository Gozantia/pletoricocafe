import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SeleccionarProducto from './SeleccionarProducto';
import TablaProductos from './tablaProductos';
import { useNavigate, useParams } from 'react-router-dom';

function EditarCliente() {
    const { id } = useParams(); // Obtener el id de la URL
    const navigate = useNavigate();
    const [productosMesa, setProductosMesa] = useState([]);
    const [mesaInfo, setMesaInfo] = useState(null); // Estado para guardar la información de la mesa
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [pagarVisible, setPagarVisible] = useState(false);
    const [medioPago, setMedioPago] = useState('');
    const [pagoCon, setPagoCon] = useState(0);
    const [montoEfectivo,setMontoEfectivo] = useState(0);
    const [montoTransferencia,setMontoTransferencia] = useState(0);
    // Consultar la información de la mesa y sus productos
    useEffect(() => {
        const fetchProductos = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await axios.get(`https://ddf7uggy3c.execute-api.us-east-2.amazonaws.com/mesas/mesas/${id}`);
                setProductosMesa(response.data.Productos); // Asumimos que la respuesta contiene una propiedad 'Productos'
                setMesaInfo(response.data); // Guardar toda la información de la mesa
            } catch (err) {
                console.error('Error al obtener los productos de la mesa', err);
                setError('No se pudieron cargar los productos');
            } finally {
                setLoading(false);
            }
        };

        fetchProductos();
    }, [id]);

    // Función para calcular el total acumulado
    const calcularTotalAcumulado = () => {
        return productosMesa.reduce((total, producto) => {
            return total + (producto.cantidad * producto.precio);
        }, 0).toFixed(0);
    };

    // Función para manejar la actualización de los productos
    const handleActualizar = async () => {
        setLoading(true);
        setError(null);

        try {
            const mesaActualizada = {
                ...mesaInfo, // Usar mesaInfo en lugar de mesa
                Productos: productosMesa // Guardar los productos actualizados
            };

            const response = await axios.put(`https://ddf7uggy3c.execute-api.us-east-2.amazonaws.com/mesas/mesas/${mesaInfo.id}`, mesaActualizada);

            navigate('/sistema');
        } catch (err) {
            console.error('Error al actualizar la mesa', err);
            setError('No se pudo actualizar la mesa');
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
        const totalAcumulado = calcularTotalAcumulado();
        const cambio = pagoCon > 0 ? pagoCon - totalAcumulado : 0;

        if (medioPago === 'efectivo' && cambio < 0) {
            alert('El monto ingresado no cubre el total.');
            return;
        }

        const mesaActualizada = {
            ...mesaInfo,
            Estado: "Pagado",
            Productos: productosMesa,
            TotalVenta: totalAcumulado,
            MedioPago: medioPago
        };

        if (medioPago === 'transfecash') {
            mesaActualizada.monto_efectivo = montoEfectivo;
            mesaActualizada.monto_transferencia = montoTransferencia;
        }

        try {
            setLoading(true);
            await axios.put(`https://ddf7uggy3c.execute-api.us-east-2.amazonaws.com/mesas/mesas/${mesaInfo.id}`, mesaActualizada);
            navigate('/sistema/mesas-pagadas');
            console.log("Enviando mesaActualizada:", mesaActualizada);
        } catch (err) {
            console.error('Error al actualizar la mesa', err);
            setError('No se pudo realizar el pago');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className='container'>
            {loading && <p>Cargando productos...</p>}
            {error && <p>{error}</p>}
            
            {mesaInfo ? (
                <>
                    <h2 className='nombre-cliente'>{mesaInfo.Nombre}</h2>

                    {/* Componente SeleccionarProducto */}
                    <SeleccionarProducto onSeleccionar={(producto) => {
                        setProductosMesa((prevProductos) => [...prevProductos, { ...producto, cantidad: 1 }]);
                    }} />

                    {/* Tabla de productos con el componente reutilizable */}
                    <TablaProductos 
                        productos={productosMesa} 
                        setProductos={setProductosMesa} 
                        calcularTotalAcumulado={calcularTotalAcumulado} 
                    />

                    {/* Botón para actualizar la mesa */}
                   <div className='actions'>
                    <button onClick={handleActualizar} disabled={loading}>Actualizar</button>

                    {/* Botón para pagar */}
                    <button onClick={handlePagarClick} disabled={loading}>Pagar</button>

                    {pagarVisible && (
                        <div>
                            
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
                            <label>
                                <input
                                    type="radio"
                                    value="transfecash"
                                    checked={medioPago === 'transfecash'}
                                    onChange={(e) => setMedioPago(e.target.value)}
                                />
                                Transfe y efectivo
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

                        {medioPago === 'transfecash' && ( 
                            <div> <label>
                                Parte en efectivo
                                <input type="number" placeholder="Monto en efectivo" value={montoEfectivo} onChange={(e) => setMontoEfectivo(Number(e.target.value))} />
                                </label>
                                 
                                <label>
                                Parte en tranferencia
                                <input type="number" placeholder="Monto en transferencia" value={montoTransferencia} onChange={(e) => setMontoTransferencia(Number(e.target.value))} />
                               
                                </label>
                            </div>
                         )}
                              <h4 className='valor_total'>Total: ${calcularTotalAcumulado()}</h4>
                            <button onClick={manejarPago} disabled={loading} className='button-listo'>Listo</button>
                        </div>
                
                    )}
                 </div>
                </>
            ) : (
                <p>Cargando información de la mesa...</p>
            )}
        </section>
    );
}

export default EditarCliente;
