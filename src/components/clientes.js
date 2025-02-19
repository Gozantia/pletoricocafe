import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDiaTrabajo } from '../DiaTrabajoContext';
import EstadisticasVentasDia from './estadisticasVentasDia';
import EstadisticasGastosDia from './estadisticasComprasDia';
import { FaPlus, FaTrash, FaCopy, FaSave, FaEdit, FaWindowClose } from "react-icons/fa";
import TablaProductos from './tablaProductosCopy';

const Clientes = () => { 
    const { idDelDiaDeTrabajo, setIdDelDiaDeTrabajo, forzarActualizacionVentas } = useDiaTrabajo();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [mesasPagadas, setMesasPagadas] = useState([]);
    const [mesasActivas, setMesasActivas] = useState([]);
    const [error, setError] = useState(null);
    const [crearMesa, setCrearMesa] = useState(false);
    const [nuevaMesa, setNuevaMesa] = useState({
        Nombre: '',
        Productos: [],
        Estado: 'Activo',
        TotalVenta: 0,  // Si es un número, mejor iniciar en 0
        MedioPago: '',
        monto_efectivo: 0,  // Si es un número, iniciar en 0
        monto_transferencia: 0  // Igual aquí
    });
    const [mesaSeleccionada, setMesaSeleccionada] = useState({
        Nombre: '',
        Productos: [],
        Estado: 'Activo',
        TotalVenta: 0,  // Si es un número, mejor iniciar en 0
        MedioPago: '',
        monto_efectivo: 0,  // Si es un número, iniciar en 0
        monto_transferencia: 0  // Igual aquí
    });

    const [estadisticasVentas, setEstadisticasVentas] = useState({
        efectivo: 0,
        transferencia: 0,
        total: 0,
    });
    const [actionPopup, setActionPopup] = useState(false);
    const [mensajeExito, setMensajeExito] = useState('');
    const [productPopUp, setProductPopUp] = useState(false);
    const [mostrarLista, setMostrarLista] = useState(false); 
    const [filtro, setFiltro] = useState('');
    const [productos, setProductos] = useState([]);
    const [productosFiltrados, setProductosFiltrados] = useState([]);
    const [productosSeleccionados, setProductosSeleccionados] = useState([]);
    const [modoEdicion, setModoEdicion] = useState(false); 
    const listaRef = useRef(null);
    const [editMode, setEditMode] = useState(null);


    // Función memoizada para cargar las mesas existentes
    const fetchMesas = useCallback(async () => {
        if (!idDelDiaDeTrabajo) return;
        try {
            const response = await axios.get(`https://ddf7uggy3c.execute-api.us-east-2.amazonaws.com/mesas/dia-trabajo/${idDelDiaDeTrabajo}`);
            setMesasPagadas(response.data.clientes_pagados);
            setMesasActivas(response.data.clientes_activos);
         
            console.log( "este es el id del día de las mesas pagadas", idDelDiaDeTrabajo, "y esto es lo que esta encontrando", response.data )
        } catch (err) {
            console.error('Error al obtener mesas', err);
            setError('Aún no han pagado una mondá');
        }
    }, [idDelDiaDeTrabajo]);

    // Cargar mesas al montar el componente
    useEffect(() => {
        fetchMesas();
    }, [fetchMesas]); // Agregamos fetchMesas a las dependencias aquí

    // Función para actualizar las mesas cuando la pestaña esté visible
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                fetchMesas();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [fetchMesas]); // Agregamos fetchMesas a las dependencias aquí también

    // Función para cerrar día
    const handlecerrarDia = async () => {
        setError(null);
         // Encapsulamos los datos en un objeto
        const datosActualizar = {
            dia_id: idDelDiaDeTrabajo,
            abierto: false,
            total_efectivo: estadisticasVentas.efectivo,
            total_transferencia: estadisticasVentas.transferencia,
            total: estadisticasVentas.total
        };

        try {
            const addVentatoDiaResponse = await axios.put('https://ddf7uggy3c.execute-api.us-east-2.amazonaws.com/mesas/dia-trabajo', datosActualizar );

            console.log("respuesta del evento put", addVentatoDiaResponse);
            setIdDelDiaDeTrabajo(null); 
            navigate(`/sistema/`);
          
        } catch (err) {
            console.error('Error al cerrar día', err);
            console.error("Detalles del error:", err.response?.data);
            setError('No se pudo cerrar el día');
        }
    };
    
        const handleOpenPopup = () => setActionPopup(true);
        const handleClosePopup = () => setActionPopup(false);
            
        const handleConfirm = () => {
            handlecerrarDia();
            setActionPopup(false);
          };

    const formatearHora = (fecha) => {
                return fecha.split(" ")[1].slice(0, 5); // Obtiene solo "12:33"
    };
 
    const calcularValor = (productos) => {
        return productos.reduce((total, prod) => total + prod.precio * prod.cantidad, 0);
    };


     // Agregar una nuevo cliente

     const toggleCrearMesa = () => {
        setCrearMesa(prev => !prev);
    };


   

    const handleInputNewMesa = (campo, valor) => {
        setNuevaMesa(prev => ({
            ...prev,
            [campo]: valor
        }));
    };

    

    const abrirProdModal = (mesa = null) => {
       
   /* console.log("mesaSeleccionada.Productos", mesa?.Productos); */
   const mesaConProductos = mesa ? mesa : { 
    Nombre: '',
    Productos: [],
    Estado: 'Activo',
    TotalVenta: 0,
    MedioPago: '',
    monto_efectivo: 0,
    monto_transferencia: 0
    };
    // Asigna un objeto vacío si es null

    setMesaSeleccionada(mesaConProductos);
    setModoEdicion(!!mesa); // Si hay una mesa, estamos editando; si no, estamos creando

        setProductPopUp(true);
    };
    
    const cerrarProdModal = () => {
     
        setMesaSeleccionada({
            Nombre: '',
            Productos: [],
            Estado: 'Activo',
            TotalVenta: 0,
            MedioPago: '',
            monto_efectivo: 0,
            monto_transferencia: 0
        });
        setModoEdicion(false);
        setProductPopUp(false);
    };

    const fetchProductos = async () => {
        try {
            const response = await fetch('https://ddf7uggy3c.execute-api.us-east-2.amazonaws.com/mesas/productos');
            const data = await response.json();
            // Ordenar productos alfabéticamente por el nombre
            const productosOrdenados = data.sort((a, b) => a.nombre.localeCompare(b.nombre));
            const productosAlReves = productosOrdenados.reverse()
            setProductos(productosAlReves);
            console.log( "productos:", productosAlReves );
            setProductosFiltrados(data); // Mostrar todos los productos al inicio
        } catch (error) {
            console.error('Error fetching productos:', error);
        }
    };

    const handleInputClick = () => {
        if (productos.length === 0) { // Evita llamar la API varias veces
            fetchProductos();
        }
        setMostrarLista(true);
    };

    const handleFiltroChange = (e) => {
        const valor = e.target.value;
        setFiltro(valor);
        
        setProductosFiltrados(
            productos.filter(producto => 
                producto.nombre.toLowerCase().includes(valor.toLowerCase())
            )
        );
    };
    


