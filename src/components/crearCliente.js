import React, { useState } from 'react';
import axios from 'axios';
import SeleccionarProducto from './SeleccionarProducto';
import TablaProductos from './tablaProductos'; // Importamos el nuevo componente TablaProductos
import sugerenciasNombres from '../sugerencias_nombres_mesas.json'; // Importamos el archivo JSON de sugerencias
import { useNavigate } from 'react-router-dom';

function CrearCliente({ onVerMesasPagadasHoy }) {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [nombre, setNombre] = useState(' '); // Nombre por defecto "N.N"
    const [error, setError] = useState(null); // Manejamos errores
    const [productosSeleccionados, setProductosSeleccionados] = useState([]);
    const [mostrarSugerencias, setMostrarSugerencias] = useState(true); // Para mostrar las sugerencias
    const [totalAcumulado, setTotalAcumulado] = useState(0);
    const [medioPago, setMedioPago] = useState('');
    const [pagarVisible, setPagarVisible] = useState(false);
    const [pagoCon, setPagoCon] = useState(0);


    // Función para manejar la creación de una nueva mesa
    const handleCreateMesa = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

         // Validación: No permitir guardar si no hay productos seleccionados
         if (productosSeleccionados.length === 0) {
            setError('Debe seleccionar al menos un producto antes de guardar.');
            setLoading(false); // Detener la carga
            return; // Salir de la función si no hay productos
        }
         // Validación: No permitir guardar si el nombre está vacío o solo contiene espacios
         if (nombre.trim() === '') {
            setError('El nombre del cliente no puede estar vacío.');
            setLoading(false);
            return;
        }

        try {
            // Crear el objeto para la nueva mesa
            const newMesa = {
                Nombre: nombre,
                Estado: 'activo',
                Productos: productosSeleccionados // Enviamos los productos seleccionados
            };

            // Hacer la solicitud POST a la API
            const response = await axios.post('https://ddf7uggy3c.execute-api.us-east-2.amazonaws.com/mesas/mesas', newMesa);
            

            // Volver a la lista de clientes activos
            navigate('/sistema');
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

        } else {
            console.log('No se ha seleccionado ningún producto');
        }
       
    };

    // Función para manejar la selección de un nombre desde las sugerencias
    const handleSeleccionarSugerencia = (nombreSugerido) => {
        setNombre(nombreSugerido);
        setMostrarSugerencias(false); // Ocultamos las sugerencias después de seleccionar una
    };

    // Calcular total acumulado de productos
     const calcularTotalAcumulado = () => {
        return productosSeleccionados.reduce((total, producto) => {
            return total + (producto.cantidad * producto.precio);
        }, 0).toFixed(2);
    };

    // Función para manejar "Guardar y Pagar"
    const handleGuardarYPagar = () => {
          // Validación: No permitir guardar si no hay productos seleccionados
          if (productosSeleccionados.length === 0) {
            setError('Debe seleccionar al menos un producto antes de guardar.');
            setLoading(false); // Detener la carga
            return; // Salir de la función si no hay productos
        }
         // Validación: No permitir guardar si el nombre está vacío o solo contiene espacios
         if (nombre.trim() === '') {
            setError('El nombre del cliente no puede estar vacío.');
            setLoading(false);
            return;
        }
        
        setPagarVisible(true); // Mostrar opciones de pago
    };

    // Manejar el pago cuando se selecciona "Listo"
    const manejarPago = async () => {
        const totalAcumulado = calcularTotalAcumulado(); // Calcular el total
        const cambio = pagoCon > 0 ? pagoCon - totalAcumulado : 0;

        if (medioPago === 'efectivo' && cambio < 0) {
            alert('El monto ingresado no cubre el total.');
            return;
        }

        const newMesa = {
            Nombre: nombre,
            Estado: 'Pagado',
            Productos: productosSeleccionados,
            TotalVenta: totalAcumulado,
            MedioPago: medioPago,
        };

        try {
            setLoading(true);
            await axios.post('https://ddf7uggy3c.execute-api.us-east-2.amazonaws.com/mesas/mesas', newMesa);
            
            navigate('/sistema/mesas-pagadas');
        } catch (err) {
            console.error('Error al realizar el pago:', err);
            setError('No se pudo realizar el pago');
        } finally {
            setLoading(false);
        }
    };



    return (
        <div>
            {/* Botón para volver a la lista de clientes activos */}

            <h3>Ring Ring ¡Llegó alguien!</h3>

            {/* Mostrar el mensaje de error si existe */}
            {error ? <p style={{ color: 'red' }}>{error}</p> : null}

            {/* Formulario para crear o editar una mesa */}
            
                <div>
                    <div className='input_crear_cliente'>
                    <label htmlFor="Nombre">Dónde o quién </label>
                    <input
                        type="text"
                        id="Nombre"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        required
                    />
                    
                    {/* Mostrar sugerencias si el valor del input está vacío */}
                    {mostrarSugerencias && (
                        <ul className='nombres_sugerencias'>
                            {sugerenciasNombres.map((sugerencia, index) => (
                                <li
                                    key={index}
                                    onClick={() => handleSeleccionarSugerencia(sugerencia.nombre)}
                                    style={{ cursor: 'pointer', listStyleType: 'none' }}
                                >
                                    {sugerencia.nombre}
                                </li>
                            ))}
                        </ul>
                    )}
                    </div>
                    {/* Componente SeleccionarProducto */}
                    <SeleccionarProducto onSeleccionar={handleSeleccionarProducto} />
                </div>

                {/* Tabla de productos seleccionados */}
                <TablaProductos
                    productos={productosSeleccionados}
                    setProductos={setProductosSeleccionados}
                    calcularTotalAcumulado={calcularTotalAcumulado} 
                />
                 <div className='actions'>
                    <button disabled={loading} onClick={handleCreateMesa}>
                        {loading ? 'Creando...' : 'Guardar cliente'}
                    </button>
                    <button onClick={handleGuardarYPagar} disabled={loading}>Guardar y Pagar</button>
                    {/* Mostrar sección de pago solo cuando se selecciona "Guardar y Pagar" */}
                        {pagarVisible && (
                        <div>
                            <h3>Pagar</h3>

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

                            {/* Mostrar campo "Pago con" si el medio de pago es efectivo */}
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

                            <button onClick={manejarPago} disabled={loading}>Listo</button>
                        </div>
                    )}        
             </div>
        </div>
    );
}

export default CrearCliente;