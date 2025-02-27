import React, { useState } from 'react';
import axios from 'axios';
import SeleccionarProducto from './SeleccionarProducto';
import TablaProductos from './tablaProductos'; // Importamos el nuevo componente TablaProductos
import sugerenciasNombres from '../sugerencias_nombres_mesas.json'; // Importamos el archivo JSON de sugerencias
import { useNavigate } from 'react-router-dom';
import { useDiaTrabajo } from '../DiaTrabajoContext';


function CrearCliente() {
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
    const { idDelDiaDeTrabajo } = useDiaTrabajo();
    const [montoEfectivo,setMontoEfectivo] = useState(0);
    const [montoTransferencia,setMontoTransferencia] = useState(0);
    const diaId = idDelDiaDeTrabajo;

    // Función para manejar la creación de una nueva mesa
    const handleCreateMesa = async (e) => {
        
        if (!diaId) {
            setError('No hay un día de trabajo activo.');
            return; // Exit the function early
        }

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
    
            // Crear el objeto para la nueva mesa
            const newMesa = {
                Nombre: nombre,
                Estado: 'activo',
                Productos: productosSeleccionados,
                DiaTrabajoId: diaId
            };
            try {
            // Hacer la solicitud POST a la API
            const response = await axios.post('https://ddf7uggy3c.execute-api.us-east-2.amazonaws.com/mesas/mesas', newMesa);
            const newMesaId = response.data.cliente_id;
            console.log("ID de la nueva mesa recién creada:", newMesaId);
    
            // Actualizar el día de trabajo con el ID de la nueva mesa
            const addVentaToDiaResponse = await axios.put('https://ddf7uggy3c.execute-api.us-east-2.amazonaws.com/mesas/dia-trabajo', {
                dia_id: diaId,
                mesa_id: newMesaId,
                abierto: true
            });
            console.log("Respuesta de la actualización del día de trabajo:", addVentaToDiaResponse.data);
            console.log("La mesa se creó en este día:", diaId);
    
            navigate(`/sistema/`);
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
        }, 0).toFixed(0);
    };

    // Función para manejar "Guardar y Pagar"
    const handleGuardarYPagar = () => {

        if (!diaId) {
            setError('No hay un día de trabajo activo.');
            return; // Exit the function early
        }

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
        // Verificar si el medio de pago ha sido seleccionado
            if (!medioPago) {
                setError('Por favor, selecciona un medio de pago (Efectivo o Transferencia).');
                return;
            }

        const totalAcumulado =  Number(calcularTotalAcumulado()).toFixed(0); // Calcular el total
        const cambio = pagoCon > 0 ? pagoCon - totalAcumulado : 0;

        if (medioPago === 'efectivo' && cambio < 0) {
            alert('El monto ingresado no cubre el total.');
            return;
        }


            setLoading(true);

            const newMesa = {
                Nombre: nombre,
                Estado: 'Pagado',
                Productos: productosSeleccionados,
                MedioPago: medioPago,
                DiaTrabajoId : diaId                
            };

            
            if (medioPago === 'transfecash') {
                
                newMesa.TotalVenta = montoEfectivo + montoTransferencia; 
                newMesa.monto_efectivo = montoEfectivo; 
                newMesa.monto_transferencia = montoTransferencia; 
            } else {
                
                newMesa.TotalVenta =totalAcumulado; 
            }

            // Debugging: Log the newMesa object
            console.log('Datos enviados al backend:', newMesa);
        

            try {
            // Hacer la solicitud POST a la API
            const response = await axios.post('https://ddf7uggy3c.execute-api.us-east-2.amazonaws.com/mesas/mesas', newMesa);
            const newMesaId = response.data.cliente_id;
            console.log("id nueva mesa",newMesaId)

            // Actualizar el día de trabajo con el ID de la nueva mesa
           await axios.put('https://ddf7uggy3c.execute-api.us-east-2.amazonaws.com/mesas/dia-trabajo', {
                dia_id: diaId,   // El ID del día de trabajo actual
                mesa_id: newMesaId,
                abierto: true   // El ID de la mesa recién creada
              
            });
            navigate('/sistema/mesas-pagadas');
        } catch (err) {
            console.error('Error al realizar el pago:', err);
            setError('No se pudo realizar el pago');
        } finally {
            setLoading(false);
        }
    };



    return (
        <section className='container'>
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
                        onChange={(e) => {
                            setNombre(e.target.value);
                            setMostrarSugerencias(e.target.value === ''); // Mostrar sugerencias solo si el input está vacío
                        }}
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

                            {/* Mostrar campo "Pago con" si el medio de pago es efectivo */}
                            {medioPago === 'efectivo' && (
                                <div>
                                        
                                    <label> 
                                    (opcional)  Devuelta de:
                                        <input
                                            type="number"
                                            value={pagoCon}
                                            onChange={(e) => setPagoCon(Number(e.target.value))}
                                        />
                                    </label>
                                    

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
        </section>
    );
}

export default CrearCliente;