const agregarProducto = (producto) => {
    const productoConCantidad = { ...producto, cantidad: 1 }; // Inicializamos la cantidad en 1
    if (modoEdicion) {
        // Si estamos en modo edición, actualizamos los productos de la mesa seleccionada
        const productosActualizados = [...mesaSeleccionada.Productos, productoConCantidad ];
        setMesaSeleccionada({
            ...mesaSeleccionada,
            Productos: productosActualizados
        }); 
    } else {

    setProductosSeleccionados(prev => [
        ...prev,
        { ...producto, cantidad: 1 }
     ]);
    setMostrarLista(false); 
    setFiltro('');
    setProductosFiltrados(productos);
    }
};
const guardarProductos = () => {
    const totalProductos = productosSeleccionados.reduce((total, producto) => {
        return total + (producto.cantidad * producto.precio);
    }, 0);

    setNuevaMesa(prev => ({
        ...prev,
        Productos: productosSeleccionados,
        TotalVenta: totalProductos 
    }));
    cerrarProdModal();
};

// Detectar clics fuera de la lista
useEffect(() => {
    const handleClickOutside = (event) => {
        if (listaRef.current && !listaRef.current.contains(event.target)) {
            setMostrarLista(false);
        }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
        document.removeEventListener('mousedown', handleClickOutside);
    };
}, []);




    const guardarCliente = async () => { 
        if (!idDelDiaDeTrabajo) return;
        setLoading(true);
        setError(null);
        
        // Filtrar los valores vacíos o en 0 antes de enviarlos
            let datosAEnviar = { ...nuevaMesa,
                MedioPago: nuevaMesa.Estado === "Pagado" ? (nuevaMesa.MedioPago || "efectivo") : nuevaMesa.MedioPago,
                DiaTrabajoId: idDelDiaDeTrabajo 
             }; 
        
            // Filtrar valores vacíos o nulos
            datosAEnviar = Object.fromEntries(
                Object.entries(datosAEnviar).filter(([_, valor]) => valor !== '' && valor !== null && valor !== undefined)
            );
            console.log("nombre del cliente nuevo", datosAEnviar.Nombre);
        
       try {
        // Hacer la solicitud POST a la API
         const response = await axios.post('https://ddf7uggy3c.execute-api.us-east-2.amazonaws.com/mesas/mesas', datosAEnviar);
         const newMesaId = response.data.cliente_id;
         console.log("ID de la nueva mesa recién creada:", newMesaId);
        
        // Actualizar el día de trabajo con el ID de la nueva mesa
         await axios.put('https://ddf7uggy3c.execute-api.us-east-2.amazonaws.com/mesas/dia-trabajo', {
            dia_id: idDelDiaDeTrabajo,
            mesa_id: newMesaId,
            abierto: true
         });
         setMensajeExito("✅ Cliente guardado correctamente.");
         setTimeout(() => {
            setMensajeExito(null);
          }, 3000);
         setNuevaMesa({
            Nombre: '',
            Productos: [],
            Estado: 'Activo',
            TotalVenta: 0,
            MedioPago: '',
            montoEfectivo: 0,
            montoTransferencia: 0
        });
        setCrearMesa(false);
        fetchMesas();
        forzarActualizacionVentas();
        setProductosSeleccionados([]);
        setProductosFiltrados([]);
        setProductos([]);
        } catch (err) {
            console.error('Error al crear mesa', err);
            setError('Error al crear la nuevo cliente ');
        } finally {
            setLoading(false);

        }
    };   

   

    const handleEditClick = (mesa) => {
        setEditMode(mesa.id);
        const totalAcumulado = calcularValor(mesa.Productos);
        console.log( "item para editar", mesa.Nombre  );
        console.log( "total de los productos", totalAcumulado  );
        console.log( "Estado del cliente", mesa.Estado  );
        setMesaSeleccionada({ 
            ...mesa,
            Estado: "Pagado", 
            MedioPago: "efectivo", 
         });
      };
    
      const handleEditInputChange = (e, field) => {
        if (!mesaSeleccionada) return; //
       
        setMesaSeleccionada((prevMesa) => ({
            ...prevMesa,
            [field]: e.target.value,
        }));
     
      };

       // Función para calcular el total acumulado
  

    const editarCliente = async () => {
        if (!mesaSeleccionada) {
            setError("No hay una mesa seleccionada para editar.");
            return;
        }
        setLoading(true);
        setError(null);
        const totalAcumulado = calcularValor(mesaSeleccionada.Productos);
        const datosActualizados = {
            ...mesaSeleccionada,
            Estado: mesaSeleccionada.Estado,
            MedioPago:  mesaSeleccionada.MedioPago,
            TotalVenta: totalAcumulado,
            Productos: productosSeleccionados, // Actualizar lista de productos
        };
    
        try {
          const response =  await axios.put(
                `https://ddf7uggy3c.execute-api.us-east-2.amazonaws.com/mesas/mesas/${mesaSeleccionada.id}`,
                datosActualizados
            );
            console.log("esto fue lo que envió la solicitud", response);
            console.log("este es el total que se debió haber enviado", datosActualizados.TotalVenta );
            console.log("este es el Estado que se debió haber enviado", datosActualizados.Estado );
            // Solo actualiza la mesa seleccionada en el estado
            setMesasActivas((prevMesas) =>
                prevMesas.map((mesa) =>
                    mesa.id === mesaSeleccionada.id ? { ...mesa, ...datosActualizados } : mesa
                )
            );
            setEditMode(null);
            cerrarProdModal();
            setMensajeExito("✅ Éxito: Cliente actualizado");
            setProductosSeleccionados([]);
            setProductosFiltrados([]);
            setProductos([]);
            setTimeout(() => {
                setMensajeExito(null);
            }, 3000);
    
            // Si el estado cambió a "Pagado", forzar actualización de ventas
            if (datosActualizados.Estado === "Pagado") {
                forzarActualizacionVentas();
                fetchMesas();
            }
        } catch (error) {
            console.error("Error al actualizar mesa:", error);
        } finally {
            setLoading(false);

        }
    };


    useEffect(() => {
        if (modoEdicion && mesaSeleccionada) {
            // Cuando estamos en modo edición, se actualizan los productos seleccionados
            setProductosSeleccionados(mesaSeleccionada.Productos);
        } else {
            // Si no estamos en modo edición, se puede limpiar o poner los productos por defecto
            setProductosSeleccionados([]);
        }
    }, [modoEdicion, mesaSeleccionada]);



    return (
        <section className='container'>
            <h1>Hoy</h1>
            <EstadisticasGastosDia/>
            <EstadisticasVentasDia setEstadisticasVentas={setEstadisticasVentas} />
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {mensajeExito && <p style={{ color: 'green' }}>{mensajeExito}</p>}
            <div className='egresos-heading-block'>
            <h2>Clientes </h2>
            <button onClick={toggleCrearMesa}>
                {crearMesa ? <FaWindowClose /> : <FaPlus />}
            </button>
            </div>
            <table className='products-table gastos-table'>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Productos</th>
                        <th>Total</th>
                        <th>Estado</th>
                        <th>Hora</th>                   
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                 {/* Filas para los nueva mesa */}
                {crearMesa && 
                    <>
                    <tr>
                        <td className='tabla__prod-nombre'>
                         <input type="text"
                               value={nuevaMesa.Nombre}
                               onChange={(e) => handleInputNewMesa( 'Nombre', e.target.value)}
                         />
                         </td>
                          <td className='tabla__prod-nombre'>
                              {nuevaMesa.Productos.length === 0 ? (
                                 <button onClick={() => abrirProdModal()} >Productos</button>
                                ) : (
                                <>
                                 <ul>
                                 {nuevaMesa.Productos.map((prod, index)=> (
                                    <li key={index}>
                                     {prod.nombre}
                                     </li>
                                    
                                 ))
                                 }
                                  <li  onClick={() => abrirProdModal()}> <FaPlus /> </li>
                                </ul>
                                </>
                                )}      
                         </td>   
                         <td  className='tabla__prod-cantidad' > {nuevaMesa.TotalVenta }</td>  
                         <td  className='tabla__prod-precio' colSpan="2" >
                            <select
                                value={nuevaMesa.Estado || 'Activo'} 
                                onChange={(e) => handleInputNewMesa( 'Estado', e.target.value)}    
                            >
                                <option value="Activo">Activo</option>
                                <option value="Pagado">Pagado</option>
                            </select>
                            {nuevaMesa.Estado === "Pagado" && (
                              <>
                              <span>Medio de pago: </span>
                               <select
                                value={nuevaMesa.MedioPago || 'efectivo'} 
                                onChange={(e) => handleInputNewMesa( 'MedioPago', e.target.value)}
                                >
                                <option value="transferencia">transferencia</option>
                                <option value="efectivo">efectivo</option> 
                                <option value="transfecash">transfecash</option>  
                            </select>
                            {nuevaMesa.MedioPago ==="transfecash" && (
                                        <>
                                          <label>
                                            Parte en efectivo
                                            <input type="number" placeholder="Monto en efectivo" value={nuevaMesa.monto_efectivo || 0} onChange={(e) => handleInputNewMesa( 'monto_efectivo', e.target.value)} />
                                          </label>
                                          <label>
                                            Parte en Transferencia
                                            <input type="number" placeholder="Monto en transferencia" value={nuevaMesa.monto_transferencia || 0 } onChange={(e) => handleInputNewMesa( 'monto_transferencia', e.target.value)} />
                                          </label>    
                                        </>
                                    )}:

                             </>
                            )}                                        
                         </td>
                         <td  className='tabla__prod-precio' >
                          <button
                          onClick={guardarCliente}
                          disabled={!nuevaMesa.Nombre.trim() || nuevaMesa.Productos.length === 0}>
                          {loading ? "Guardando..." : "Guardar"}
                          </button>
                        </td>
                        </tr>
                    </> }
                {mesasActivas.map((mesa, index) => (
                    <tr key={index} className="clientes_activos">
                        <td  className='tabla__prod-nombre' >{mesa.Nombre}</td>
                        <td  className='tabla__prod-items' > 
                        <ul  onClick={() => abrirProdModal(mesa)} >
                            {mesa.Productos.map((prod, index) => (
                            <li key={index}>
                                {prod.nombre} (x{prod.cantidad}) - ${prod.precio}
                            </li>
                            ))}
                            
                        </ul>
                        </td>
                        <td  className='tabla__prod-cantidad' >${calcularValor(mesa.Productos)}</td>
                        <td  className='tabla__prod-precio' >     
                            {editMode === mesa.id ? (
                                    <div className="edit-estate">
                                  <select
                                   value= "Pagado"
                                   onChange={(e) => handleEditInputChange(e, "Estado")}
                                  >
                                   <option value="Pagado"> Pagado </option>
                                   <option value="Activo"> Activo </option>
                                  </select>
                                  <select
                                   value={mesaSeleccionada?.MedioPago || "efectivo"}
                                   onChange={(e) => handleEditInputChange(e, "MedioPago")}
                                  >
                                   <option value="efectivo"> efectivo </option>
                                   <option value="transferencia"> transferencia </option>
                                   <option value="transfecash"> transfecash </option>
                                  </select>
                                  {mesaSeleccionada?.MedioPago === "transfecash" && (
                                   <>
                                   <label>
                                    Parte en efectivo
                                    <input type="number" placeholder="Monto en efectivo" value={mesaSeleccionada?.monto_efectivo || 0} onChange={(e) => handleEditInputChange( e, 'monto_efectivo')} />
                                  </label>
                                  <label>
                                    Parte en Transferencia
                                    <input type="number" placeholder="Monto en transferencia" value={mesaSeleccionada?.monto_transferencia || 0 } onChange={(e) => handleEditInputChange( e, 'monto_transferencia')} />
                                    </label>  
                                  </> 
                                  )}
                               
                       </div>
                        ): 
                        <div onClick={() => handleEditClick(mesa)}> {mesa.Estado}</div>   
                         }
                        </td>
                        <td  className='tabla__prod-precio' >{formatearHora(mesa.FechaCreacion)}</td>
                        <td className=' item-actions'>
                        {editMode === mesa.id && (
                            <>
                               <button id= {mesa.id}
                                        onClick={() => {
                                            // Asegurarse de que mesaSeleccionada tenga los últimos datos
                                            if (mesaSeleccionada) {
                                                setMesaSeleccionada((prevMesa) => ({
                                                    ...prevMesa,
                                                    Productos: productosSeleccionados, // Sincronizar productos
                                                }));
                                                editarCliente();
                                            } else {
                                                setError("No hay una mesa seleccionada para editar.");
                                            }
                                        }}
                                    >
                               Actualizar mesa
                           </button>
                           <button  onClick={() => setEditMode(false)}>
                             Cancelar
                           </button>
                           </>
                            )}
                        </td>
                     </tr>
                    ))}
                    {mesasPagadas.map((mesa, index) => (
                    <tr key={index} className="clietes_pagados">
                        <td  className='tabla__prod-nombre' >{mesa.Nombre}</td>
                        <td  className='tabla__prod-items' > 
                        <ul>
                            {mesa.Productos.map((prod, index) => (
                            <li key={index}>
                                {prod.nombre} (x{prod.cantidad}) - ${prod.precio}
                            </li>
                            ))}
                        </ul>
                        </td>
                        <td  className='tabla__prod-cantidad' > {mesa.TotalVenta} </td>
                        <td  className='tabla__prod-precio' > {mesa.Estado} {mesa.MedioPago} </td>
                        <td  className='tabla__prod-precio' > {formatearHora(mesa.FechaCreacion)}</td>
                        <td className=' item-actions'> </td>
                     </tr>
                    ))}
                </tbody>
            </table>
            <div className='actions'>
                <button onClick={handleOpenPopup}>Cerrar día</button>
            </div>
            <div className={`popup-actions ${actionPopup ? "active" : ""}`}>
                <div className='popup_actions-content'>
                <h3>¿Estás seguro?</h3>
                <button onClick={handleConfirm}>  Si</button> <button onClick={handleClosePopup}> Cancelar </button>
                </div>
            </div>   
            <div className= {`popup-actions ${productPopUp ? "active" : ""}`}>
                <div className="popup_actions-content">
                <h3>{modoEdicion && mesaSeleccionada?.Nombre ? `Orden de ${mesaSeleccionada?.Nombre}` : "Seleccionar Productos"}</h3>
                    <input 
                    type="text" 
                    placeholder="Buscar producto..." 
                    value={filtro}
                    onChange={handleFiltroChange}
                    onClick={handleInputClick} // Llama la API al hacer clic
                    />
                    {mostrarLista && (
                     <ul className='lista-prods' ref={listaRef}>
                     {productosFiltrados.map((producto) => (
                         <li key={producto.id} onClick={() => agregarProducto(producto)}>
                             {producto.nombre}
                         </li>
                     ))}
                 </ul>
                    )}
                
                    <h4>Productos seleccionados:</h4>
                   <TablaProductos
                    productos={productosSeleccionados}
                    setProductos={setProductosSeleccionados}
                    />

                    <button
                    onClick={modoEdicion ? editarCliente : guardarProductos}
                    >
                    {loading 
                        ? "Guardando..." 
                        : modoEdicion 
                            ? "Guardar Cambios" 
                            : "Guardar"
                    }
                    </button>
                    <button onClick={cerrarProdModal}>Cancelar</button>
                </div>
            </div>
        
        </section>
    );
};

export default Clientes;
